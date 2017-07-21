import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as postActions from '../actions/post'

import * as wordpressApi from '../wordpressApi';

import './Single.css'

class Single extends Component {
  constructor() {
    super();

    console.log( 'INSIDE `Single#constructor()` --> LOGGING OUT `this`' ); /// TEMP
    console.log( this ); /// TEMP
  }

  componentWillMount() {
    console.log( 'INSIDE `Single#componentWillMount()`' ); /// TEMP
    console.log( this );

    if ( !this.props.staticContext && ( !this.props.post.ID || this.props.post.post_name !== this.props.match.params.slug ) ) {
      wordpressApi.fetchPostBySlug( this.props.match.params.slug )
        .then( ( response ) => {
          return JSON.parse( response.payload );
        } )
        .then( ( response ) => {
          this.props.postActions.update( response );
        } )
        .catch( ( err ) => {
          console.log( err ); /// TEMP
        } );
    }
  }

  render() {
    return (
      <main>
        <section className="post-header">
          <h1>{ this.props.post.post_title }</h1>
        </section>
        <section className="post-body">
          <div className="post-body__inner" dangerouslySetInnerHTML={ { __html: this.props.post.post_content } }>
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
