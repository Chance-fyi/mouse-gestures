import React from 'react';
import {getConfig} from "~config";
import {Direction, Operations} from "~enum";

const Tooltip = ({gesture}) => {
  const config = getConfig();
  let arrow: string = "";
  let operation: string = Operations.Invalid;
  const _ = require('lodash');
  if (_.has(config.gestures, gesture)) {
    operation = config.gestures[gesture];
    arrow = config.arrows[gesture];
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[999999]">
      <div
        className="bg-gray-800 bg-opacity-75 text-white rounded-lg p-4 flex flex-col items-center justify-center space-y-4 w-56 h-32">
        <p className="text-4xl font-1000">{arrow}</p>
        <p className="text-center">{chrome.i18n.getMessage(operation)}</p>
      </div>
    </div>
  );
};

export default Tooltip;
