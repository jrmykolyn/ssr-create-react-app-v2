// Vendor
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class PostPreviewHeader extends Component {
  render() {
    return(
      <div className={ `${this.props.selector}__header` }>
        <h2>
         <Link to={`/category/${this.props.categorySlug}`} dangerouslySetInnerHTML={ { __html: this.props.categoryName } }></Link>
        </h2>
        <h1>
          <Link to={ `/${this.props.categorySlug}/${this.props.postSlug}`}>{ this.props.postTitle }</Link>
        </h1>
      </div>
    );
  }
}
