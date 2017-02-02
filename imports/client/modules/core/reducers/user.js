const uninitializedUser = {
  id: null,
  name: undefined,
  email: undefined,
};

// Action names
export const USER_CREATE_TEST = 'USER_CREATE_TEST';

// Reducer
export default function userReducer(state = uninitializedUser, action) {
  switch (action.type) {
    case USER_CREATE_TEST:
      return {
        id: '123abc',
        name: 'Example Sample',
        email: 'example@example.com',
      };

    default:
      return state;
  }
}
