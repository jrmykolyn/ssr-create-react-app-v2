import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { SearchResult, Loader } from '../components';

import * as searchActions from '../actions/search'

import * as gcsApi from '../googleCustomSearchApi';

// Utils
import { routeUtils } from '../utils';

import './Search.css'

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
/**
 * ...
 */
function getQuery( componentRef ) {
  // Extract `queryString` from `props`.
  let queryString = componentRef.props.location.search;

  // ...
  let queryObj = routeUtils.parseQueryString( queryString );

  // ...
  let { q } = queryObj;

  return q;
}

/**
 * ...
 */
function extractSearchResults( componentRef ) {
  let query = getQuery( componentRef );
  let resultsArr = componentRef.props.search[ query ] || [];

  return resultsArr;
}

// --------------------------------------------------
// DEFINE CLASS
// --------------------------------------------------
class Search extends Component {
  render() {
    let resultsArr = extractSearchResults( this );
    let resultsPosts = resultsArr.map( ( result, i ) => {
      return (
        <SearchResult key={ i } data={ result } />
      );
    } );

    let output = ( Array.isArray( resultsPosts ) && resultsPosts.length ) ? resultsPosts : <Loader />

    return (
      <main>
        <h1>{ output }</h1>
      </main>
    );
  }

  componentWillMount() {
    /// TODO[@jmykolyn] - Update to only fetch if: in client; search results not present in `__INITIAL_STATE__`.
    let query = getQuery( this );

    gcsApi.search( query )
      .then( ( response ) => {
        return JSON.parse( response.payload );
      } )
      .then( ( payload ) => {
        this.props.searchActions.update( payload.results, query );
      } )
      .catch( ( err ) => {
        console.log( err ); /// TEMP
        /// TODO
      } );

  }
}

const mapStateToProps = ( state ) => ( {
  search: state.search
} );

const mapDispatchToProps = ( dispatch ) => ( {
  searchActions: bindActionCreators( searchActions, dispatch )
} );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Search )
