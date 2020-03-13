import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Pane from './components/PaneComponent';

class App extends Component {
  render() {
    return (
    <Router>
        <div>
          <h2>Note Taking App</h2>
          <Switch>
              <Route exact path='/' component={Pane} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;