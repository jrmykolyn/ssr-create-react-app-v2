import React, { Component } from 'react';

// Components
import { Loader, FeedItem } from '../';

// Styles
import './Feed.css';

export class Feed extends Component {
  render() {
    let data = this.props.data || [];
    let output = '';

    console.log( 'LOGGING OUT `this.props.data`' ); /// TEMP
    console.log( this.props.data ); /// TEMP

    if ( !Array.isArray( this.props.data ) || !this.props.data.length ) {
      output = <Loader />
    } else {
      output = data.map( ( post, i ) => { return <FeedItem key={ i } thumbnail={ post.thumbnail } category={ post.post_categories[ 0 ] } title={ post.post_title } slug={ post.post_name }/> } );
    }

    return (
      <section className="feed-wrapper">
        <header className="feed-wrapper__header">
          <h2>Recent</h2>
        </header>
        <div className="feed-wrapper__body">
          { output }
        </div>
      </section>
    );
  }
}
