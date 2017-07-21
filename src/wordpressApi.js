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
function fetch( opts={}  ) {
  return new Promise( ( resolve, reject ) => {
    let options = {
      hostname: 'localhost',
      path: `/_tests/_wordpress-api/wp-json/wp/v2/${opts.endpoint}`,
    };

    let request = http.get( options, ( response ) => {
      response.setEncoding('utf8');

      response.on( 'data', ( chunk ) => {
        console.log( 'RCVD. `chunk`' ); /// TEMP
        resolve( { requestType: opts.requestType, payload: chunk } );
      } );
    } );
  } );
}

function fetchContent( url = '' ) {
  let pathSegments = url.split( '/' ).filter( ( segment ) => { return !!segment; } );

  /// TODO[@jrmykolyn] - This is brittle and probably won't scale to accommodate all WP routes. Look into alternative solutions.
  if ( !pathSegments || !pathSegments.length ) {
    return Promise.reject( new Error( '`fetchContent()` INVOKED WITH A MISSING OR INVALID URL.' ) );
  } else if ( pathSegments.length === 1 ) {
    return fetchPageBySlug( pathSegments[ 0 ] );
  } else if ( pathSegments.length === 2 ) {
    return fetchPostBySlug( pathSegments[ 1 ] );
  }
}

function fetchPageBySlug( slug ) {
  return fetch( { requestType: 'page', endpoint: `pages-x/${slug}` } );
}

function fetchPostBySlug( slug ) {
  return fetch( { requestType: 'post', endpoint: `posts-x/${slug}` } );
}

function fetchWpActions() {
  return fetch( { requestType: 'partial', endpoint: 'wp-actions' } );
}

function fetchWpHead() {
  return fetch( { requestType: 'partial', endpoint: 'wp-head' } );
}

function fetchWpFooter() {
  return fetch( { requestType: 'partial', endpoint: 'wp-footer' } );
}

function fetchPosts() {
  return fetch( { requestType: 'posts', endpoint: 'wp-footer' } );
}

function fetchPost( id ) {
  if ( !id ) {
    return Promise.reject( new Error( '`fetchPost()` INVOKED WITH A MISSING OR INVALID `id`.' ) );
  }

  return fetch( { requestType: 'post', endpoint: `posts/${id}` } );
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = {
  fetchContent,
  fetchWpActions,
  fetchWpHead,
  fetchWpFooter,
  fetchPosts,
  fetchPost,
  fetchPageBySlug,
  fetchPostBySlug,
};
