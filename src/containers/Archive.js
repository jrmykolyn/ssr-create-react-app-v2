// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// Actions
import * as archiveActions from '../actions/archive'

// ...
import * as wordpressApi from '../wordpressApi';

// Components
import { PostBatch, Loader } from '../components';

// Utils
import { stringUtils, arrayUtils } from '../utils';

// Styles
import './Archive.css';

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
/**
 * ...
 */
/// TODO[@jmykolyn] - Rename this!
function checkFetch( componentRef ) {
  // Fetch data if:
  // - We're in the client
  // *AND EITHER*
  // - The 'archive' object does not exist.
  // - The specific key does not exist on the `archive` object.
  try {
    return ( !componentRef.props.staticContext && ( !componentRef.props.archive || !componentRef.props.archive[ componentRef.props.match.params.slug ] ) );
  } catch ( err ) {
    return false;
  }
}

/**
 * ...
 *
 * NOTE:
 * - Function *always* provides a list of 'excludes' when fetching new data.
 */
function getCategoryPosts( componentRef, params={} ) {
  let slug = componentRef.props.match.params.slug;
  let excludes = getExcludes( componentRef.props.archive[ slug ] || [] );

  params = { ...params, ...{ excludes } };

  return new Promise( ( resolve, reject ) => {
    wordpressApi.fetchPostsByCategory( slug, params )
      .then( resolve, reject );
  } );
}

/**
 * ...
 */
function getExcludes( posts ) {
  return posts.map( ( post ) => { return post.ID } );
}

// --------------------------------------------------
// DEFINE CLASS
// --------------------------------------------------
export class Archive extends Component {
  render() {
    // Extract the `archiveType` (eg. the specific category) from the route.
    let slug = this.props.match.params.slug || '';

    // Extract the correspondng posts from the `archive` data; fall back to empty array.
    let archivePosts = ( this.props.archive && this.props.archive[ slug ] ) ? this.props.archive[ slug ] : [];
    let postBatches = arrayUtils.arrayToMatrix( archivePosts, 6 );

    // Map extracted posts to components.
    let postBatchMarkup = postBatches.map( ( batch, i ) => {
      return (
        <PostBatch data={ batch } key={ i } />
      );
    } );

    // Assign `output` to account for possibility that `posts` does not exist or is invalid.
    let output = ( Array.isArray( postBatchMarkup ) && postBatchMarkup.length ) ? postBatchMarkup : <Loader />;

    return (
      <main className="archive-wrapper">
        <Helmet>
          <title>{ stringUtils.transform( slug, [ stringUtils.dehandleize, stringUtils.titleize ] ) }</title>
        </Helmet>
        { output }
      </main>
    );
  }

  componentWillMount() {
    if ( !this.props.staticContext && !this.boundHandleScroll ) {
      // Create 'bound' version of `handleScroll` callback.
      // Required so that function:
      // - Has access to component reference via `this`.
      // - Can be removed within `componentWillUnmount()`.
      this.boundHandleScroll = this.handleScroll.bind( this );

      // ...
      window.addEventListener( 'scroll', this.boundHandleScroll );
    }

    /// TODO[@jmykolyn] - Look into whether this can be removed (exact same logic exists in `componentDidUpdate()`)?
    if ( checkFetch( this ) ) {
      getCategoryPosts( this, { postsPerPage: 12 } )
        .then( ( response ) => {
          this.props.archiveActions.update( JSON.parse( response.payload ), response.slug );
        } )
        .catch( ( err ) => {
          console.log( err );
        } );
    }
  }

  componentWillUnmount() {
    window.removeEventListener( 'scroll', this.boundHandleScroll );
  }

  componentDidUpdate( prevProps, prevState ) {
    /// TODO[@jmykolyn] - Look into whether or not we need to do this in all cases?
    /// TODO[@jmykolyn] - Look into whether this can be removed (exact same logic exists in `componentWillMount()`)?
    if ( checkFetch( this ) ) {
      getCategoryPosts( this, { postsPerPage: 12 } )
       .then( ( response ) => {
          this.props.archiveActions.update( JSON.parse( response.payload ), response.slug );
        } )
        .catch( ( err ) => {
          console.log( err );
        } );
    }

    // Check for presence of `__loadMore`, fetch additional posts if required.
    if ( this.props.archive.__loadMore ) {
      getCategoryPosts( this, { postsPerPage: 12 } )
        .then( ( response ) => {
          this.props.archiveActions.resolveLoadMore( JSON.parse( response.payload ), response.slug );
        } )
        .catch( ( err ) => {
          console.log( err );
        } );
    }
  }

  handleScroll() {
    try {
      let winHeight = window.innerHeight;
      let winScroll = window.pageYOffset;
      let docHeight = document.body.clientHeight;

      if ( ( docHeight - ( winHeight + winScroll ) ) <= ( winHeight * 2 ) ) {
        if ( !this.props.archive.__loadMore ) {
          this.props.archiveActions.initLoadMore( this.props.match.params.slug );
        }
      }
    } catch ( err ) {
      /// TODO
    }
  }
}

const mapStateToProps = ( state ) => ( {
  archive: state.archive
} );

const mapDispatchToProps = ( dispatch ) => ( {
  archiveActions: bindActionCreators( archiveActions, dispatch )
} );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Archive )
