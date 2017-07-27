// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
/**
 * ...
 */
function queryStringifyParams( params ) {
  let output = [];

  Object.keys( params )
    .forEach( ( key ) => {
      let val = params[ key ];

      switch ( typeof val ) {
        case 'object':
          if ( Array.isArray( val ) ) {
            output.push( queryStringifyArray( key, val ) );
          } else {
            // DO OTHER THING?
          }

          break;
        default:
          output.push( `${key}=${val}` );
      }
    } );

    return output.join( '&' );
}

/**
 * ...
 */
function queryStringifyArray( key, vals ) {
  return vals
    .map( ( val ) => {
      return `${key}[]=${val}`;
    } )
    .join( '&' );
}

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
  queryStringifyParams,
  queryStringifyArray,
}
