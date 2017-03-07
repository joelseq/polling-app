import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {
  Grid,
  Row,
  Col,
  FormGroup,
  FormControl,
  Checkbox,
  Button,
} from 'react-bootstrap';

// Grabs chart from PollResults
import PollChart from '../../poll-results/components/PollChart.js';

// Grab collection for polls
import Polls, { voteHelper } from '../../../../api/polls.js';

// Prop Types for this Component
const propTypes = {
  // Poll object in DB from createContainer
  poll: PropTypes.shape({
    // Mongo ID for Poll
    _id: PropTypes.string,
    // Whether the poll is weighted
    isWeighted: PropTypes.bool,
    // Name / Question of the poll
    name: PropTypes.string,
    // A hashmap of key = option and
    // value = amount of votes
    options: PropTypes.object,
  }),
};

class PollResults extends Component {
  constructor(props) {
    super(props);

    this.toggleExtraInfo = this.toggleExtraInfo.bind(this);

    this.state = {
      showExtraInfo: false
    };
  }

  // allows the user to display and show extra voting info
  toggleExtraInfo() {
    // if true, switches to false
    if (this.state.showExtraInfo) {
      this.setState({
        showExtraInfo: false,
      });
    }

    // if false, toggles to true
    else {
      this.setState({
        showExtraInfo: true,
      });
    }
  }

  // Layout of the page
  render() {
    // if there is no information to display
    if (!this.props.poll) {
      // TODO: add a nice loading animation here instead of this
      return <h4 className="text-center">Loading...</h4>;
    }

    return (
      <div>
        <div>
          <PollChart options={this.props.poll.options}/>
        </div>
        <Button>
          View More
        </Button>
        { this.state.showExtraInfo
          ?
            <div>
              {/* TODO Organize extra info here */}
            </div>
          : null
        }
      </div>
    );
  }
}

PollResults.propTypes = propTypes;

export default createContainer(({ params }) => {
  Meteor.subscribe('polls'); // get the poll database

  return {
    poll: Polls.findOne(params.pollId),
  };
}, PollResults);
