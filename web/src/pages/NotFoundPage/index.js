import React from 'react';
import { Helmet } from 'react-helmet';

export default function NotFoundPage() {
  return (
    <article className="not_found-page">
      <Helmet>
        <title>Phonebook: Page Not Found</title>
        <meta name="description" content="Not Found Page content" />
      </Helmet>
      <div className="content">
        <h1>Page Not Found</h1>
      </div>
    </article>
  );
}
