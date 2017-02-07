import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Polls } from '../../../../api/polling.js';

// App component - represents the whole app
class PollPage extends Component {
  constructor(props) {
    super(props);
  }

  renderPolls() {
    let filteredPoll = this.props.polls;
		console.log( this.props.polls );
		console.log( this.props.params.pollId );
  }

  render() {
    return (
      <div className="container">
				<h1>HERE</h1>
        <ul>
          {this.renderPolls()}
        </ul>
      </div>
    );
  }
}

PollPage.propTypes = {
  polls: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    polls: Polls.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, PollPage);
