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
        resolve( { requestType: opts.requestType, payload: chunk } );
      } );
    } );
  } );
}

export function fetchContent( url = '' ) {
  let pathSegments = url.split( '/' ).filter( ( segment ) => { return !!segment; } );

  /// TODO[@jrmykolyn] - This is brittle and probably won't scale to accommodate all WP routes. Look into alternative solutions.
  /// FIXME[@jrmykolyn] - This already fails if the project includes the following routes: `/:category/:post`; `/category/:category`.
  if ( !pathSegments || !pathSegments.length ) {
    return fetchHomePage();
  } else if ( pathSegments.length === 1 ) {
    return fetchPageBySlug( pathSegments[ 0 ] );
  } else if ( pathSegments.length === 2 ) {
    return fetchPostBySlug( pathSegments[ 1 ] );
  }
}

export function fetchMenus() {
  return fetch( { requestType: 'menus', endpoint: `x/menus` } )
}

export function fetchHomePage() {
  return fetch( { requestType: 'home', endpoint: `x/frontpage` } );
}

export function fetchPostsByCategory( slug ) {
  return fetch( { requestType: 'archive', endpoint: `x/categories/${slug}/posts` } );
}

export function fetchPageBySlug( slug ) {
  return fetch( { requestType: 'page', endpoint: `x/pages/${slug}` } );
}

export function fetchPostBySlug( slug ) {
  return fetch( { requestType: 'post', endpoint: `x/posts/${slug}` } );
}

export function fetchWpActions() {
  return fetch( { requestType: 'partial', endpoint: 'x/wp-actions' } );
}

export function fetchWpHead() {
  return fetch( { requestType: 'partial', endpoint: 'wp-head' } );
}

export function fetchWpFooter() {
  return fetch( { requestType: 'partial', endpoint: 'x/wp-footer' } );
}

export function fetchPosts() {
  return fetch( { requestType: 'posts', endpoint: 'posts' } );
}

export function fetchPost( id ) {
  if ( !id ) {
    return Promise.reject( new Error( '`fetchPost()` INVOKED WITH A MISSING OR INVALID `id`.' ) );
  }

  return fetch( { requestType: 'post', endpoint: `posts/${id}` } );
}
