const initialState = {};

export default function reducer( state=initialState, action ) {
  // console.log( 'LOGGING OUT `action.type`' ); /// TEMP
  // console.log( action.type ); /// TEMP

  switch ( action.type ) {
    case 'SEARCH_UPDATE':
      console.log( 'MATCHED CASE `SEARCH_UPDATE` FOR `action.type`:', action.type ); /// TEMP
      return { ...state, ...{ [ action.query ]: action.payload } };
    default:
      // console.log( 'MATCHED CASE `default` FOR `action.type`:', action.type ); /// TEMP
      return state
  }
}
