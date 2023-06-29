import { normalizeResponse } from "../normalize";
import { getBulkOperation } from "../helpers";
import pick from "lodash/pick.js";
import { getNormResponsesCollection } from "@devographics/mongo";
import { fetchEntities } from "~/lib/api/fetch";
import { ResponseDocument, SurveyMetadata } from "@devographics/types";
import { logToFile } from "@devographics/helpers";
import {
  NormalizeInBulkResult,
  BulkOperation,
  NormalizedDocumentMetadata,
  DocumentGroups,
} from "../types";

/*

Normalization

*/
export const defaultLimit = 999;
const isSimulation = true;
const verbose = true;

/*

We can normalize:

A) a specific set of documents (if responsesIds is passed)
B) a specific question on *all* documents (if questionId) is passed
C) *all* questions on *all* documents (if neither is passed)

*/
export const normalizeInBulk = async ({
  survey,
  responses,
  limit,
  questionId,
  isRenormalization = false,
}: {
  survey: SurveyMetadata;
  responses: ResponseDocument[];
  limit?: number;
  questionId?: string;
  isRenormalization?: boolean;
}) => {
  const startAt = new Date();
  let progress = 0;
  const count = responses.length;
  const tickInterval = Math.round(count / 200);

  // if no fieldId is defined then we are normalizing the entire document and want
  // to replace everything instead of updating a single field
  const isReplace = !questionId;

  let allDocuments: NormalizedDocumentMetadata[] = [];

  const mutationResult: NormalizeInBulkResult = {
    normalizedDocuments: [],
    unmatchedDocuments: [],
    unnormalizableDocuments: [],
    errorDocuments: [],
    discardedDocuments: [],
    discardedCount: 0,
    totalDocumentCount: 0,
    errorCount: 0,
    limit,
    isSimulation,
  };

  const bulkOperations: BulkOperation[] = [];

  const entities = await fetchEntities();

  // console.log(JSON.stringify(selector, null, 2))

  // iterate over responses to populate bulkOperations array
  for (const response of responses) {
    const normalizationResult = await normalizeResponse({
      document: response,
      verbose,
      isSimulation,
      entities,
      questionId,
      isBulk: true,
      isRenormalization,
    });

    progress++;
    if (limit && limit > 1000 && progress % tickInterval === 0) {
      console.log(`  -> Normalized ${progress}/${count} responses…`);
    }

    if (!normalizationResult) {
      mutationResult.errorCount++;
      allDocuments.push({
        responseId: response._id,
        errors: [
          {
            type: "normalization_failed",
          },
        ],
      });
    } else {
      // keep track of total error count
      if (normalizationResult.errors.length > 0) {
        mutationResult.errorCount += normalizationResult.errors.length;
      }

      if (normalizationResult.discard) {
        // keep track of documents discarded (empty documents)
        mutationResult.discardedCount++;
        mutationResult.discardedDocuments.push(normalizationResult.responseId);
      } else {
        // if normalization was valid, add it to array of all documents and bulk operations array
        allDocuments.push(
          pick(normalizationResult, [
            "errors",
            "responseId",
            "normalizedResponseId",
            "normalizedFieldsCount",
            "prenormalizedFieldsCount",
            "regularFieldsCount",
            "normalizedFields",
          ])
        );
        const { selector, modifier } = normalizationResult;
        const operation = getBulkOperation(selector, modifier, isReplace);
        bulkOperations.push(operation);
      }
    }
  }

  /*

  Note: when renormalizing a specific field with onlyUnnormalized=false, *all* responses where
  that field exists will be selected. This might include responses who do not have a corresponding
  normalized response document (for example, because they have been discarded for being empty).

  Because bulkWrite() will run with upsert=false when normalizing a specific field, 
  these responses will not be created.

  Make sure to only renormalize a specific field *after* having normalized all fields for all documents.

  */
  // see https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite

  const normResponsesCollection = await getNormResponsesCollection(survey);
  try {
    if (!isSimulation) {
      console.log(`-> Now starting bulk write…`);
      const operationResult = await normResponsesCollection.bulkWrite(
        bulkOperations
      );
      console.log("// operationResult");
      console.log(operationResult);
    }
  } catch (error) {
    console.log("// Bulk write error");
    // console.log(JSON.stringify(bulkOperations, null, 2))
    throw error;
  }

  const endAt = new Date();
  const duration = Math.ceil((endAt.valueOf() - startAt.valueOf()) / 1000);
  // duration in seconds
  mutationResult.duration = duration;

  /*

  Sort documents in different "buckets" to help with logging

  */
  allDocuments = allDocuments.map((doc) => {
    let group;
    if (doc.errors && doc.errors.length > 0) {
      group = DocumentGroups.ERROR;
    } else {
      if (doc.normalizedFields?.some((field) => field.raw)) {
        // doc is not empty
        if (
          doc.normalizedFields?.every((field) => field.normTokens.length > 0)
        ) {
          // every question has had a match
          group = DocumentGroups.NORMALIZED;
        } else {
          // there are unmatched questions
          group = DocumentGroups.UNMATCHED;
        }
      } else {
        group = DocumentGroups.UNNORMALIZABLE;
      }
    }
    return { ...doc, group };
  });

  for (const groupKey in DocumentGroups) {
    const groupName = DocumentGroups[groupKey];
    mutationResult[`${groupName}Documents`] = allDocuments.filter(
      (d) => d.group === groupName
    );
  }

  mutationResult.totalDocumentCount = allDocuments.length;

  await logToFile(
    `normalizeInBulk/allDocuments.json_${new Date().toString()}`,
    allDocuments
  );
  await logToFile(
    `normalizeInBulk/mutationResult_${new Date().toString()}.json`,
    mutationResult
  );

  console.log(
    `👍 Normalized ${progress - mutationResult.discardedCount} responses ${
      mutationResult.discardedCount > 0
        ? `(${mutationResult.discardedCount} responses discarded)`
        : ""
    }. (${endAt}) - ${duration}s`
  );

  return mutationResult;
};