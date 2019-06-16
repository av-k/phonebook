import React from 'react';
import { Helmet } from 'react-helmet';
import { Phonebook } from 'components/Phonebook';
import './index.scss';

/**
 * Common Page
 * @returns {*} - container
 * @constructor
 */
export default function HomePage() {
  return (
    <div className="home-page">
      <Helmet>
        <title>Phonebook: Home Page</title>
        <meta name="description" content="Home Page content" />
      </Helmet>
      <div className="content">
        <section>
          <Phonebook />
        </section>
      </div>
    </div>
  );
}
