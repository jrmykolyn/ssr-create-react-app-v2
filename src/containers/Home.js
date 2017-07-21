import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as homeActions from '../actions/home'

import './Home.css';

export class Home extends Component {
  render() {
    return (
      <main>Hello, world! This is the home page.</main>
    );
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
