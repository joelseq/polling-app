import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Polls = new Mongo.Collection('polls');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('polls', function pollsPublication() {
    return Polls.find();
  });
}

Meteor.methods({
  'polls.insert'(data) {
    check(data, Object);

    Polls.insert({
      data,
      createdAt: new Date(),
    });
  },
});
