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
import { PostPreview, Loader } from '../components';

// Utils
import { stringUtils } from '../utils';

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
function getCategoryPosts( componentRef ) {
  let slug = componentRef.props.match.params.slug;
  let excludes = getExcludes( componentRef.props.archive[ slug ] || [] );
  let params = { excludes };

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

    // // Map extracted posts to components.
    let posts = archivePosts.reduce( ( a, b, i ) => {
      if ( i === 0 || ( i + 1 ) % 5 === 0 ) {
         a.push( [ b ] )
       } else {
        a[ a.length - 1 ].push( b )
       }

      return a;

    }, [] )
    .map( ( postArr, i ) => {
      let postPreviewMarkup = postArr
        .map( ( post, j ) => {
          return <PostPreview key={ j } data={ post } />
        } );

      return (
        <section className="post-batch" key={ i }>
          { postPreviewMarkup }
          <div className="sjmlm_bucket"></div>
        </section>
      );
    } );

    // Assign `output` to account for possibility that `posts` does not exist or is invalid.
    let output = ( Array.isArray( posts ) && posts.length ) ? posts : <Loader />;

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
    // Create 'bound' version of `handleScroll` callback.
    // Required so that function:
    // - Has access to component reference via `this`.
    // - Can be removed within `componentWillUnmount()`.

    if ( !this.props.staticContext && !this.boundHandleScroll ) {
      this.boundHandleScroll = this.handleScroll.bind( this );

      // ...
      window.addEventListener( 'scroll', this.boundHandleScroll );
    }

    /// TODO[@jmykolyn] - Look into whether this can be removed (exact same logic exists in `componentDidUpdate()`)?
    if ( checkFetch( this ) ) {
      getCategoryPosts( this )
        .then( ( response ) => {
          this.props.archiveActions.update( JSON.parse( response.payload ), response.slug );
        } )
        .catch( ( err ) => {
          console.log( err );
        } );
    }
  }

  componentWillUnmount() {
    console.log( 'INSIDE `componentWillUnmount()`' ); /// TEMP

    window.removeEventListener( 'scroll', this.boundHandleScroll );
  }

  componentDidUpdate( prevProps, prevState ) {
    /// TODO[@jmykolyn] - Look into whether or not we need to do this in all cases?
    /// TODO[@jmykolyn] - Look into whether this can be removed (exact same logic exists in `componentWillMount()`)?
    if ( checkFetch( this ) ) {
      getCategoryPosts( this )
       .then( ( response ) => {
          this.props.archiveActions.update( JSON.parse( response.payload ), response.slug );
        } )
        .catch( ( err ) => {
          console.log( err );
        } );
    }

    // Check for presence of `__loadMore`, fetch additional posts if required.
    if ( this.props.archive.__loadMore ) {
      getCategoryPosts( this )
        .then( ( response ) => {
          this.props.archiveActions.resolveLoadMore( JSON.parse( response.payload ), response.slug );
        } )
        .catch( ( err ) => {
          console.log( err );
        } );
    }
  }

  handleScroll() {
    console.log( 'INSIDE `handleScroll()`' ); /// TEMP

    try {
      let winHeight = window.innerHeight;
      let winScroll = window.pageYOffset;
      let docHeight = document.body.clientHeight;

      if ( ( docHeight - ( winHeight + winScroll ) ) <= winHeight ) {
        if ( !this.props.archive.__loadMore ) {
          this.props.archiveActions.initLoadMore( this.props.match.params.slug );
        }
      }
    } catch ( err ) {
      /// TOD
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
