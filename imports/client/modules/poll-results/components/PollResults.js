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
import { withRouter, routerShape } from 'react-router';


// Grabs chart from PollResults
import PollChart from './PollChart';

// Grabs table from PollTable
import PollTable from './PollTable';

// Grab collection for polls
import Polls, { voteHelper } from '../../../../api/polls.js';

// Grabs ErrorPage component
import ErrorPage from '../../error-page/components/ErrorPage';


// Prop Types for this Component
const propTypes = {
  router: PropTypes.object,
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
    // Vote object for poll
    votes: PropTypes.array,
  }),
};

// Default Props if none are provided
const defaultProps = {
  poll: {
    _id: '12345',
    isWeighted: false,
    name: 'Default Poll',
    options: {
      'Option 1': 0,
      'Option 2': 0,
    },
  },
};

class PollResults extends Component {
  constructor(props) {
    super(props);

    this.toggleExtraInfo = this.toggleExtraInfo.bind(this);

    this.state = {
      showExtraInfo: false,
      isLoading: true
    };

    setTimeout(() => {
      if(this.props.poll._id == defaultProps.poll._id) {
        this.props.router.push(`/404Error`);
      }
    }, 5000);


    if(this.props.poll._id != defaultProps.poll._id) {
        this.state = {
          isLoading: false,
        };
    }

  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.poll._id != defaultProps.poll._id) {
        this.setState({
          isLoading: false,
        });
    } else {
      nextProps.router.push(`/404Error`);
    }
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
    if (this.state.isLoading) {
      // TODO: add a nice loading animation here instead of
      return <h4 className="text-center">Loading...</h4>;
    }

    return (
      <div>
        <div>
          <PollChart options={this.props.poll.options} />
        </div>
        {/* Only shown if button has been pressed */}
        { this.state.showExtraInfo
          ?
            <div>
              <PollTable
                votes={this.props.poll.votes}
                isWeighted={this.props.poll.isWeighted}
                options={this.props.poll.options}
              />
            </div>
          : null
        }
        <Button
          bsStyle="success"
          disabled={this.state.showExtraInfo}
          onClick={this.toggleExtraInfo}

        >
          View More
        </Button>
      </div>
    );
  }
}

PollResults.propTypes = propTypes;
PollResults.defaultProps = defaultProps;

export default createContainer(({ params }) => {
  Meteor.subscribe('polls'); // get the poll database

  return {
    poll: Polls.findOne(params.pollId)
  };

}, withRouter(PollResults));
