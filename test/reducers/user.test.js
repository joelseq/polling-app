import userReducer, { USER_CREATE_TEST } from '../../imports/client/modules/core/reducers/user.js';

describe('user reducer', () => {
  it('should return the initial state', () => {
    const user = {
      id: null,
      name: undefined,
      email: undefined,
    };

    chai.expect(
      userReducer(undefined, {})
    ).to.deep.equal(user);
  });

  it('should handle USER_CREATE_TEST', () => {
    const user = {
      id: '123abc',
      name: 'Example Sample',
      email: 'example@example.com',
    };

    chai.expect(
      userReducer({}, {
        type: USER_CREATE_TEST,
      })
    ).to.deep.equal(user);
  });
});
