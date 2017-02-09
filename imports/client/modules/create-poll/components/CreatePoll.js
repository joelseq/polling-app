import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';

// import Option from './OptionClass.js'
import '../../../main.js';

var Option = React.createClass({
	render() {
		return(
			<div>
        <form className="new-type" id="poll-type">
          <input type="text" ref="optionInput"
          placeholder="Enter Option"></input>
        </form>
			</div>
		)
	}
});


var numChildren = 5;
var options = [];

var Optional = React.createClass({
		render () {
		const children = [];

		for (var i = 0; i < numChildren; i += 1) {
		children.push(<Option number={i} />);
		};

		return (
				<div>
					{children}
				</div>
				);
		},
});

class Poll extends Component {

  // Handle poll submission to MongoDB
  submit( event ) {

    // Prevent page refresh
    event.preventDefault();
 
    // Grab poll question
    const nameVal = ReactDOM.findDOMNode( this.refs.questionInput ).value.trim();

    //Get the element that allows user to select types
    var types = document.getElementById('poll-type');

    //Used to determine which box is checked
    var val = '';
    var resetIndex = 0;
    //Loop through options and grab first one that is selected
    for( var i = 0, length = types.length; i<length; i++ ) {
        if( types[i].checked) {
            val = types[i].value;
            resetIndex = i;
            break;
        }
    }

    //No option selected -- handle it here
    if( val == '' ) {
        //Do something
    }

    //Save selected option
    const pollType = val
    
    // Generate dictionary to send to the backend from form elements
    Meteor.call('polls.insert', { name: nameVal, type: pollType } );

    // Reset form
    types[resetIndex].checked = false;
    ReactDOM.findDOMNode( this.refs.questionInput ).value = "";

  }


  addOption(event) {
	  this.numChildren = this.numChildren + 1;
    options.push(<Option number={numChildren} />);
		ReactDOM.render( <Optional />, document.getElementById('newOption') );
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
        <h1>What type of poll?</h1>
        <form className="new-type" id="poll-type">
            <input type="radio" name="choice" value="Traditional" />Traditional
            <input type="radio" name="choice" value="Weighted" />Weighted
        </form>
				<Option />
        <div id="newOption">{options}</div>
        <button onClick={this.addOption.bind(this)}>Add Option</button>
        <button type="submit" form="poll-creator" value="Submit">Submit</button>
      </div>
    );
  }
}

export default Poll;
