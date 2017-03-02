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
  password: { type: String, optional: true },
  createdAt: { type: Date, defaultValue: new Date() },
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
export function voteHelper(pollObject) {
  const handles = {};
  let ret = true;

  pollObject.votes.forEach((vote) => {
    const { handle } = vote;

    if (handles[handle] === true) {
      ret = false;
    }
    handles[handle] = true;
  });

  return ret;
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

  // Update an existing poll in the database
  'polls.editPoll': function changeName(pollId, updatedPoll) {
    // Check if the vote object conforms with
    // the VoteSchema
    check(updatedPoll, PollSchema);
    check(pollId, String);

    const { name, options } = updatedPoll;

      // Database call
    return Polls.update(pollId, {
      $set: {
        name,
        options,
      },
    });
  },

  // Update an existing poll in the database
  'polls.vote': function votePoll(pollId, updatedPoll) {
    // Check if the vote object conforms with
    // the VoteSchema
    check(updatedPoll, PollSchema);
    check(pollId, String);

    const { options, votes } = updatedPoll;

    if (voteHelper(updatedPoll)) {
      // Database call
      return Polls.update(pollId, {
        $set: {
          options,
          votes,
        },
      });
    }
    throw new Meteor.Error('This handle already voted.');
  },

  'polls.checkPassAndHandle':
  function checkPassAndHandle(data) {
    // Check if the vote object conforms with
    // the VoteSchema
    check(data, Object);
    const { pollId, otherHandle, pass } = data;
    check(pollId, String);
    check(otherHandle, String);
    check(pass, String);

    // Database call
    if (Meteor.isServer) {
      const poll = Polls.findOne(pollId);
      let ret = true;

      if (poll.votes) {
        poll.votes.forEach((vote) => {
          const { handle } = vote;
          if (handle === otherHandle) {
            ret = false;
          }
        });
      }

      if (!ret) {
        throw new Meteor.Error(500, 'This handle already voted.');
      }

      if (poll.isPrivate) {
        if (poll.password !== pass) {
          throw new Meteor.Error(501, 'Password is invalid!');
        }
      }
    }
  },

});

export default Polls; // Required by our lint styler
