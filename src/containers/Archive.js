import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as archiveActions from '../actions/archive'

import * as wordpressApi from '../wordpressApi';

// Components
import { PostPreview } from '../components';

import './Archive.css';

export class Archive extends Component {
  render() {
    let archivePosts = this.props.archive || [];
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
    // Fetch data if:
    // - We're in the client
    // *AND EITHER*
    // - The 'archive' object does not exist.
    // - The 'archive' object is empty.
    /// FIXME[@jrmykolyn] - What happens if we've already loaded posts of a specific category, and we want to load posts of a different category?!
    if ( !this.props.staticContext && ( !this.props.archive || !this.props.archive.length ) ) {
      wordpressApi.fetchPostsByCategory( this.props.match.params.slug )
        .then( ( response ) => {
          return JSON.parse( response.payload );
        } )
        .then( ( payload ) => {
          this.props.archiveActions.update( payload );
        } )
        .catch( ( err ) => {
          console.log( err ); /// TEMP
        } );
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
