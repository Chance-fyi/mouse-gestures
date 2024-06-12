import React from 'react';

const Tooltip = ({tooltipValue}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[999999]">
      <div
        className="bg-gray-800 bg-opacity-75 text-white rounded-lg p-4 flex flex-col items-center justify-center space-y-4 w-56 h-32">
        <p className="text-4xl font-1000">{tooltipValue.arrow}</p>
        <p className="text-center">{chrome.i18n.getMessage(tooltipValue.operation)}</p>
      </div>
    </div>
  );
};

export default Tooltip;
