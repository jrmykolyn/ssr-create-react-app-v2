// --------------------------------------------------
// ...
// --------------------------------------------------
function getIds( posts ) {
  if ( !posts || !Array.isArray( posts ) || !posts.length ) {
    return [];
  }

  return posts.map( ( post ) => {
    return post.ID || post.id;
  } );
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
export const postUtils = {
  getIds,
};
