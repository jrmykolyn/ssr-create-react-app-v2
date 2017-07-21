// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
// Node
const path = require('path')
const fs = require('fs')

// Vendor
const Promise = require( 'bluebird' )
const React = require('react')
const {Provider} = require('react-redux')
const {renderToString} = require('react-dom/server')
const {StaticRouter} = require('react-router-dom')

// Project
const wordpressApi = require( '../src/wordpressApi' );
const {default: configureStore} = require('../src/store')
const {default: App} = require('../src/containers/App')

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function handleAssetRequest( req, res, filePath ) {
  /// TEMP - End request immediately/without response data.
  /// TODO[@jrmykolyn] - Update function to *actually* handle request for asset.
  res.end();
}

function handlePageRequest( req, res, filePath ) {
  fs.readFile( filePath, 'utf8', ( err, htmlData ) => {
    if (err) {
      console.error('read err', err)
      return res.status(404).end()
    }

    // Get `wp_head` and `wp_footer` content via `fetchWpActions()`.
    let wpActions = wordpressApi.fetchWpActions();

    // Get page-specific content.
    let wpContent = wordpressApi.fetchContent( req.url );

     Promise.all( [ wpActions, wpContent ] )
      .then( ( data ) => {
        // Extract data from responses.
        let [ actions, content ] = data;
        let { wp_head, wp_footer } = JSON.parse( actions.payload );
        let initialState = {};

        // Attempt to update `initialState` using `content`.
        try {
          let { requestType, payload } = content;

          payload = JSON.parse( payload );

          initialState = { [ requestType ]: payload };
        } catch ( err ) {
          /// TEMP - If unable to parse 'content payload', end request with generic error message
          /// TODO[@jrmykolyn] - Figure out alternative method of handling case.
          res.end( 'Whoops! Something went wrong!' ); /// TEMP
        }

        const context = {}
        const store = configureStore( initialState );
        const markup = renderToString(
          <Provider store={store}>
            <StaticRouter
              location={req.url}
              context={context}
            >
              <App/>
            </StaticRouter>
          </Provider>
        )

        if (context.url) {
          // Somewhere a `<Redirect>` was rendered
          redirect( 301, context.url )
        } else {
          // we're good, send the response

          // Replace `{{SSR}}` placeholder with rendered version of React app.
          var RenderedApp = htmlData.replace( '{{SSR}}', markup );

          // Replace `{{WP_HEAD}}` and {{WP_FOOTER}}` placeholders with markup fetched from WordPress endpoint.
          // If variables are false-y, insert empty strings to prevent the placeholder values from being displayed.
          RenderedApp = RenderedApp.replace( '{{WP_HEAD}}', wp_head || '' );
          RenderedApp = RenderedApp.replace( '{{WP_FOOTER}}', wp_footer || '' );

          // Replace `__INITIAL_STATE__` placeholder with contents of `initialState`.
          // Bind data to new window var. (eg. add to global scope).
          // This allows the client-side application to bootstrap in the correct state.
          // Without this, the application would either display the default/placeholder data, or make an additional network request.
          RenderedApp = RenderedApp.replace( '__INITIAL_STATE__', `window.__INITIAL_STATE__ = ${JSON.stringify( initialState )};` || '' );

          res.send( RenderedApp );
        }
      } )
      .catch( ( err ) => {

      } );
  })
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = function universalLoader(req, res) {
  const filePath = path.resolve(__dirname, '..', 'build', 'index.html');

  // Handle the following request types:
  // - 'asset'
  // - 'page'
  switch ( req.url.indexOf( '.' ) !== -1 ) {
    case true:
      handleAssetRequest( req, res, filePath );
      break;
    default:
      handlePageRequest( req, res, filePath );
  }
}
