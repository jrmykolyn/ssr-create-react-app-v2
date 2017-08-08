// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
/**
 * ...
 */
function handleize( str ) {
  if ( !str || typeof str !== 'string' ) {
    return str;
  }

  str = str.replace( / /gmi, '-' );
  str = str.toLowerCase();

  return str;
}

function dehandleize( str ) {
   if ( !str || typeof str !== 'string' ) {
    return str;
  }

  str = str.replace( /-/gmi, ' ' );

  return str;
}

/**
 * ...
 */
function urlize( str ) {
  if ( !str || typeof str !== 'string' ) {
    return str;
  }

  str = str.replace( / /gmi, '+' );
  str = str.toLowerCase();

  return str;
}

/**
 * ...
 */
function titleize( str ) {
  if ( !str || typeof str !== 'string' ) {
    return str;
  }

  return str.split( ' ' )
    .map( ( str ) => {
      return `${str.substring( 0, 1 ).toUpperCase()}${str.substring( 1 ).toLowerCase()}`
    } )
    .join( ' ' );
}

/**
 * ...
 */
function transform( str, callbacks ) {
  if ( !str || typeof str !== 'string' ) {
    return str;
  }

  return callbacks.reduce( ( str, callback ) => {
    return ( callback && typeof callback === 'function' ) ? callback( str ) : str;
  }, str );
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
export const stringUtils = {
  handleize,
  dehandleize,
  urlize,
  titleize,
  transform,
};
