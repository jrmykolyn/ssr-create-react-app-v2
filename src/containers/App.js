import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from './Home';
import Single from './Single'
import Page from './Page';
import Archive from './Archive';
import NoMatch from '../components/NoMatch'
import { Footer, Header } from '../components'

export default class App extends Component {
  render(){
    return (
      <div>
        <Header></Header>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/category/:slug" component={Archive} />
          <Route path="/:category/:slug" component={Single} />
          <Route path="/:slug" component={Page} />
          <Route component={NoMatch}/>
        </Switch>
        <Footer></Footer>
      </div>
    )
  }
}
