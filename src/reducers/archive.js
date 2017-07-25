const initialState = {};

export default function reducer( state=initialState, action ) {
  switch ( action.type ) {
    case 'ARCHIVE_UPDATE':
      return { ...state, ...{ [ action.slug ]: action.payload } };
    default:
      return state
  }
}
