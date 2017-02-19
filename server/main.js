import { Meteor } from 'meteor/meteor';
import Polls from '../imports/api/polls';

// Publications need to be done server-side so it makes more sense to do it in server/main.js
// rather than imports/api/polls.js
Meteor.startup(() => {
  Meteor.publish('polls', function callback() { // eslint-disable-line prefer-arrow-callback
    return Polls.find({});
  });
});
