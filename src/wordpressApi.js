// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
// Node
const http = require( 'http' );

// Vendor
const Promise = require( 'bluebird' );

// Utils
const { routeUtils } = require( './utils' );

// Config.
const API_CONFIG = require( './config/api' ); /// TEMP
const { WORDPRESS_API_CONFIG } = API_CONFIG; /// TEMP

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
/// TODO[@jrmykolyn] - Rename function to prevent conflicts with Browser API `fetch()`.
function fetch( opts={}  ) {
  return new Promise( ( resolve, reject ) => {
    let { params={} } = opts;
    let paramsString = routeUtils.queryStringifyParams( params );

    let options = {
      hostname: `${WORDPRESS_API_CONFIG.hostname}`,
      path: `/${WORDPRESS_API_CONFIG.path}/${WORDPRESS_API_CONFIG.api}/${opts.endpoint}?${paramsString}`,
    };

    http.get( options, ( response ) => {
      response.setEncoding('utf8');

      let payload = '';

      // Update `payload` when new data is received.
      response.on( 'data', ( chunk ) => {
        payload += chunk;
      } );

      // Resolve Promise when *all* data received.
      response.on( 'end', () => {
        resolve( {
          requestType: opts.requestType,
          payload: payload,
          slug: ( opts.slug || '' ),
        } );
      } );
    } );
  } );
}

export function fetchContent( url = '' ) {
  let pathSegments = url.split( '/' ).filter( ( segment ) => { return !!segment; } );

  /// TODO[@jrmykolyn] - This is brittle and probably won't scale to accommodate all WP routes. Look into alternative solutions.
  if ( !pathSegments || !pathSegments.length ) {

    return fetchHomePage();

  } else if ( pathSegments.length === 1 ) {

    return fetchPageBySlug( pathSegments[ 0 ] );

  } else if ( pathSegments.length === 2 ) {

    // FIXME[@jmykolyn] - This is gross... Consider creating/reading in a permalinks schema file; responding to requests based on matches.
    if ( pathSegments[ 0 ] === 'category' ) {
      return fetchPostsByCategory( pathSegments[ 1 ] );
    } else {
      return fetchPostBySlug( pathSegments[ 1 ] );
    }

  }
}

export function fetchMenus() {
  return fetch( { requestType: 'menus', endpoint: `x/menus` } )
}

export function fetchHomePage() {
  return fetch( { requestType: 'home', endpoint: `x/frontpage` } );
}

export function fetchPostsByCategory( slug, params ) {
  return fetch( { requestType: 'archive', endpoint: `x/categories/${slug}/posts`, slug: slug, params: params } );
}

export function fetchPageBySlug( slug ) {
  return fetch( { requestType: 'page', endpoint: `x/pages/${slug}`, slug: slug } );
}

export function fetchPostBySlug( slug ) {
  return fetch( { requestType: 'post', endpoint: `x/posts/${slug}`, slug: slug } );
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

export function fetchRecentPosts( params ) {
  return fetch( { requestType: 'posts', endpoint: 'x/posts', params: params } );
}

export function fetchPost( id ) {
  if ( !id ) {
    return Promise.reject( new Error( '`fetchPost()` INVOKED WITH A MISSING OR INVALID `id`.' ) );
  }

  return fetch( { requestType: 'post', endpoint: `posts/${id}` } );
}

export function fetchPopularPosts() {
  return fetch( { requestType: 'posts', endpoint: `x/popular` } );
}
