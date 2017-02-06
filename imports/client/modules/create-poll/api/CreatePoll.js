import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Polls = new Mongo.Collection('polls');

Meteor.methods({

  'polls.insert' ( data ) {
    check( data, Object );

    console.log( data );

    Polls.insert( data );

  },

});
