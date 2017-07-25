import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as postActions from '../actions/post'

import * as wordpressApi from '../wordpressApi';

import './Single.css'

class Single extends Component {
  constructor() {
    super();
  }

  componentWillMount() {
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
    let post = {};

    // ...
    try {
      // ...
      slug = this.props.match.params.slug;

      // ...
      post = Object.keys( this.props.post )
        .filter( ( postSlug ) => { return postSlug === slug; } )
        .map( ( postSlug ) => { return this.props.post[ postSlug ]; } )
        .reduce( ( a, b ) => { return { ...a, ...b }; }, {} );
    } catch ( err ) {
      /// TODO
    }

    // ...
    return (
      <main>
        <section className="post-header">
          <h1>{ post.post_title }</h1>
        </section>
        <section className="post-body">
          <div className="post-body__inner" dangerouslySetInnerHTML={ { __html: post.post_content } }>
          </div>
        </section>
        <section className="post-footer"></section>
      </main>
    );
  }

  componentWillReceiveProps() {
    console.log( 'INSIDE `Single#componentWillReceiveProps()`' ); /// TEMP
  }

  // shouldComponentUpdate() {
  //   console.log( 'INSIDE `Single#shouldComponentUpdate()`' ); /// TEMP
  // }

  componentWillUpdate() {
    console.log( 'INSIDE `Single#componentWillUpdate()`' ); /// TEMP
  }

  componentDidUpdate() {
    console.log( 'INSIDE `Single#componentDidUpdate()`' ); /// TEMP
  }

  componentWillUnmount() {
    console.log( 'INSIDE `Single#componentWillUnmount()`' ); /// TEMP
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
