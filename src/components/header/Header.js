// Vendor
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// Components
import { Menu } from '../menu';

// Config.
import { PERMALINKS_CONFIG } from '../../config/';  // NOTE - Trailing `/` required so that `require( ... )` imports `src/config/index.js`, *NOT* `src/config.js`... Fix this!

import './Header.css'

export class Header extends Component {
  render(){
    /// TEMP
    let showSearchBar = ( this.props.searchBar && this.props.searchBar.isActive );

    return(
      <header className="header">
        <div className="header__upper">
          <Menu data={ this.props.secondaryMenu } menuType="secondary" />
        </div>
        <div className="header__inner">
          <div className="nav-toggle-wrap" onClick={ this.toggleDrawerNav.bind( this ) }>
          </div>
          <div className="logo-wrap">
            <a href="#">
              <img className="logo" src="/assets/logos/ottawa-logo-base.svg" alt="#" />
            </a>
          </div>
          <div className="controls-wrap">
            <Menu data={ this.props.primaryMenu } menuType="primary" />
            <div className="socials-wrap">
              <ul className="socials-list">
                <li>
                  <a href="#">
                    <img src="/assets/icons/header_facebook.svg" alt="#" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src="/assets/icons/header_twitter.svg" alt="#" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src="/assets/icons/header_instagram.svg" alt="#" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="search-toggle" onClick={ this.toggleSearch.bind( this ) }>
              <img src="/assets/icons/search-open.png" alt="#" />
            </div>
          </div>
          <div className={ "search-wrap " + ( showSearchBar ? 'is-active' : '' ) }>
            <form method="GET" action={ PERMALINKS_CONFIG.search }>
              <input type="text" name="q" />
              <input type="submit" value="" />
            </form>
            <div className="search-toggle" onClick={ this.toggleSearch.bind( this ) }>
              <img src="/assets/icons/search-close.png" alt="#" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  toggleSearch() {
    this.props.toggleSearch();
  }

  toggleDrawerNav() {
    this.props.toggleDrawerNav();
  }
}
