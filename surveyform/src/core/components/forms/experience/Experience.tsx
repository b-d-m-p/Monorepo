import React, { useState, useEffect, useRef } from "react";
import { FormCheck } from "react-bootstrap";
import { FormattedMessage } from "~/core/components/common/FormattedMessage";
// import { isOtherValue, removeOtherMarker, addOtherMarker } from './Checkboxgroup';
import {
  FormInputProps,
  useFormContext,
  useVulcanComponents,
} from "@vulcanjs/react-ui";
import { useEntities } from "~/core/components/common/EntitiesContext";
import { FormControl } from "react-bootstrap";
import get from "lodash/get.js";
import IconComment from "~/core/components/icons/Comment";
import IconCommentDots from "~/core/components/icons/CommentDots";
import { useIntlContext } from "@vulcanjs/react-i18n";
import isEmpty from "lodash/isEmpty.js";

interface ExperienceProps extends FormInputProps {
  showDescription: boolean;
}

export const Experience = (props: ExperienceProps) => {
  const {
    refFunction,
    path,
    inputProperties,
    itemProperties = {},
    document,
    showDescription,
  } = props;
  const Components = useVulcanComponents();
  const { isFirstQuestion, questionId } = itemProperties;

  const commentPath = path.replace("__experience", "__comment");
  const commentValue = get(document, commentPath);

  // @ts-expect-error
  const { options = [], value, ...otherInputProperties } = inputProperties;
  const hasValue = !isEmpty(value);

  // open the comment widget if there is already a comment
  const [showCommentInput, setShowCommentInput] = useState(!!commentValue);

  const { data, loading, error } = useEntities();
  const { entities } = data;
  const entity = entities?.find((e) => e.id === questionId);

  return (
    <Components.FormItem
      path={/*inputProperties.*/ path}
      label={inputProperties.label}
      showDescription={showDescription}
      {...itemProperties}
    >
      {entity?.example && <CodeExample {...entity.example} />}
      <div className="experience-contents">
        <div className="experience-options">
          {options.map((option, i) => {
            const isChecked = value === option.value;
            const checkClass = hasValue
              ? isChecked
                ? "form-check-checked"
                : "form-check-unchecked"
              : "";
            return (
              // @ts-expect-error
              <FormCheck
                {...otherInputProperties}
                key={i}
                layout="elementOnly"
                type="radio"
                // @ts-ignore
                label={<Components.FormOptionLabel option={option} />}
                value={option.value}
                name={path}
                id={`${path}.${i}`}
                path={`${path}.${i}`}
                ref={refFunction}
                checked={isChecked}
                className={checkClass}
              />
            );
          })}
        </div>

        <CommentTrigger
          value={commentValue}
          showCommentInput={showCommentInput}
          setShowCommentInput={setShowCommentInput}
          isFirstQuestion={isFirstQuestion}
        />
      </div>
      {showCommentInput && (
        <CommentInput
          path={commentPath}
          value={commentValue}
          questionLabel={inputProperties.label}
          questionEntity={entity}
          questionValue={value}
          questionOptions={options}
          questionPath={path}
        />
      )}
    </Components.FormItem>
  );
};

const CodeExample = ({ language, code, codeHighlighted }) => {
  const Components = useVulcanComponents();
  return (
    <div className="code-example">
      <h5 className="code-example-heading">
        <FormattedMessage id="general.code_example" />
      </h5>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: codeHighlighted }}></code>
      </pre>
    </div>
  );
};

import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";

const CommentTrigger = ({
  value,
  showCommentInput,
  setShowCommentInput,
  isFirstQuestion = false,
}) => {
  const [show, setShow] = useState(isFirstQuestion);

  const isActive = showCommentInput || !!value;
  const intl = useIntlContext();
  const target = useRef(null);

  return (
    <div className="comment-trigger-wrapper">
      <button
        ref={target}
        className={`comment-trigger comment-trigger-${
          isActive ? "active" : "inactive"
        }`}
        type="button"
        aria-describedby="popover-basic"
        aria-label={intl.formatMessage({ id: "experience.leave_comment" })}
        title={intl.formatMessage({ id: "experience.leave_comment" })}
        onClick={() => {
          setShowCommentInput(!showCommentInput);
        }}
        onMouseOver={() => {
          setShow(true);
        }}
        onMouseOut={() => {
          setShow(false);
        }}
      >
        {value ? <IconCommentDots /> : <IconComment />}
        <span className="visually-hidden">
          <FormattedMessage id="experience.leave_comment" />
        </span>
      </button>
      <Overlay
        target={target.current}
        show={show}
        placement={window?.innerWidth < 600 ? "right" : "top"}
      >
        {(props) => (
          <Tooltip id="leave_comment" {...props}>
            <FormattedMessage id="experience.leave_comment_short" />
          </Tooltip>
        )}
      </Overlay>
    </div>
  );
};

const CommentInput = ({
  path,
  value,
  questionLabel,
  questionValue,
  questionOptions,
  questionEntity,
  questionPath,
}) => {
  const { getDocument, updateCurrentValues } = useFormContext();
  const Components = useVulcanComponents();

  // if label has been translated, use that to override entity name
  const label =
    (questionLabel.toLowerCase() !== questionPath && questionLabel) ||
    questionEntity?.name;
  const response = questionOptions?.find(
    (o) => o.value === questionValue
  )?.label;

  return (
    <div className="comment-input">
      <h5 className="comment-input-heading">
        <FormattedMessage
          id="experience.leave_comment"
          values={{ label }}
          html={true}
        />
      </h5>
      <p className="comment-input-subheading">
        {questionValue ? (
          <FormattedMessage
            id="experience.tell_us_more"
            values={{ response }}
            html={true}
          />
        ) : (
          <FormattedMessage id="experience.tell_us_more_no_value" />
        )}
      </p>
      <FormControl
        as="textarea"
        onChange={(event) => {
          let value = event.target.value;
          if (value === "") {
            updateCurrentValues({ [path]: null });
          } else {
            updateCurrentValues({ [path]: value });
          }
        }}
        value={value}
        // ref={refFunction}
        // {...inputProperties}
      />
    </div>
  );
};

export default Experience;
