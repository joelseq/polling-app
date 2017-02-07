import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

// Poll component - represents a single todo item
export default class PollView extends Component {
  render() {
    return (
        <h1>
          <strong>{this.props.poll}</strong>
        </h1>
    );
  }
}

