import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux'

// Components
import { Socials } from '../components';

// Utils
import { stringUtils, mediaUtils, postUtils } from '../utils';

import * as postActions from '../actions/post'

import * as wordpressApi from '../wordpressApi';

import './Single.css'

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------


// --------------------------------------------------
// DEFINE CLASS
// --------------------------------------------------
class Single extends Component {
  constructor() {
    super();
  }

  componentWillMount() {
    // ...
    this.boundHandleScroll = this.handleScroll.bind( this );

    // ...
    window.addEventListener( 'scroll', this.boundHandleScroll );

    // ...
    if ( !this.props.staticContext && ( !this.props.post || !this.props.post[ this.props.match.params.slug ] ) ) {
      wordpressApi.fetchPostBySlug( this.props.match.params.slug )
        .then( ( response ) => {
          this.props.postActions.update( JSON.parse( response.payload ), response.slug );
        } )
        .catch( ( err ) => {
          console.log( err ); /// TEMP
        } );
    }
  }

  render() {
    let slug = '';
    let posts = [];
    let output = '';

    // ...
    try {
      slug = this.props.match.params.slug;

      posts = Object.keys( this.props.post )
        .filter( ( postSlug ) => { return postSlug === slug; } )
        .map( ( postSlug ) => { return this.props.post[ postSlug ]; } )
        .reduce( ( a, b ) => { return [ ...a, ...b ] }, [] );
    } catch ( err ) {
      /// TODO
    }

    output = posts.map( ( post, i ) => {
      let postHero = ( post.thumbnail ) ? ( <section className="post-hero" dangerouslySetInnerHTML={ { __html: post.thumbnail } }></section> ) : '';
      let socialMediaData = mediaUtils.extractSocialMediaData( post );
      let postSlug = stringUtils.handleize( post.post_name );

      // ...
      return (
        <article key={ i } data-post-slug={postSlug}>
          <Helmet>
            <title>{ stringUtils.titleize( post.post_title ) }</title>
          </Helmet>
          { postHero }
          <section className="post-header">
            <h1>{ post.post_title }</h1>
          </section>
          <section className="post-body">
            <Socials data={ socialMediaData } />
            <div className="post-body__inner" dangerouslySetInnerHTML={ { __html: post.post_content } }>
            </div>
          </section>
          <section className="post-footer"></section>
        </article>
      );
    } );

    return (
      <main>
        { output }
      </main>
    );
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
    // console.log( 'INSIDE `Single#componentDidUpdate()`' ); /// TEMP

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
    // console.log( 'INSIDE `Single#componentWillUnmount()`' ); /// TEMP

    // ...
    window.removeEventListener( 'scroll', this.boundHandleScroll );
  }

  handleScroll() {
    // Check if 'load more' needs to be triggered.
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

    // Check if route needs to be updated.
    /// TODO[@jmykolyn] - Make this not gross...
    try {
      // ...
      if ( this.props.post[ this.props.match.params.slug ].length > 1 ) {
        // ...
        let postElems = document.querySelectorAll( 'article' );
        postElems = Array.prototype.slice.call( postElems );

        // MAP ELEMS TO EL REFERENCE + OFFSET NUMBER
        let postMap = postElems.map( ( post ) => {
          return {
            elem: post,
            offset: post.getBoundingClientRect().top,
          }
        } );

        // FILTER OUT POSTS WHICH ARE 'BELOW THE FOLD'
        postMap = postMap.filter( ( obj ) => {
          return obj.offset <= 0;
        } );

        // REDUCE REMAINING TO POST TO 'CLOSEST TO TOP OF VIEWPORT'
        let activePost = postMap.reduce( ( a, b ) => {
          if ( !a.elem || !a.offset ) {
            return b;
          }

          return ( a.offset > b.offset ) ? a : ( a.offset < b.offset ) ? b : b;
        }, {} );

        let slug = activePost.elem.dataset.postSlug;

        // ...
        if ( window.location.pathname.indexOf( slug ) === -1 ) {
          window.history.pushState( { foo: 'bar' }, 'title', slug );
        }
      }
    } catch ( err ) {

    }
  }
}

const mapStateToProps = ( state ) => ( {
  post: state.post
} );

const mapDispatchToProps = ( dispatch ) => ( {
  postActions: bindActionCreators( postActions, dispatch )
} );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Single )
