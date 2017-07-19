// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
// Node
const http = require( 'http' );

// Vendor
const Promise = require( 'bluebird' );

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function fetch( endpoint ) {
  return new Promise( ( resolve, reject ) => {
    let options = {
      hostname: 'localhost',
      path: `/_tests/_wordpress-api/wp-json/wp/v2/${endpoint}`,
    };

    let request = http.get( options, ( response ) => {
      response.setEncoding('utf8');
      response.on( 'data', ( chunk ) => {
        resolve( chunk );
      } );
    } );
  } );
}

function fetchWpActions() {
  return fetch( 'wp-actions' );
}

function fetchWpHead() {
  return fetch( 'wp-head' );
}

function fetchWpFooter() {
  return fetch( 'wp-footer' );
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = {
  fetchWpActions,
   fetchWpHead,
   fetchWpFooter,
};
