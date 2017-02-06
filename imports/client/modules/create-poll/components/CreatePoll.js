import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';

import '../../../main.js'

class Poll extends Component {

  // Handle poll submission to MongoDB
  submit( event ) {

    // Prevent page refresh
    event.preventDefault();
 
    const nameVal = ReactDOM.findDOMNode( this.refs.questionInput ).value.trim();
    // Generate dictionary to send to the backend from form elements

    console.log( nameVal ); // for debugging 

    //Polls.insert( nameVal ); // make database call

    Meteor.call('polls.insert', nameVal);

    // Reset form
    ReactDOM.findDOMNode( this.refs.questionInput ).value = "";

  }

  render() {
    return (
      <div>
        <h1>Here is a poll</h1>
        <form className="new-poll" id="poll-creator" 
              onSubmit={this.submit.bind(this)}>
          <input type="text" ref="questionInput"
          placeholder="Enter Poll Name?"></input>
        </form>
        <button type="submit" form="poll-creator" value="Submit">Submit</button>
      </div>
    );
  }
}

export default Poll;
