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
				<img src={'http://i.imgur.com/gbDypc4.png'} />
        <h4 className="center">Sorry! Looks like you've found a page that doesn't exist</h4>
      </div>
    );
  }
}
