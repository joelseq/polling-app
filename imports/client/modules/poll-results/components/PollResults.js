import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {
  Grid,
  Row,
	Form,
	Well,
  ControlLabel,
  HelpBlock,
  Col,
  Modal,
	Panel,
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

import Loading from '../../core/components/Loading';

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
    comments: PropTypes.array,
    isClosed: PropTypes.bool,
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
    this.toggleCheck = this.toggleCheck.bind(this);
    this.postComment = this.postComment.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleCommentNameChange = this.handleCommentNameChange.bind(this);

    this.state = {
      showExtraInfo: false,
      isLoading: true,
      handleText: '',
      commentText: '',
      commentTextError: '',
      handleTextError: '',
      chatBotWanted: false,
      amountToLoad: 5
    };
	}

  postComment(e) {
    e.preventDefault();
    const { handleText, commentText, chatBotWanted } = this.state;

    if ( commentText === '' ) {
      this.setState({
        commentTextError: "Please enter a comment",
      });

    }
    if ( handleText === '' ) {
      this.setState({
        handleTextError: "Please enter a handle",
      });
    }
    if ( commentText !== '' && handleText !== '' ) {
      // Create a new Poll object to be saved
      const updatedPoll = { ...this.props.poll };

      if ( !updatedPoll.comments ) {
        updatedPoll.comments = [];
      }

      updatedPoll.comments.push({ handle: handleText, text: commentText });

      // Remove the _id key to pass validation
      delete updatedPoll._id;

      Meteor.call('polls.comment',
        this.props.poll._id,
        updatedPoll,
        commentText,
        chatBotWanted,
      );

      this.setState({
        commentText: '',
        handleText: '',
      });
    }
  }

  loadMore(e) {
    this.setState({
      amountToLoad: this.state.amountToLoad + 5,
    });
  }

  handleCommentChange(e) {
    e.preventDefault();
    this.setState({
      commentText: e.target.value,
      commentTextError: '',
    });
  }

  handleCommentNameChange(e) {
    e.preventDefault();
    this.setState({
      handleText: e.target.value,
      handleTextError: '',
    });
  }

  toggleCheck() {
    // if true, switches to false
    this.setState({
      chatBotWanted: !this.state.chatBotWanted,
    });
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


  renderComments() {
    const { comments } = this.props.poll;

    if ( comments ) {
      return Object.keys(comments).reverse().map((comment, index) => {
        if ( index < this.state.amountToLoad ) {
          return (
            <Panel
              key={index}
              header={comments[comment].handle + ':'}
              bsStyle="primary"
            >
              {comments[comment].text}
            </Panel>
          );
        }
      });
    }
  }

  // Layout of the page
  render() {
    console.warn = function () {}
    // if there is no information to display
		
		if (this.props.loading) {
      return <Loading />;
    }

    if (this.props.poll._id === defaultProps.poll._id) {
      this.props.router.push('/404Error');
    }

    return (
      <div>
				<Grid>
          <Row>
            <Col md={12} xs={12} sm={12}>
              <Well>
                <PollChart options={this.props.poll.options} poll={this.props.poll} />
              </Well>
            </Col>
          </Row>
          <Well>
            <Row>
              <Col md={10} mdOffset={1}>
                {/* Only shown if button has been pressed */}
                <Modal
                  show={this.state.showExtraInfo}
                >
                  <Modal.Header>
                    <Modal.Title>Poll Results!</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <PollTable
                      votes={this.props.poll.votes}
                      isWeighted={this.props.poll.isWeighted}
                      options={this.props.poll.options}
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      onClick={this.toggleExtraInfo}
                    >
                      Close
                    </Button>
                  </Modal.Footer>

                </Modal>
                <Button
                  bsStyle="success"
                  onClick={this.toggleExtraInfo}
                  block
                >
                  View More
                </Button>
                <h2>Comments</h2>
                <Col md={10} mdOffset={1}>
                <Form horizontal onSubmit={this.postComment}>
                  <FormGroup
                  >
                    <ControlLabel>Name: </ControlLabel>
                    <FormControl
                      onChange={this.handleCommentNameChange}
                      type="text"
                      value={this.state.handleText}
                      placeholder="Enter Name"
                    />
                    <HelpBlock>{this.state.handleTextError}</HelpBlock>
                    <ControlLabel>Comment:</ControlLabel>
                    <FormControl
                      onChange={this.handleCommentChange}
                      type="text"
                      value={this.state.commentText}
                      placeholder="Enter Comment"
                    />
                    <FormControl.Feedback />
                    <HelpBlock>{this.state.commentTextError}</HelpBlock>
                    <Col md={6}>
                      <Checkbox
                        onChange={this.toggleCheck}
                        checked={this.state.chatBotWanted}
                      >
                        Get ChatBot Response
                      </Checkbox>
                    </Col>
                    <Col md={6}>
                      <Button
                        onClick={this.postComment}
                        bsStyle="success"
                        type="submit"
                        block
                      >Post!</Button>
                    </Col>
                  </FormGroup>
                </Form>
                </Col>
              </Col>
            </Row>
            <h3></h3>
            <Row>
              <Col md={10} mdOffset={1}>
                {this.renderComments()}
                {this.props.poll.comments ? ( 
                this.props.poll.comments.length > 5 ? (
                <Button
                  bsStyle="success"
                  onClick={this.loadMore}
                  block
                >
                  Load More Comments
                </Button> ) : '' ) : '' }
              </Col>
            </Row>
            <h3></h3>
         </Well>
				</Grid>
      </div>
    );
  }
}

PollResults.propTypes = propTypes;
PollResults.defaultProps = defaultProps;

export default createContainer(({ params }) => {
  const poll = Meteor.subscribe('polls'); // get the poll database
  const loading = !poll.ready();

  return {
    poll: Polls.findOne(params.pollId),
		loading,
  };

}, withRouter(PollResults));
