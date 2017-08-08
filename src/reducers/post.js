const initialState = {
  __loadMore: null,
  __activePost: null,
  __recent: null,
  __popular: null,
};

export default function reducer( state=initialState, action ) {
  switch ( action.type ) {
    case 'POST_UPDATE':
      return { ...state, ...{ [ action.slug ]: [ action.payload ] } };
    case 'POST_INIT_LOAD_MORE':
      return { ...state, ...{ __loadMore: 'init' } };
    case 'POST_RESOLVE_LOAD_MORE':
      // Extract current posts from `state`.
      let currentPosts = state[ action.slug ] || [];

      // Assign new posts from payload.
      let newPosts = action.payload || [];

      // Merge and filter posts.
      let mergedPosts = [ ...currentPosts, ...newPosts ]
        .filter( ( post, i, arr ) => {
          return arr.indexOf( post ) === i;
        } );

      return { ...state, ...{ [ action.slug ]: mergedPosts, __loadMore: 'after' } };
    case 'POST_COMPLETE_LOAD_MORE':
      return { ...state, ...{ __loadMore: null } };
    case 'POST_SET_ACTIVE':
      return { ...state, ...{ __activePost: action.payload } };
    case 'POST_REMOVE_ACTIVE':
      return { ...state, ...{ __activePost: null } };
    case 'POST_SET_RECENT':
      return { ...state, ...{ __recent: action.payload } };
    case 'POST_SET_POPULAR':
      return { ...state, ...{ __popular: action.payload } };
    default:
      return state
  }
}
