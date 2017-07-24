const initialState = {};

export default function reducer( state=initialState, action ) {
  switch ( action.type ) {
    case 'APP_UPDATE_MENUS':
      return { ...state, ...{ menus: action.payload } };
    default:
      return state
  }
}
