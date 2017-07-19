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
const wordpressApi = require( './wordpressApi' )
const {default: configureStore} = require('../src/store')
const {default: App} = require('../src/containers/App')

// --------------------------------------------------
// DECLARE FUNCTIONS
// --------------------------------------------------
function handleRequest( req, res, filePath ) {
  fs.readFile(filePath, 'utf8', (err, htmlData)=>{
    if (err) {
      console.error('read err', err)
      return res.status(404).end()
    }

    let wpActions = wordpressApi.fetchWpActions();

     Promise.all( [ wpActions ] )
      .then( ( data ) => {
        var [ actions ] = data;
        var { wp_head, wp_footer } = JSON.parse( actions );

        const context = {}
        const store = configureStore()
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

          res.send( RenderedApp )
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

  // Default response for *all* requests.
  handleRequest( req, res, filePath );
}
