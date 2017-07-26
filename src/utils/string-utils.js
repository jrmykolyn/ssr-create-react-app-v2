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

  console.log( 'INSIDE `handleize` --> LOGGING OUT `str`' ); /// TEMP
  console.log( str ); /// TEMP
  str = str.replace( / /gmi, '-' );
  str = str.toLowerCase();

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

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
export const stringUtils = {
  handleize,
  urlize,
};
