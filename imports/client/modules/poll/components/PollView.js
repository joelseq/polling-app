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
		console.log( this.props.polls[0] );
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

export default createContainer(({ params }) => {
  console.log( params.pollId );
  return {
    polls: Polls.find({ "_id" : new Mongo.ObjectID(params.pollId) }).fetch(),
  };
}, PollPage);
