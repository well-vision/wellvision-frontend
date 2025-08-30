// src/admin_components/state.js
const initialState = {
  mode: 'light',// or 'dark',
};

export default function globalReducer(state = initialState, action) {
  switch (action.type) {
    case 'TOGGLE_MODE':
      return { ...state, mode: state.mode === 'light' ? 'dark' : 'light' };
    default:
      return state;
  }
}
