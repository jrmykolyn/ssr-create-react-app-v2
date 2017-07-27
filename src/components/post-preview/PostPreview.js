// Vendor
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// Utils
import { stringUtils } from '../../utils';

import './PostPreview.css'

export class PostPreview extends Component {
  render() {
    let category = this.props.data.post_categories[ 0 ] || {};
    let categorySlug = category.slug || 'Default'; /// FIXME[@jmykolyn] - Add real 'fallback' value.
    let categoryName = category.name || 'Default'; /// FIXME[@jmykolyn] - Add real 'fallback' value.
    let postSlug = this.props.data.post_name || '#'; /// FIXME[@jmykolyn] - Add real 'fallback' value.
    let postTitle = this.props.data.post_title || 'Default'; /// FIXME[@jmykolyn] - Add real 'fallback' value.
    let postImage = this.props.data.thumbnail || '#'; /// FIXME[@jmykolyn] - Add real 'fallback' value.

    return(
      <article className="post-preview">
        <div className="post-preview__hero" dangerouslySetInnerHTML={ { __html: postImage } }></div>
        <div className="post-preview__header">
          <h2>
            <Link to={`/category/${categorySlug}`} dangerouslySetInnerHTML={ { __html: categoryName } }></Link>
          </h2>
          <h1>
            <Link to={ `/${categorySlug}/${postSlug}`}>{ postTitle }</Link>
          </h1>
        </div>
        <div className="post-preview__body" dangerouslySetInnerHTML={ { __html: this.props.data.post_excerpt || '' } }>
        </div>
      </article>
    );
  }
}
