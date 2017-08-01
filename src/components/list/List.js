import React, { Component } from 'react';

// Components
import { ListItem } from './ListItem';

import './List.css';

export class List extends Component {
  render() {
    let data = this.props.data || [ 1,2,3,4,5 ];
    let output = data.map( ( post, i ) => {
      return (
        <ListItem key={ i } />
      );
    } );

    return (
      <section className="list">
        <header className="list__header">
          <h2>Trending</h2>
        </header>
        <div className="list__body">
          { output }
        </div>
      </section>
    );
  }
}
