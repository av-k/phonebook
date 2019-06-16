import React from 'react';

/**
 * Get svg `close` icon
 * @param {object} props - list of properties (className, size, color)
 * @returns {*} - svg view
 * @constructor
 */
const CloseIcon = (props = {}) => {
  const { color = '#000', size = '20px', ...internalProps } = props;
  const viewBoxSize = typeof size === 'number' ? size : size.replace(/px$/, '');
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...internalProps}
      width={size}
      height={size}
      fill={color}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      enableBackground={`new 0 0 ${viewBoxSize} ${viewBoxSize}`}>
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
};

export { CloseIcon };
