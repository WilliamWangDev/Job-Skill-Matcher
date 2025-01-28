import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Tooltip } from "react-tooltip";

function Results({ results, searchPerformed }) {
  if (!searchPerformed) {
    return null; // Don't show anything if a search hasn't been performed
  }

  if (!results || results.length === 0) {
    return (
      <p className="text-gray-500 mt-4">
        No matches found. Try different skills.
      </p>
    );
  }

  return (
    <>
      <div className="w-full max-w-2xl mt-12">
        <h2 className="text-xl font-semibold text-gray-800 select-none uppercase py-2">
          Matched Roles ({results.length})
        </h2>
        <ul className="mt-4 space-y-6">
          {results.map((result, index) => (
            <li
              key={index}
              className="py-6 px-8 border rounded-xl shadow-sm bg-white hover:shadow-lg gap-1 flex flex-col"
            >
              <h3 className="text-2xl font-bold text-gray-800">
                {result.title}
              </h3>
              <div className="text-base text-gray-600 flex items-center flex-row gap-1 py-1">
                <span className="font-medium">Relevance: </span>
                <span className="font-semibold text-blue-800">
                  {result.relevance}%
                </span>
                <HelpOutlineIcon
                  className="cursor-pointer opacity-80 hover:opacity-100 text-gray-600"
                  fontSize="small"
                  data-tooltip-id="relevance-tooltip"
                  data-tooltip-content="The relevance score is calculated by dividing the number of matched skills by the total number of required skills."
                ></HelpOutlineIcon>
              </div>
              <p
                className="mt-2 text-gray-700"
                dangerouslySetInnerHTML={{ __html: result.comment }}
              ></p>
              {result.suggestions && result.suggestions.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-base font-medium text-gray-800 flex flex-row gap-1 items-center">
                    <span>Skill suggestions:</span>
                    <HelpOutlineIcon
                      className="cursor-pointer opacity-80 hover:opacity-100 text-gray-600"
                      fontSize="small"
                      data-tooltip-id="suggestions-tooltip"
                      data-tooltip-content="Consider learning these additional skills to improve your chances of landing this role."
                    ></HelpOutlineIcon>
                  </h4>
                  <ul className="list-none list-inside text-sm text-gray-600 mt-1 uppercase flex flex-row gap-2 py-1 flex-wrap">
                    {result.suggestions.map((suggestion, idx) => (
                      <li
                        className="bg-slate-200 w-fit py-1 px-2 rounded-xl select-none hover:bg-slate-300"
                        key={idx}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Tooltip className="max-w-sm" id="relevance-tooltip" />
      <Tooltip className="max-w-sm" id="suggestions-tooltip" />
    </>
  );
}

export default Results;
