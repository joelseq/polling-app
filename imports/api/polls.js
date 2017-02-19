import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection of all polls
const Polls = new Mongo.Collection('polls');

// Schema for Polls
const PollSchema = new SimpleSchema({
  name: { type: String },
  isWeighted: { type: Boolean },
  options: {
    type: Object,
    blackbox: true,
  },
  votes: { type: [Object], optional: true },
  isPrivate: { type: Boolean },
  password: { type: String, optional: true },
  createdAt: { type: Date, defaultValue: new Date() },
});

// Automatically validate the schema for us
Polls.attachSchema(PollSchema);

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

});

export default Polls; // Required by our lint styler
