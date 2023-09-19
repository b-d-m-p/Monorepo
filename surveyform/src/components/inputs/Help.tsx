import React from "react";
import { FormattedMessage } from "../common/FormattedMessage";
import { getQuestioni18nIds } from "~/i18n/survey";

export const Help = (props) => {
  const i18n = getQuestioni18nIds(props);
  return (
    <div className="form-help">
      <FormattedMessage id={i18n.base} />
    </div>
  );
};

export default Help;
