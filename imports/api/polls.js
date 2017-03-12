import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { HTTP } from 'meteor/http'

// Collection of all polls
const Polls = new Mongo.Collection('polls');
const Comments = new Mongo.Collection('collections');

const baseURL = "https://api.themoviedb.org/3/search/movie";
const apiKey = "811e991877f0df19ab022a0b81ac7bc5";

// Schema for Comments
const CommentSchema = new SimpleSchema({
  handle: { type: String },
  text: { type: String },
});

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
  comments: { type: [CommentSchema], optional: true},
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
    return obj.handle != handle;
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

  // Add comments to an existing poll in the database
  'polls.comment': 
	function votePoll(pollId, updatedPoll, commentText, chatBotWanted) {
    // Check if the vote object conforms with
    // the VoteSchema
    check(pollId, String );
    check(commentText, String );
    check(updatedPoll, PollSchema);
    check(chatBotWanted, Boolean);

    const { comments } = updatedPoll;
		Polls.update(pollId, {
			$set: {
				comments,
			},
		});
    
		if ( chatBotWanted ) {
      comments.push({ 
        handle: "anon28439", 
        text: "Wait a second, let me think about that...",
      });
      Polls.update(pollId, {
        $set: {
          comments,
        },
      });
			if ( Meteor.isServer ) {
				HTTP.get("http://api.program-o.com/v2/chatbot/",
					{params: {bot_id: 6, say: commentText.substring(0,200), format: 'json'}},
					(err, res) => { 
            if ( err ) {
							comments.push({ 
								handle: "anon28439", 
								text: "Sorry, I can't talk right now, I'm too sleepy.",
							});
              Polls.update(pollId, {
                $set: {
                  comments,
                },
              });
            } else {
              if ( res.statusCode === 200 ) {
                comments.push({ 
                  handle: "anon28439", 
                  text: (JSON.parse(res.content)).botsay,
                });
              } else {
                comments.push({ 
                  handle: "anon28439", 
                  text: "Sorry, I can't talk right now, I'm too sleepy.",
                });
              }
              Polls.update(pollId, {
                $set: {
                  comments,
                },
              });
            }
					}
				);
			}
		}

    // TODODOODODODODOO!!!!!
    /* Database call
    return Polls.update(pollId, {
      $set: {
        comments,
      },
    }); */

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

  'polls.getMovies':
  function getList(search, onSuccess, onError) {
    check(search, String);

    search = search + " ";

    HTTP.call("GET", "https://api.themoviedb.org/3/search/movie?api_key=811e991877f0df19ab022a0b81ac7bc5", {params: {query: search}},
      (error, result) => {
        if (!error) {
          var data = result.data;
          var list = data["results"];
          list = list.slice(0,5);
          console.log(list);
          onSuccess(list);
        }
        else {
          onError("Network Error");
        }
      }
    );
	},
});

export default Polls; // Required by our lint styler
