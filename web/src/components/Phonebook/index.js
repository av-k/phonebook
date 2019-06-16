import React, { useState, useEffect } from 'react';
import mobileDevice from 'ismobilejs';
import { StyledWrapper } from 'components/CommonStyledWrapper';

/**
 * Phonebook view
 * @param {object} props - list of properties
 * @returns {*} - Phonebook view
 * @constructor
 */
export function Phonebook(props = {}) {
  const isMobile = mobileDevice.any;
  const style = {
    position: 'relative',
    width: isMobile ? 'calc(100% - 40px)' : '460px'
  };

  return (
    <StyledWrapper style={style}>
      <div>Phonebook</div>
    </StyledWrapper>
  );
}
