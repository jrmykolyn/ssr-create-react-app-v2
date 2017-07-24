// Vendor
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// Components
import { Menu } from '../menu';

import './Header.css'

export class Header extends Component {
  render(){
    return(
      <header>
        <div className="header__inner">
          <h1>Title!</h1>
          <Menu data={ this.props.menuData } />
        </div>
      </header>
    );
  }
}
