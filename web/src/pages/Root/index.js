import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ToastContainer } from 'react-toastify';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { StyledWrapper } from 'components/CommonStyledWrapper';
import Router from 'routes';
import 'styles/index.scss';
import 'react-toastify/dist/ReactToastify.css';

export function Root() {
  return (
    <BrowserRouter>
      <Helmet>
        <title>Phonebook</title>
        <meta name="description" content="Application content" />
      </Helmet>
      <StyledWrapper>
        <ToastContainer />
        <ErrorBoundary>
          <Router />
        </ErrorBoundary>
      </StyledWrapper>
    </BrowserRouter>
  );
}
