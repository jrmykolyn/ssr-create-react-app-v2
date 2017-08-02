// Vendor
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// Components
import { PostPreviewHero } from './PostPreviewHero';
import { PostPreviewHeader } from './PostPreviewHeader';
import { PostPreviewBody } from './PostPreviewBody';

// Utils
import { stringUtils } from '../../utils';

import './PostPreview.css'

export class PostPreview extends Component {
  render() {
    let modifier = this.props.modifier || '';
    let classNameBase = 'post-preview';
    let className = ( modifier ) ? `${classNameBase}--${modifier}` : classNameBase;
    let category = this.props.data.post_categories[ 0 ] || {};
    let categorySlug = category.slug || 'Default'; /// FIXME[@jmykolyn] - Add real 'fallback' value.
    let categoryName = category.name || 'Default'; /// FIXME[@jmykolyn] - Add real 'fallback' value.
    let postSlug = this.props.data.post_name || '#'; /// FIXME[@jmykolyn] - Add real 'fallback' value.
    let postTitle = this.props.data.post_title || 'Default'; /// FIXME[@jmykolyn] - Add real 'fallback' value.
    let postImage = this.props.data.thumbnail || '#'; /// FIXME[@jmykolyn] - Add real 'fallback' value.
    let postExcerpt = this.props.data.post_excerpt || '';

    return(
      <article className={ className }>
        { this.props.children }
        <PostPreviewHero selector={ className } image={ postImage } />
        <PostPreviewHeader selector={ className } categoryName={ categoryName } categorySlug={ categorySlug } postTitle={ postTitle } postSlug={ postSlug } />
        <PostPreviewBody selector={ className } postExcerpt={ postExcerpt } />
      </article>
    );
  }
}
