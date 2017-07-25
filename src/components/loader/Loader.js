import React, { Component } from 'react';

import './Loader.css';

export class Loader extends Component {
  render() {
    return (
      <div className="loader">
        <span></span>
        <span></span>
        <span></span>
      </div>
    );
  }
}
