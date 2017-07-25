const initialState = {};

export default function reducer( state=initialState, action ) {
  switch ( action.type ) {
    case 'PAGE_UPDATE':
      return { ...state, ...{ [ action.slug ]: action.payload } };
    default:
      return state
  }
}
