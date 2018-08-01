import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import HeaderContainer from './containers/HeaderContainer';
import SideBarContainer from './containers/SideBarContainer';
import HomeContainer from './containers/HomeContainer';
import DashboardContainer from './containers/DashboardContainer';
import TasksContainer from './containers/TasksContainer';
import TaskContainer from './containers/TaskContainer';
import Web3Provider from './providers/Web3Provider';
import BountyBusterProvider from './providers/BountyBusterProvider';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <Web3Provider>
        <BountyBusterProvider>
          <div>
            <HeaderContainer />
            <Router>
              <div>
                <SideBarContainer />
                <div className='App'>
                  <Route exact path='/' component={HomeContainer} />
                  <Route exact path='/dashboard' component={DashboardContainer} />
                  <Route exact path='/tasks' component={TasksContainer} />
                  <Route path='/tasks/:taskHash' component={TaskContainer} />
                </div>
              </div>
            </Router>
          </div>
        </BountyBusterProvider>
      </Web3Provider>
    );
  }
}


export default App;
