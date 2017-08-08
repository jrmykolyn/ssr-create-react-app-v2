import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { routeUtils } from '../../utils';

import './DrawerNav.css';

export class DrawerNav extends Component {
  render() {
    let data = this.props.data || [];
    let output = data.map( ( link, i ) => {
      let linkData = routeUtils.parseWpLink( link );

      if ( linkData.isExternal ) {
        return (
          <li>
            <a href={ link.url }>{ link.title || '' }</a>
          </li>
        );
      } else {
        return (
          <li>
            <Link to={ linkData.parsedUrl } onClick={ this.props.closeDrawerNav.bind( this ) }>{ link.title || '' }</Link>
          </li>
        );
      }
    } );
    let showDrawerNav = this.props.drawerNav && this.props.drawerNav.isActive;

    return (
      <div className={ 'drawer-nav ' + ( showDrawerNav ? 'is-active' : '' ) }>
        <div className="drawer-nav__header">
          <img className="mobile-logo" src="/assets/logos/mobile-logo-o.svg" alt="#" />
        </div>
        <div className="drawer-nav__body">
          <nav>
            <ul>
              { output }
            </ul>
          </nav>
        </div>
        <div className="drawer-nav__footer"></div>
      </div>
    );
  }

  closeDrawerNav() {

  }
}
