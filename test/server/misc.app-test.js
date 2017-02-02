import { Meteor } from 'meteor/meteor';

/**
 * Basic test to ensure that the test system is working
 */
describe('basic true test server', () => {
  /**
   * Basic test that doesn't really test anything.
   */
  it('true', () => {
    chai.assert.equal(true, true);
  });

  /**
   * Sanity check to make sure isServer method is correct.
   */
  it('isServer should be true', () => {
    chai.assert.equal(Meteor.isServer, true);
  });
});
