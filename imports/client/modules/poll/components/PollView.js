import { createContainer } from 'meteor/react-meteor-data';
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';

import '../../../main.js';

class PollView extends Component {
  
  render() {
    return (
        <div>
        <h1>{this.props.params.pollId}</h1>
        </div>
    );
  }
}

export default PollView;
