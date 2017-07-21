// Vendor
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './PostPreview.css'

export class PostPreview extends Component {
  render() {
    let categorySlug = this.props.data.post_categories[ 0 ] || 'Default';
    let postSlug = this.props.data.post_name || '#';
    let postTitle = this.props.data.post_title || 'Default';

    return(
      <article className="post-preview">
        <div className="post-preview-header">
          <h2>
            <Link to={`/category/${categorySlug}`}>{ categorySlug }</Link>
          </h2>
          <h1>
            <Link to={ `/${categorySlug}/${postSlug}`}>{ postTitle }</Link>
          </h1>
        </div>
        <div className="post-preview-body" dangerouslySetInnerHTML={ { __html: this.props.data.post_content || '' } }>
        </div>
      </article>
    );
  }
}
