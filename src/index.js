// vendor
import React from 'react';
import ReactDOM from 'react-dom';
import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
// router
import {
  Route,
  Redirect,
  Switch,
  BrowserRouter
} from 'react-router-dom';
// import global scss file
import './index.scss';
// reducers
import reducers from './reducer';
// import containers
import Register from './containers/register';
import Login from './containers/login'
// import components


// import * as serviceWorker from './serviceWorker';

const reduxDevtools = window.devToolsExtension ? window.devToolsExtension() : ()=>{};

const store = createStore(reducers, compose(
    applyMiddleware(thunk),
    reduxDevtools
  )
);

ReactDOM.render(
  (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path='/register' component={Register} />
          <Login path='/login' component={Login} />
        </Switch>
      </BrowserRouter>
    </Provider>
  ),
  document.getElementById('root')
);

// serviceWorker.unregister();