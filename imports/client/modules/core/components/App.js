import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

export default function App({ children }) {
  return (
    <div>
      <Helmet
        title="People Order Our Products"
        titleTemplate="%s"
        meta={[
          { charset: 'utf-8' },
          {
            'http-equiv': 'X-UA-Compatible',
            content: 'IE=edge',
          },
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1',
          },
        ]}
      />
      {children}
    </div>
  );
}

App.propTypes = {
  children: PropTypes.object.isRequired, // eslint-disable-line
};
