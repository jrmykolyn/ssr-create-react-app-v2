import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as pageActions from '../actions/page'

import * as wordpressApi from '../wordpressApi';

import './Single.css'

class Page extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <main>
        <section className="post-header">
          <h1>{ this.props.page.post_title }</h1>
        </section>
        <section className="post-body">
          <div className="post-body__inner" dangerouslySetInnerHTML={ { __html: this.props.page.post_content } }>
          </div>
        </section>
        <section className="post-footer"></section>
      </main>
    );
  }

  componentWillMount() {
    if ( !this.props.staticContext && ( !this.props.page.ID || this.props.page.post_name !== this.props.match.params.slug ) ) {
      wordpressApi.fetchPageBySlug( this.props.match.params.slug )
        .then( ( response ) => {
          return JSON.parse( response.payload );
        } )
        .then( ( response ) => {
          this.props.pageActions.update( response );
        } )
        .catch( ( err ) => {
          console.log( err ); /// TEMP
        } );
    }
  }
}

const mapStateToProps = ( state ) => ( {
  page: state.page
} );

const mapDispatchToProps = ( dispatch ) => ( {
  pageActions: bindActionCreators( pageActions, dispatch )
} );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Page )
