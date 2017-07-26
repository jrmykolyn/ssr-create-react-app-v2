// Vendor
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

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
