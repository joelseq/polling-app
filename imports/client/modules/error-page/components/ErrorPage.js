import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

// Component for 404 page
export default class ErrorPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  // renders error message for the user
  render() {
    return(
      <div>
        <h3 className="margin-left">Error: Poll Not Found</h3>
        <h4 className="margin-left">Poll may have been deleted or not created</h4>
      </div>
    );
  }
}
