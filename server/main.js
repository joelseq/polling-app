import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('polls', function pollsPublication() {
    return Polls.find({});
  });
}

Meteor.methods({
  'polls.return'(key) {
    check(key, String);

    console.log( "Here" );
    console.log( key );

    return Polls.find({"_id" : ObjectId(key)});
  },

  'polls.insert'(data) {
    check(data, Object);

    Polls.insert({
      data,
      createdAt: new Date(),
    });
  },
});

