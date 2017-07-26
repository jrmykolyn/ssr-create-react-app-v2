// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
/**
 * ...
 */
function parseQueryString( queryString ) {
  queryString = ( queryString && typeof queryString === 'string' ) ? queryString : '';

  if ( !queryString ) {
    return {};
  }

  if ( queryString.substring( 0, 1 ) === '?' ) {
    queryString = queryString.substring( 1 );
  }

  return queryString.split( '&' )
    .map( ( keyValStr ) => {
      return keyValStr.split( '=' );
    } )
    .map( ( keyValArr ) => {
      let [ key, val ] = keyValArr;

      return { [ key ]: val };
    } )
    .reduce( ( a, b ) => {
      return { ...a, ...b };
    }, {} );
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
export const routeUtils = {
  parseQueryString,
}
