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
    let slug = '';
    let page = {};

    // ...
    try {
      // ...
      slug = this.props.match.params.slug;

      // ...
      page = Object.keys( this.props.page )
        .filter( ( pageSlug ) => { return pageSlug === slug; } )
        .map( ( pageSlug ) => { return this.props.page[ pageSlug ]; } )
        .reduce( ( a, b ) => { return { ...a, ...b }; }, {} );
    } catch ( err ) {
      /// TODO
    }

    return (
      <main>
        <section className="post-header">
          <h1>{ page.post_title }</h1>
        </section>
        <section className="post-body">
          <div className="post-body__inner" dangerouslySetInnerHTML={ { __html: page.post_content } }>
          </div>
        </section>
        <section className="post-footer"></section>
      </main>
    );
  }

  componentWillMount() {
    if ( !this.props.staticContext && ( !this.props.page || !this.props.page[ this.props.match.params.slug ] ) ) {
      wordpressApi.fetchPageBySlug( this.props.match.params.slug )
        .then( ( response ) => {
          this.props.pageActions.update( JSON.parse( response.payload ), response.slug );
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
