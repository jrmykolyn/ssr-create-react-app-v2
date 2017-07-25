// Vendor
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './Menu.css'

const API_CONFIG = require( '../../config/api' ); /// TEMP
const { WORDPRESS_API_CONFIG } = API_CONFIG; /// TEMP

function parseWpLink( link ) {
  let data = {
    isExternal: ( link.object === 'custom' ),
    parsedUrl: parseWpLinkUrl( link.url || '' ),
  }

  return { ...link, ...data };
}

function parseWpLinkUrl( url ) {
  url = ( url && typeof url === 'string' ) ? url : '';

  if ( !url ) {
    return '/';
  }

  // Remove WordPress portion of URL.
  let pattern = new RegExp( `https?://${WORDPRESS_API_CONFIG.hostname}/${WORDPRESS_API_CONFIG.path}`, 'gmi' );
  let parsedUrl = url.replace( pattern, '' );

  // Determine 'type' of request (eg. `page`, `post`, etc.).
  /// TODO

  return ( parsedUrl.substring( 0, 1 ) === '/' ) ? parsedUrl : `/${parsedUrl}`;
}

export class Menu extends Component {
  render() {
    let links = this.props.data.map( ( link, i ) => {
      let linkData = parseWpLink( link );

      if ( linkData.isExternal ) {
        return (
          <a key={ i } href={ linkData.url }>{ link.title || '' }</a>
        );
      } else {
        return (
          <Link key={ i } to={ linkData.parsedUrl || '/' }>{ link.title || '' }</Link>
        );
      }
    } );

    return(
      <nav className={ this.props.menuType || 'primary' }>
        { links }
      </nav>
    );
  }
}
