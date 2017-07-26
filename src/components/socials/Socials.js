// Vendor
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './Socials.css'

export class Socials extends Component {
  render() {
    let myCoolMessage = 'Test 123';

    let data = ( this.props.data || [] );

    let output = data.map( ( item, i ) => {
      return (
        <a key={ i } href={ item.url } target={ item.target || '_blank' }>
          <img src={ item.img } alt={ item.alt } />
        </a>
      );
    } );

    return(
      <div className="post-socials-wrap">
        { output }
      </div>
    );
  }
}
