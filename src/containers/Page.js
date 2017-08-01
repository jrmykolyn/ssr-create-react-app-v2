import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// Components
import { Loader } from '../components';

import * as pageActions from '../actions/page'

import * as wordpressApi from '../wordpressApi';

import './Page.css'

class Page extends Component {
  constructor() {
    super();
  }

  render() {
    let slug = this.props.match.params.slug || '';
    let page = null;
    let output;

    if ( slug ) {
      page = this.props.page[ slug ] || null;

      if ( page ) {
        output = (
          <section className="page-wrapper">
            <section className="page-header">
              <h1>{ page.post_title }</h1>
            </section>
            <section className="page-body">
              <div className="page-body__inner" dangerouslySetInnerHTML={ { __html: page.post_content } }>
              </div>
            </section>
            <section className="page-footer"></section>
          </section>
        );
      } else {
        output = <Loader />
      }
    }

    return (
      <main>
        { output }
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

  componentDidUpdate() {
    /// TODO[@jmykolyn] - Refactor with body of `componentWillMount()` above. See `Archive.js` for direction.
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
