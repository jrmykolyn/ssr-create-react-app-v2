import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import configureStore from './store'
import './index.css'
import App from './containers/App'
import registerServiceWorker from './registerServiceWorker'

// Let the reducers handle initial state
let initialState = {}

// Set `initialState` equal to data provided by server if possible.
try {
  initialState = window.__INITIAL_STATE__;
} catch ( err ) {
  /// TODO[@jrmykolyn] - Consider logging error.
}

const store = configureStore(initialState)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
, document.getElementById('root')
)
registerServiceWorker()
