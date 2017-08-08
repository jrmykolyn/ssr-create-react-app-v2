// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
// Node
const http = require( 'http' );

// Vendor
const Promise = require( 'bluebird' );

// Config.
const API_CONFIG = require( './config/api' ); /// TEMP
const { GOOGLE_CUSTOM_SEARCH_API_CONFIG } = API_CONFIG; /// TEMP

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
export function search( query ) {
  return new Promise( ( resolve, reject ) => {
    let { hostname, path, cx } = GOOGLE_CUSTOM_SEARCH_API_CONFIG;

    http.get( `https://${hostname}/${path}?cx=${cx}&q=${query}`, ( response ) => {
      response.setEncoding('utf8');

      let payload = '';

      // Update `payload` when new data is received.
      response.on( 'data', ( chunk ) => {
        payload += chunk;
      } );

      // Resolve Promise when *all* data received.
      response.on( 'end', () => {
        resolve( {
          payload: payload,
        } );
      } );
    } );
  } );
}
