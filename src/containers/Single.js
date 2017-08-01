import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux'

// Components
import { Socials, Feed } from '../components';

// Utils
import { stringUtils, mediaUtils, postUtils } from '../utils';

import * as postActions from '../actions/post'

import * as wordpressApi from '../wordpressApi';

import './Single.css'

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function getPostSlug( componentRef ) {
  try {
    return componentRef.props.match.params.slug;
  } catch ( err ) {
    return '';
  }
}

// --------------------------------------------------
// DEFINE CLASS
// --------------------------------------------------
class Single extends Component {
  constructor() {
    super();
  }

  render() {
    let slug = '';
    let posts = [];
    let output = '';
    let activePostSlug = '';

    // ...
    try {
      slug = getPostSlug( this );
      posts = this.props.post[ slug ] || [];

      activePostSlug = (
        this.props.post.__activePost
        && this.props.post.__activePost.post_name
        && this.props.post.__activePost.post_name !== slug
      ) ? stringUtils.handleize( this.props.post.__activePost.post_name ) : slug;

      if ( !this.props.staticContext ) {
        window.history.pushState( { foo: 'bar' }, 'title', activePostSlug ); /// TEMP
      }
    } catch ( err ) {
      /// TODO
    }

    output = posts.map( ( post, i ) => {
      let postHero = ( post.thumbnail ) ? ( <section className="post-hero" dangerouslySetInnerHTML={ { __html: post.thumbnail } }></section> ) : '';
      let postSlug = stringUtils.handleize( post.post_name );
      let socialMediaData = ( !this.props.staticContext ) ? mediaUtils.extractSocialMediaData( post ) : [];

      // ...
      return (
        <article key={ i } data-post-slug={postSlug} ref={ (elem) => { this.props.post[ slug ][ i ].__ref = elem; } }>
          { postHero }
          <section className="post-header">
            <h1>{ post.post_title }</h1>
          </section>
          <section className="post-body">
            <Socials data={ socialMediaData } />
            <div className="post-body__inner" dangerouslySetInnerHTML={ { __html: post.post_content } }>
            </div>
          </section>
          <section className="post-footer">
            <Feed data={ this.props.post.__recent || [] } />
          </section>
        </article>
      );
    } );

    return (
      <main>
        { output }
      </main>
    );
  }

  componentWillMount() {
    // ...
    if ( !this.props.staticContext ) {
      if ( !this.boundHandleScroll ) {
        // ...
        this.boundHandleScroll = this.handleScroll.bind( this );

        // ...
        window.addEventListener( 'scroll', this.boundHandleScroll );
      }

      if ( !this.props.post || !this.props.post[ this.props.match.params.slug ] ) {
        wordpressApi.fetchPostBySlug( this.props.match.params.slug )
          .then( ( response ) => {
            this.props.postActions.update( JSON.parse( response.payload ), response.slug );
          } )
          .catch( ( err ) => {
            console.log( err ); /// TEMP
          } );
      }
    }
  }

  componentWillReceiveProps() {
    // console.log( 'INSIDE `Single#componentWillReceiveProps()`' ); /// TEMP
  }

  // shouldComponentUpdate() {
  //   console.log( 'INSIDE `Single#shouldComponentUpdate()`' ); /// TEMP
  // }

  componentWillUpdate() {
    // console.log( 'INSIDE `Single#componentWillUpdate()`' ); /// TEMP
  }

  componentDidUpdate() {
    /// TODO - Ensure that `fetchRecentPosts()` does not fire more than once.
    if ( !this.props.post.__recent ) {
      wordpressApi.fetchRecentPosts( { postsPerPage: 3 } )
        .then( ( response ) => {
          return JSON.parse( response.payload );
        } )
        .then( ( payload ) => {
          this.props.postActions.setRecent( payload );
        } )
        .catch( ( err ) => {
          /// TODO
        } );
    }

    if ( this.props.post.__loadMore ) {
      let { category, slug } = this.props.match.params;
      let excludes = postUtils.getIds( this.props.post[ slug ] );
      let postsPerPage = 1;

      let params = { excludes, postsPerPage };

      wordpressApi.fetchPostsByCategory( category, params )
        .then( ( response ) => {
          return JSON.parse( response.payload );
        } )
        .then( ( payload ) => {
          this.props.postActions.resolveLoadMore( payload, slug );
        } )
        .catch( ( err ) => {
          console.log( err ); /// TEMP
        } );
    }
  }

  componentWillUnmount() {
    console.log( 'INSIDE `Single#componentWillUnmount()`' ); /// TEMP
    this.props.postActions.removeActive();

    // ...
    window.removeEventListener( 'scroll', this.boundHandleScroll );
  }

  handleScroll() {
    // Check if 'load more' needs to be triggered.
    this.handleLoadMore();

    // Check if route needs to be updated.
    this.handleRouteUpdate();
  }

  handleLoadMore() {
    try {
      let winHeight = window.innerHeight;
      let winScroll = window.pageYOffset;
      let docHeight = document.body.clientHeight;

      /// TODO[@jmykolyn] - Add comments, refactor.
      if ( !this.props.post.__loadMore && ( docHeight - ( winHeight + winScroll ) ) <= winHeight ) {
        this.props.postActions.initLoadMore();
      }
    } catch ( err ) {
      /// TODO
    }
  }

  handleRouteUpdate() {
    /// TODO[@jmykolyn] - Make this less gross...
    try {
      let slug = getPostSlug( this );

      // Proceed if current slug's array contains at least 2x posts.
      if ( this.props.post[ slug ].length > 1 ) {

        // Assign `newActivePost` based on post's proximity to top of viewport.
        let newActivePost = this.props.post[ slug ]
          .filter( ( post ) => {
            return post.__ref.getBoundingClientRect().top <= 0;
          } )
          .reduce( ( a, b ) => {
            let aOffset = a.__ref.getBoundingClientRect().top;
            let bOffset = b.__ref.getBoundingClientRect().top;

            return ( a.offset > b.offset ) ? a : ( a.offset < b.offset ) ? b : b;
          } );

        // Update `__activePost` if applicable.
        if ( !this.props.post.__activePost || this.props.post.__activePost.ID !== newActivePost.ID ) {
          this.props.postActions.setActive( newActivePost );
        }

      }
    } catch ( err ) {
      /// TODO
    }
  }
}

const mapStateToProps = ( state ) => ( {
  post: state.post,
  recent: state.recent,
} );

const mapDispatchToProps = ( dispatch ) => ( {
  postActions: bindActionCreators( postActions, dispatch ),
} );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Single )
