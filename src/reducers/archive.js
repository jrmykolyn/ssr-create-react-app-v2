const initialState = {};

export default function reducer( state=initialState, action ) {
  switch ( action.type ) {
    case 'ARCHIVE_UPDATE':
      return { ...state, ...{ [ action.slug ]: action.payload } };
    case 'ARCHIVE_INIT_LOAD_MORE':
      return { ...state, ...{ __loadMore: true } };
    case 'ARCHIVE_RESOLVE_LOAD_MORE':
      // Extract current posts from `state`.
      let currentPosts = state[ action.slug ] || [];

      // Assign new posts from payload.
      let newPosts = action.payload || [];

      // Merge and filter posts.
      let mergedPosts = [ ...currentPosts, ...newPosts ]
        .filter( ( post, i, arr ) => {
          return arr.indexOf( post ) === i;
        } );

      return { ...state, ...{ [ action.slug ]: mergedPosts, __loadMore: false } };
    default:
      return state
  }
}
