// Vendor
import React, { Component } from 'react'

export class PostPreviewBody extends Component {
  render() {
    return(
      <div className={ `${this.props.selector}__body` } dangerouslySetInnerHTML={ { __html: this.props.postExcerpt || '' } }></div>
    );
  }
}
