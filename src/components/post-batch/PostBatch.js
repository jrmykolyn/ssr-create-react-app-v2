import React, { Component } from 'react';

// Components
import { PostPreview } from '../';

import './PostBatch.css';

export class PostBatch extends Component {
  render() {
    let postData = this.props.data || [];
    let postMarkup = postData.map( ( post, i ) => {
        if ( i === 0 && i === 0 ) {
          return <PostPreview key={ i } data={ post } modifier="hero" />
        } else if ( i === 0 ) {
          // FIXME
          return <PostPreview key={ i } data={ post } modifier="large" />
        } else if ( i === 1 || i === 2 ) {
          return <PostPreview key={ i } data={ post } modifier="supporting" />
        } else {
          return <PostPreview key={ i } data={ post } />
        }
      } );

    // ...
    return (
      <section className="post-batch">
        <div className="post-batch__posts">
          { postMarkup }
        </div>
        <div className="post-batch__ads">
          <div className="simlm_bucket"></div>
        </div>
      </section>
    );
  }
}
