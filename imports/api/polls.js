import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Collection of all polls
export const Polls = new Mongo.Collection('polls');

// Database call for getting all the polls in the database
const pollsPublication = function pollsPublication() {
  return Polls.find({});
};

if (Meteor.isServer) {
  // Publish all polls in the database, other files may subscribe to this
  // server call so that they can get the polls
  Meteor.publish('polls', pollsPublication);
}

// Server methods, mainly database calls
Meteor.methods({

  // Insert a new poll in the database
  'polls.insert': function dataInsertion(data) {
    check(data, Object);

    // Database calls
    return Polls.insert({
      data,
      createdAt: new Date(),
    });
  },

});

export default Polls; // Required by out lint styler
