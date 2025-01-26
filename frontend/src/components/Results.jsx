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
      <div className="w-full max-w-2xl mt-6">
        <h2 className="text-xl font-semibold text-blue-800">Matched Roles</h2>
        <ul className="mt-4 space-y-4">
          {results.map((result, index) => (
            <li
              key={index}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <h3 className="text-lg font-bold text-gray-800">
                {result.title}
              </h3>
              <div className="text-sm text-gray-600 flex items-center flex-row gap-1 py-1">
                <span>Relevance: </span>
                <span className="font-semibold text-blue-700">
                  {result.relevance}%
                </span>
                <HelpOutlineIcon
                  className="cursor-pointer opacity-80 hover:opacity-100"
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
                  <h4 className="text-sm font-semibold text-gray-800">
                    Skill suggestions:
                  </h4>
                  <ul className="px-2 list-disc list-inside text-sm text-gray-700 mt-1">
                    {result.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Tooltip className="max-w-sm" id="relevance-tooltip" />
    </>
  );
}

export default Results;
