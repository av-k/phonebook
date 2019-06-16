import React from 'react';
import PT from 'prop-types';
import { Wrapper } from './index.styled';

/**
 * Get styled wrapper
 * @param {object} props - properties (style, className, children)
 * @returns {*} - wrapper view
 * @constructor
 */
export const StyledWrapper = (props = {}) => {
  const { style, children, ...aProps } = props;
  return (
    <Wrapper style={style} {...aProps}>
      {children}
    </Wrapper>
  );
};

StyledWrapper.propTypes = {
  children: PT.oneOfType([PT.element, PT.array]),
  style: PT.object
};
