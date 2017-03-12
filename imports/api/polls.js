import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection of all polls
const Polls = new Mongo.Collection('polls');

// Schema for Votes
const VoteSchema = new SimpleSchema({
  handle: { type: String },
  password: { type: String, optional: true },
  selectedOptions: { type: Object, blackbox: true },
});

// Schema for Polls
const PollSchema = new SimpleSchema({
  name: { type: String },
  isWeighted: { type: Boolean },
  options: {
    type: Object,
    blackbox: true,
  },
  votes: { type: [VoteSchema], optional: true },
  isPrivate: { type: Boolean },
  isVoterEditable: { type: Boolean, optional: true },
  password: { type: String, optional: true },
  editPassword: { type: String, optional: true },
  createdAt: { type: Date, defaultValue: new Date() },
  isClosed: { type: Boolean, defaultValue: false },
  isTimed: {type: Boolean, defaultValue: false },
  expiresAt: { type: Date, defaultValue: new Date()},
});

// Automatically validate the schema for us
Polls.attachSchema(PollSchema);

/**
 * Helper function to make sure that there is only
 * 1 vote by a particular handle in the Poll object.
 * This is for the sake of updating votes and ensuring
 * that there is no duplication or malicious insertion * happening.
 *
 * @param {Poll} pollObject
 * @returns {Boolean} True if no duplicates, False if
 * there are duplicates.
 */
export function dupVoteHelper(pollObject, handle) {
  let votes = pollObject.votes;
  votes = votes.filter( (obj) => {
    return obj.handle !== handle;
  });

  return votes;
}

// Meteor methods are the secure way of making database calls
// on the client, therefore we define an object of all the
// possible calls we want to make on the client.
Meteor.methods({

  // Insert a new poll in the database
  'polls.insert': function dataInsertion(poll) {
    // Trivial check to suppress linter warning.
    // We are already validating schema from the
    // schema.
    check(poll, Object);

    // Database call
    return Polls.insert(poll);
  },

  'polls.changePollStatus': function closePoll(pollId, pollStatus) {
    // Check if the vote object conforms with
    // the VoteSchema
    check(pollId, String);
    check(pollStatus, Boolean);

    // Database call
    return Polls.update(pollId, {
      $set: {
        isClosed: pollStatus,
      },
    });
  },    

  // Suggest new options & change options for poll
  'polls.suggestOptions': function changeName(pollId, updatedPoll) {
    // Check if the vote object conforms with
    // the VoteSchema
    check(updatedPoll, PollSchema);
    check(pollId, String);

    const { options } = updatedPoll;

    // check to make sure that we are not updating the poll without proper
    // credentials
    if (Meteor.isServer) {
      const poll = Polls.findOne(pollId);
      // check if poll's edit password exists
      if (!poll.isVoterEditable) {
          throw new Meteor.Error(501,
            'This poll is not voter editable!');
      }
    }

      // Database call
    return Polls.update(pollId, {
      $set: {
        options,
      },
    });
  },

  // Update an existing poll in the database
  'polls.editPoll': function changeName(pollId, updatedPoll, inputPass) {
    // Check if the vote object conforms with
    // the VoteSchema
    check(updatedPoll, PollSchema);
    check(pollId, String);
    check(inputPass, String);

    const { name, options, isTimed, expiresAt } = updatedPoll;

    // check to make sure that we are not updating the poll without proper
    // credentials
    if (Meteor.isServer) {
      const poll = Polls.findOne(pollId);
      // check if poll's edit password exists
      if (poll.editPassword) {
        if (poll.editPassword !== inputPass) {
          throw new Meteor.Error(501,
            'An error occured, the password given is invalid, please reload the page!');
        }
      }
    }

      // Database call
    return Polls.update(pollId, {
      $set: {
        name,
        options,
        isTimed,
        expiresAt,
      },
    });
  },

  // Update an existing poll in the database
  'polls.vote': function votePoll(pollId, updatedPoll, vote) {
    // Check if the vote object conforms with
    // the VoteSchema
    check(updatedPoll, PollSchema);
    check(pollId, String);
    check(vote, VoteSchema);
    let options = updatedPoll.options;

    let votes = dupVoteHelper( updatedPoll, vote.handle );
    votes.push( vote );

    // Reset each of the options back to zero
    Object.keys(options).forEach((option) => {
      options[option] = 0;
    });

    // iterate through each of the votes and count them for the current options
    for( let vote of votes ) {
      Object.keys(options).forEach((option) => {
        if ( vote.selectedOptions[option] ) {
          options[option] += vote.selectedOptions[option];
        }
      });
    }

    // Database call
    return Polls.update(pollId, {
      $set: {
        options,
        votes,
      },
    });
  },

  'polls.checkEditPass':
  function checkEditPass(pollId, inputPass) {
    // Check if the vote object conforms with
    // the VoteSchema
    check(pollId, String);
    check(inputPass, String);

    // Database call
    if (Meteor.isServer) {
      const poll = Polls.findOne(pollId);

      if (poll.editPassword) {
        if (poll.editPassword !== inputPass) {
          throw new Meteor.Error(501, 'Password is invalid!');
        }
      }
    }

    return true;
  },

  'polls.checkPassAndHandle':
  function checkPassAndHandle(data) {
    // Check if the vote object conforms with
    // the VoteSchema
    check(data, Object);
    const { pollId, pass } = data;

    // Database call
    if (Meteor.isServer) {
      const poll = Polls.findOne(pollId);
      if (poll.isPrivate) {
        if (poll.password !== pass) {
          throw new Meteor.Error(501, 'Password is invalid!');
        }
      }
    }
  },

});

export default Polls; // Required by our lint styler
