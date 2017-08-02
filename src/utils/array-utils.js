// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
/**
 * Function converts a one-dimensional array into a two-dimensional array.
 *
 * The length f the child/sub-arrays will be equal to the `len` value provided.
 *
 * @param {Array} arr
 * @param {number} len
 * @return {Array}
 */
function arrayToMatrix( arr, len ) {
  if ( !Array.isArray( arr ) || !arr.length ) {
    /// TODO - Log msg.
    return [];
  }

  if ( typeof len !== 'number' || parseInt( len ) !== len ) {
    /// TODO - Log msg.
    return [];
  }

  return arr.reduce( ( matrix, elem, i ) => {
    if ( i % len === 0 ) {
      matrix.push( [] );
    }

    matrix[ matrix.length - 1 ].push( elem );

    return matrix;
  }, [] );
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
export const arrayUtils = {
  arrayToMatrix,
};
