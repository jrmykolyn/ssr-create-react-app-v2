// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// Actions
import * as archiveActions from '../actions/archive'

// ...
import * as wordpressApi from '../wordpressApi';

// Components
import { PostPreview } from '../components';

// Styles
import './Archive.css';

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
/**
 * ...
 */
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
 */
function getCategoryData( componentRef ) {
  wordpressApi.fetchPostsByCategory( componentRef.props.match.params.slug )
    .then( ( response ) => {
      componentRef.props.archiveActions.update( JSON.parse( response.payload ), response.slug );
    } )
    .catch( ( err ) => {
      console.log( err ); /// TEMP
    } );
}

// --------------------------------------------------
// DEFINE CLASS
// --------------------------------------------------
export class Archive extends Component {
  render() {
    console.log( 'INSIDE `Archive#render()`' ); /// TEMP

    // Extract the `archiveType` (eg. the specific category) from the route.
    let slug = this.props.match.params.slug || '';

    // Extract the correspondng posts from the `archive` data; fall back to empty array.
    let archivePosts = ( this.props.archive && this.props.archive[ slug ] ) ? this.props.archive[ slug ] : [];

    // Map extracted posts to components.
    let posts = archivePosts.map( ( post ) => {
      return (
        <PostPreview key={ post.ID } data={ post } />
      );
    } );

    return (
      <main>
        { posts }
      </main>
    );
  }

  componentWillMount() {
    console.log( 'INSIDE `Archive#componentWillMount()`' ); /// TEMP

    if ( checkFetch( this ) ) {
      getCategoryData( this );
    }
  }

  componentDidUpdate( prevProps, prevState ) {
    console.log( 'INSIDE `Archive#componentDidUpdate()`' ); /// TEMP

    /// TODO[@jmykolyn] - Look into whether or not we need to do this in all cases?
    if ( checkFetch( this ) ) {
      getCategoryData( this );
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
