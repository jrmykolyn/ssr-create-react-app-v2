// Vendor
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './Header.css'

export class Header extends Component {
  render(){
    return(
      <header>
        <div className="header__inner">
          <h1>Title!</h1>
          <nav>
            <Link to={'/'}>Home</Link>
            <Link to={'/sample-page'}>Sample Page</Link>
            <Link to={'/post/hello-world'}>Sample Post</Link>
            <Link to={'/category/test'}>Archive Page</Link>
          </nav>
        </div>
      </header>
    );
  }
}
