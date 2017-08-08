import React, { Component } from 'react';

import './SingleHero.css';

export class SingleHero extends Component {
  render() {
    let post = this.props.post || {};

    if ( !post.thumbnail ) {
      return '';
    } else {
      return (
        <section className="single-hero" dangerouslySetInnerHTML={ { __html: post.thumbnail } }></section>
      );
    }
  }

  componentDidMount() {
    console.log( 'INSIDE `SingleHero#componentDidMount()`' ); /// TEMP
  }
}
