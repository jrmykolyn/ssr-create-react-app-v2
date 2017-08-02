// Vendor
import React, { Component } from 'react'

export class PostPreviewHero extends Component {
  render() {
    return(
      <div className={ `${this.props.selector}__hero` } dangerouslySetInnerHTML={ { __html: this.props.image } }></div>
    );
  }
}
