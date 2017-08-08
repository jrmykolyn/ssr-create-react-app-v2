// Vendor
import React, { Component } from 'react'

// Components
import { Loader } from '../';

import './Socials.css'

export class Socials extends Component {
  render() {
    let data = ( this.props.data || [] );
    let output;

    // ...
    if ( !Array.isArray( data ) || !data.length ) {
      output = <Loader />
    } else {
      output = data.map( ( item, i ) => {
        return (
          <a key={ i } href={ item.url } target={ item.target || '_blank' }>
            <img src={ item.img } alt={ item.alt } />
          </a>
        );
      } );
    }

    return(
      <div className="post-socials-wrap">
        { output }
      </div>
    );
  }
}
