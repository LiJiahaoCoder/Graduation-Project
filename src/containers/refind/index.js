import React, { Component } from 'react';
// route
import {
  Switch,
  Route
} from 'react-router-dom';
// import refind.n components
import Refind1 from './refind.1';
import Refind2 from './refind.2';
import Refind3 from './refind.3';

class Refind extends Component {
  render() {
    return (
      <>
        <Switch>
          <Route exact path='/refind' component={Refind1} />
          <Route path='/refind/step2' component={Refind2} />
          <Route path='/refind/step3' component={Refind3} />
        </Switch>
      </>
    );
  }
}

export default Refind;