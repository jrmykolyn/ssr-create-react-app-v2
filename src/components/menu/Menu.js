// Vendor
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './Menu.css'

function parseWpLink( link ) {
  link = ( link && typeof link === 'string' ) ? link : '';

  if ( !link ) {
    return '/';
  }

  /// TODO[@jrmykolyn]
  // - Remove API portion of URL
  // - Determine 'type' of request (eg. `page`, `post`, etc.).
  // - Return result.
}

export class Menu extends Component {
  render() {
    let links = this.props.data.map( ( link, i ) => {
      return (
        <Link key={ i } to={ link.url || '/' }>{ link.title || 'Fallback' }</Link>
      );
    } );

    return(
      <nav>
        { links }
      </nav>
    );
  }
}
