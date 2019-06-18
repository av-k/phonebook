import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import mobileDevice from 'ismobilejs';
import Router from 'routes';
import classnames from 'classnames';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { StyledWrapper } from 'components/CommonStyledWrapper';
import 'styles/index.scss';

export function Root() {
  const isMobile = mobileDevice.any;

  return (
    <BrowserRouter>
      <Helmet>
        <title>Phonebook</title>
        <meta name="description" content="Application content" />
      </Helmet>
      <StyledWrapper className={classnames({ismobile: isMobile})}>
        <ErrorBoundary>
          <Router />
        </ErrorBoundary>
      </StyledWrapper>
    </BrowserRouter>
  );
}
