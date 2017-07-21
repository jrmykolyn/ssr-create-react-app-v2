import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as homeActions from '../actions/home'

import * as wordpressApi from '../wordpressApi';

import './Home.css';

export class Home extends Component {
  render() {
    return (
      <main>
        <section className="post-header">
          <h1>{ this.props.home.post_title }</h1>
        </section>
        <section className="post-body">
          <div className="post-body__inner" dangerouslySetInnerHTML={ { __html: this.props.home.post_content } }>
          </div>
        </section>
        <section className="post-footer"></section>
      </main>
    );
  }

  componentWillMount() {
    // Fetch data if we're in the client *AND* the 'home' object does not contain an ID.
    if ( !this.props.staticContext && !this.props.home.ID ) {
      wordpressApi.fetchHomePage()
        .then( ( response ) => {
          return JSON.parse( response.payload );
        } )
        .then( ( payload ) => {
          this.props.homeActions.update( payload );
        } )
        .catch( ( err ) => {
          console.log( err ); /// TEMP
        } );
    }
  }
}

const mapStateToProps = ( state ) => ( {
  home: state.home
} );

const mapDispatchToProps = ( dispatch ) => ( {
  homeActions: bindActionCreators( homeActions, dispatch )
} );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Home )
