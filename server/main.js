import { Meteor } from 'meteor/meteor';
import Polls from '../imports/api/polls';

// Publications need to be done server-side so it makes more sense to do it in server/main.js
// rather than imports/api/polls.js
Meteor.startup(() => {
  Meteor.publish('polls', function callback() { // eslint-disable-line prefer-arrow-callback
    return Polls.find({}, {
      fields: {
        name: 1,
        isWeighted: 1,
        isVoterEditable: 1,
        options: 1,
        comments: 1,
        'votes.handle': 1,
        'votes.selectedOptions': 1,
        isPrivate: 1,
        createdAt: 1,
        isClosed: 1,
        isTimed: 1,
        expiresAt: 1,
      },
    });
  });
});
