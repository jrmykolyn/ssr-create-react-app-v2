import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom'

import Home from './Home';
import Single from './Single'
import Page from './Page';
import Archive from './Archive';
import NoMatch from '../components/NoMatch'
import { Footer, Header, Menu } from '../components'

import * as appActions from '../actions/app';

import * as wordpressApi from '../wordpressApi';

class App extends Component {
  render() {
    let menuData = [];

    /// TEMP
    try {
      console.log( 'UPDATING `menuData`' ); /// TEMP

      // NOTE:
      // - `menus` should be a two dimensional array.
      // - If item at index 0 does not exist, fallback to empty array.
      menuData = this.props.app.menus[ 0 ] || [];
    } catch ( err ) {
      /// TODO[@jrmykolyn] - Handle error.
    }

    return (
      <div>
        <Header menuData={ menuData }></Header>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/category/:slug" component={Archive} />
          <Route path="/:category/:slug" component={Single} />
          <Route path="/:slug" component={Page} />
          <Route component={NoMatch}/>
        </Switch>
        <Footer></Footer>
      </div>
    );
  }

  componentWillMount() {
    if ( !this.props.staticContext && ( !this.props.app || !this.props.app.menus || !this.props.app.menus.length ) ) {
      this.wordpressApi.fetchMenus()
        .then( ( response ) => {
          return JSON.parse( response.payload );
        } )
        .then( ( payload ) => {
          this.props.appActions.updateMenus( payload );
        } )
        .catch( ( err ) => {
          console.log( err ); /// TEMP
        } );
    }
  }
}

const mapStateToProps = ( state ) => ( {
  app: state.app
} );

const mapDispatchToProps = ( dispatch ) => ( {
  appActions: bindActionCreators( appActions, dispatch )
} );

// NOTE:
// - Exporting `App` component via `connect()` prevents URL location change from rendering new components.
// - Fix is to to wrap `connect( ... )` call in `withRouter( ... )`.
// - Fix taken from: https://github.com/ReactTraining/react-router/issues/4671.
export default withRouter( connect(
  mapStateToProps,
  mapDispatchToProps
)( App ) );
