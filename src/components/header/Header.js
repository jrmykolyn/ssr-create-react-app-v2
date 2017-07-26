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
    return(
      <header>
        <div className="header__upper">
          <Menu data={ this.props.secondaryMenu } menuType="secondary" />
        </div>
        <div className="header__inner">
          <h1>Title!</h1>
          <Menu data={ this.props.primaryMenu } menuType="primary" />
        </div>
        <div className="header__search">
          <form method="GET" action={ PERMALINKS_CONFIG.search }>
            <input type="text" name="q" />
            <input type="submit" value="" />
          </form>
        </div>
      </header>
    );
  }
}
