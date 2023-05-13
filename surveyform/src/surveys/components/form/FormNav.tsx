"use client";
/*

1. Show list of sections
2. For each section, compare section questions with current response document
3. Figure out completion percentage

TODO

- Simplify this by using already-parsed with getQuestionObject() outline

*/
// import { useFormContext } from "@devographics/react-form";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FormattedMessage } from "~/core/components/common/FormattedMessage";
import FormNavItem from "./FormNavItem";
import { getCompletionPercentage } from "~/responses/helpers";
import { Button } from "~/core/components/ui/Button";
import { Loading } from "~/core/components/ui/Loading";
import { useEdition } from "../SurveyContext/Provider";
import { FormInputProps } from "~/surveys/components/form/typings";

// TODO
// const getOverallCompletionPercentage = (response) => {

// }

const SurveyNav = (props: FormInputProps) => {
  const { readOnly, response, stateStuff } = props;
  const {
    currentFocusIndex,
    currentTabindex,
    setCurrentTabindex,
    setCurrentFocusIndex,
  } = stateStuff;
  const [navLoading, setNavLoading] = useState(false);
  const [shown, setShown] = useState(false);

  const { edition, editionHomePath } = useEdition();

  const sections = edition.sections; //surveys.find((o) => o.slug === survey.slug)?.outline;
  if (!sections) {
    throw new Error(`Survey or outline not found for slug ${edition.id}`);
  }
  const overallCompletion =
    !readOnly && response && getCompletionPercentage({ response, edition });

  useEffect(() => {
    const keyPressHandler = (e) => {
      if (currentFocusIndex !== null) {
        if (currentTabindex === null) {
          /*throw new Error(
            `currentFocusIndex was not null, but currentTabindex was null during keypress`
          );*/
          console.error(
            `currentFocusIndex was not null, but currentTabindex was null during keypress`
          );
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setCurrentTabindex(currentTabindex - 1);
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setCurrentTabindex(currentTabindex + 1);
        }
      }
    };
    document.addEventListener("keydown", keyPressHandler);
    return () => {
      document.removeEventListener("keydown", keyPressHandler);
    };
  }, [currentFocusIndex]);

  return (
    <nav
      className={`section-nav ${
        shown ? "section-nav-shown" : "section-nav-hidden"
      }`}
      aria-label={`${edition.survey.name} ${edition.year}`}
    >
      <div className="section-nav-inner">
        <h2 className="section-nav-heading">
          <Link href={editionHomePath}>
            {edition.survey.name} {edition.year}
          </Link>
        </h2>
        <Button
          className="section-nav-head"
          onClick={(e) => {
            setShown(!shown);
          }}
        >
          <span className="section-nav-head-left">
            <h3 className="section-nav-toc">
              <FormattedMessage id="general.table_of_contents" />
            </h3>
            {overallCompletion && (
              <span className="section-nav-completion">
                {overallCompletion}%
              </span>
            )}
          </span>
          <span className="section-nav-toggle">{shown ? "▼" : "▶"}</span>
        </Button>
        <div className="section-nav-contents">
          <ul>
            {sections.map((section, i) => (
              <FormNavItem
                {...props}
                currentSection={section}
                setShown={setShown}
                number={i + 1}
                key={i}
                setNavLoading={setNavLoading}
              />
            ))}
            {/* {response && <li>Overall: {getOverallCompletionPercentage(response)}%</li>} */}
          </ul>
          <p className="completion-message">
            <FormattedMessage id="general.all_questions_optional" />
          </p>
        </div>
        {navLoading && (
          <div className="section-nav-loading">
            <Loading />
          </div>
        )}
      </div>
    </nav>
  );
};

export default SurveyNav;