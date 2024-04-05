import {
    Bucket,
    FeaturesOptions,
    ResponseData,
    ResultsSubFieldEnum,
    SimplifiedSentimentOptions,
    StandardQuestionData
} from '@devographics/types'
import { ChartState, Views } from '../types'
import { BoxPlotRow, FacetRow, SingleBarRow } from '../HorizontalBarRow'
import { DataSeries, FacetItem } from 'core/filters/types'
import { usePageContext } from 'core/helpers/pageContext'
import { applySteps } from './steps'
import { getViewDefinition } from './views'
import sortBy from 'lodash/sortBy'
import take from 'lodash/take'
import sumBy from 'lodash/sumBy'
import { OrderOptions } from 'core/charts/common2/types'
import { BlockVariantDefinition } from 'core/types'
import uniq from 'lodash/uniq'

export const sortOptions = {
    experience: Object.values(FeaturesOptions),
    sentiment: Object.values(SimplifiedSentimentOptions)
}

export const getChartCurrentEdition = ({
    serie,
    block
}: {
    serie: DataSeries<StandardQuestionData>
    block: BlockVariantDefinition
}) => {
    const subField = block?.queryOptions?.subField || ResultsSubFieldEnum.RESPONSES
    const { currentEdition } = serie.data[subField] as ResponseData
    return currentEdition
}

export const getChartCompletion = ({
    serie,
    block
}: {
    serie: DataSeries<StandardQuestionData>
    block: BlockVariantDefinition
}) => {
    const currentEdition = getChartCurrentEdition({ serie, block })
    return currentEdition.completion
}

export const getChartBuckets = ({
    serie,
    block,
    chartState
}: {
    serie: DataSeries<StandardQuestionData>
    block: BlockVariantDefinition
    chartState: ChartState
}) => {
    const { view, sort, facet, order } = chartState
    const { steps, getValue } = getViewDefinition(view)
    const currentEdition = getChartCurrentEdition({ serie, block })

    let buckets = currentEdition.buckets
    if (steps) {
        buckets = applySteps(buckets, steps)
    }
    if (sort && getValue) {
        if (facet) {
            buckets = sortBy(buckets, bucket => {
                // find the facet bucket targeted by the sort
                const relevantFacetBucket = bucket.facetBuckets.find(fb => fb.id == sort)
                if (!relevantFacetBucket) {
                    return 0
                } else {
                    const value = getValue(relevantFacetBucket)
                    return value
                }
            })
        } else {
            buckets = sortBy(buckets, bucket => {
                const value = getValue(bucket)
                return value
            })
        }
        if (order === OrderOptions.DESC) {
            buckets = buckets.toReversed()
        }
    }
    return buckets
}

export const getRowComponent = (bucket: Bucket, chartState: ChartState) => {
    const { view } = chartState
    const { facetBuckets } = bucket
    const hasFacetBuckets = facetBuckets && facetBuckets.length > 0
    if (hasFacetBuckets) {
        if (view === Views.BOXPLOT) {
            return BoxPlotRow
        } else if (view === Views.PERCENTAGE_BUCKET) {
            return FacetRow
        } else {
            return SingleBarRow
        }
    } else {
        return SingleBarRow
    }
}

export const useQuestionMetadata = (facet?: FacetItem) => {
    if (!facet) return
    const { id, sectionId } = facet
    const allQuestions = useAllQuestionsMetadata()
    const question = allQuestions.find(q => q.id === id && q.sectionId === sectionId)
    return question
}

export const useAllQuestionsMetadata = () => {
    const context = usePageContext()
    const { currentEdition } = context
    const questions = []
    for (const section of currentEdition.sections) {
        for (const question of section.questions) {
            questions.push({ sectionId: section.id, ...question })
        }
    }
    return questions
}

/*

Calculate how much to offset a row by to line up whichever column/cell the chart is sorted by

*/
export const getRowOffset = ({
    buckets,
    bucket,
    chartState
}: {
    buckets: Bucket[]
    bucket: Bucket
    chartState: ChartState
}) => {
    const { view, sort } = chartState
    const { getValue } = getViewDefinition(view)
    if (getValue && [Views.PERCENTAGE_BUCKET, Views.FACET_COUNTS].includes(view) && sort) {
        // check if a bucket contains the facet that we're currently sorting by
        const containsSortedFacet = (b: Bucket) => b.facetBuckets.some(fb => fb.id === sort)

        // only offset bucket if it actually contains whatever we're sorting by
        if (containsSortedFacet(bucket)) {
            const getOffset = (bucket: Bucket) => {
                const { facetBuckets } = bucket
                const currentFacetBucketIndex = facetBuckets.findIndex(fb => fb.id === sort)
                const previousFacetBuckets = take(facetBuckets, currentFacetBucketIndex)
                const valuesSum = sumBy(previousFacetBuckets, fb => getValue(fb))
                return valuesSum
            }
            // find the first bucket that has the value we're sorting by as a starting
            // point to calculate offsets
            const firstBucketWithFacet = buckets.find(containsSortedFacet)
            // only proceed if at least one bucket contains the facet we're sorting by
            if (firstBucketWithFacet) {
                const firstBucketOffset = getOffset(firstBucketWithFacet)
                const currentBucketOffset = getOffset(bucket)
                return currentBucketOffset - firstBucketOffset
            }
        }
    }
    return 0
}

export const getAllFacetBucketIds = ({
    series,
    block,
    chartState
}: {
    series: Array<DataSeries<StandardQuestionData>>
    block: BlockVariantDefinition
    chartState: ChartState
}) => {
    return uniq(
        series
            .map(serie => {
                const buckets = getChartBuckets({ serie, block, chartState })
                return buckets.map(bucket => bucket.facetBuckets.map(facetBucket => facetBucket.id))
            })
            .flat()
            .flat()
    )
}