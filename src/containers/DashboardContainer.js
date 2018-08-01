import React, { Component } from 'react';
import withWeb3 from '../providers/withWeb3';
import withBountyBuster from '../providers/withBountyBuster';
import { compose } from 'recompose';

import getTasks from '../utils/getTasks';
import PostedTasksContainer from './PostedTasksContainer';
import './DashboardContainer.css';

class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { postedTasks: null, postedTaskEvents: null }
  }
  componentWillMount() {
    let { bountyBuster, account } = this.props;
    getTasks(bountyBuster, { poster: account })
      .then((postedTasks) => {
        this.setState({ postedTasks });
      });
  }
  render() {
    return (
      <div className='DashboardContainer'>
        <PostedTasksContainer postedTasks={this.state.postedTasks} />
      </div>
    );
  }
}

export default compose(withWeb3, withBountyBuster)(DashboardContainer);
