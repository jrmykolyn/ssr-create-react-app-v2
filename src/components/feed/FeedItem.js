import React, { Component } from 'react';

import { Link } from 'react-router-dom'

// Styles
import './FeedItem.css';

export class FeedItem extends Component {
  render() {
    let thumbnail = this.props.thumbnail || '<img src="http://via.placeholder.com/300x200" alt="#" />';
    let categoryName = this.props.category.name || 'Category';
    let categorySlug = this.props.category.slug || 'category';
    let title = this.props.title || 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.';
    let slug = this.props.slug || 'lorem-ipsum';

    return (
      <article className="feed-item">
        <header className="feed-item__header" dangerouslySetInnerHTML={ { __html: thumbnail } }>
        </header>
        <div className="feed-item__body">
          <h2 className="feed-item-text--category">
            <Link to={`/category/${categorySlug}`} dangerouslySetInnerHTML={ { __html: categoryName } } />
          </h2>
          <h1 className="feed-item-text--title">
            <Link to={`/${categorySlug}/${slug}`} dangerouslySetInnerHTML={ { __html: title } } />
          </h1>
        </div>
      </article>
    );
  }
}
