// Vendor
import React, { Component } from 'react'

import './SearchResult.css'

export class SearchResult extends Component {
  render() {
    return(
      <article className="search-result">
        <h1>{ this.props.data.titleNoFormatting }</h1>
      </article>
    );
  }
}
