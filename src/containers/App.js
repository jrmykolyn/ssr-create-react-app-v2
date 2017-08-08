import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom'

import Home from './Home';
import Single from './Single'
import Page from './Page';
import Archive from './Archive';
import Search from './Search';
import NoMatch from '../components/NoMatch'
import { Footer, Header, Menu, DrawerNav } from '../components'

import * as appActions from '../actions/app';

import * as wordpressApi from '../wordpressApi';
import { DfpService } from '../dfp.service';

// Config.
const CONFIG = require( '../config/' ); // NOTE - Trailing `/` required so that `require( ... )` imports `src/config/index.js`, *NOT* `src/config.js`... Fix this!
const { MENU_CONFIG } = CONFIG;

class App extends Component {
  render() {
    // Data
    let primaryMenuData = [];
    let secondaryMenuData = [];
    let mobileMenuData = [];

    let searchBar = {};
    let drawerNav = {};

    // ...
    if ( !this.props.staticContext && ( !this.props.app.services || !this.props.app.services.dfp ) ) {
      this.props.appActions.updateServices( { name: 'dfp', ref: new DfpService() } );
    }

    try {
      // NOTE:
      // `menus` should be an object, where the value @ each key is an array of menu items.
      primaryMenuData = this.props.app.menus[ MENU_CONFIG.primary || 'primary' ] || [];
      secondaryMenuData = this.props.app.menus[ MENU_CONFIG.secondary || 'secondary' ] || [];
      mobileMenuData = this.props.app.menus[ MENU_CONFIG.mobile || 'mobile' ] || [];
      searchBar = this.props.app.searchBar;
      drawerNav = this.props.app.drawerNav;
    } catch ( err ) {
      /// TODO[@jrmykolyn] - Handle error... or don't?
    }

    return (
      <div className="app-content">
        <div className={ 'page-content ' + ( drawerNav && drawerNav.isActive ? 'drawer-nav-active' : '' ) }>
          <Header toggleSearch={ this.toggleSearch.bind( this ) } toggleDrawerNav={ this.toggleDrawerNav.bind( this ) } searchBar={ searchBar } primaryMenu={ primaryMenuData } secondaryMenu={ secondaryMenuData }></Header>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/search/" component={Search} />
            <Route path="/category/:slug" component={Archive} />
            <Route path="/:category/:slug" component={Single} />
            <Route path="/:slug" component={Page} />
            <Route component={NoMatch}/>
          </Switch>
          <Footer></Footer>
        </div>
        <DrawerNav data={ mobileMenuData } drawerNav={ drawerNav } closeDrawerNav={ this.closeDrawerNav.bind( this ) } />
      </div>
    );
  }

  componentWillMount() {
    if ( !this.props.staticContext ) {
      if ( !this.props.app || !this.props.app.menus || !this.props.app.menus[ MENU_CONFIG.primary || 'primary' ] ) {
        wordpressApi.fetchMenus()
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

  toggleSearch() {
    this.props.appActions.toggleSearchBar();
  }

  toggleDrawerNav() {
   this.props.appActions.toggleDrawerNav();
  }

  closeDrawerNav() {
   this.props.appActions.closeDrawerNav();
  }
}

const mapStateToProps = ( state ) => ( {
  app: state.app,
} );

const mapDispatchToProps = ( dispatch ) => ( {
  appActions: bindActionCreators( appActions, dispatch ),
} );

// NOTE:
// - Exporting `App` component via `connect()` prevents URL location change from rendering new components.
// - Fix is to to wrap `connect( ... )` call in `withRouter( ... )`.
// - Fix taken from: https://github.com/ReactTraining/react-router/issues/4671.
export default withRouter( connect(
  mapStateToProps,
  mapDispatchToProps
)( App ) );
