import React, { Component } from 'react';
import Provider, { Context } from './providers/Provider';
import Map from './components/Map';
import './App.css';

export default class App extends Component {
  render() {
    return (
      // any child of this provider (can be as far down the chain as you want)
      // will be able to access the data / state from the provider
      // the consumer is how the data can be accessed
      <Provider>
        <div className="app">
          <Context.Consumer>
            {context => (
              // uses react fragment shortcut syntax
              <>
                <Map {...context} />
              </>
            )}
          </Context.Consumer>
        </div>
      </Provider>
    );
  }
}
