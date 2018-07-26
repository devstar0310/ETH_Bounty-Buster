import React, { Component } from 'react';
import { compose } from 'recompose';

import withWeb3 from '../providers/withWeb3';
import withBountyBuster from '../providers/withBountyBuster';
import getEvents from '../utils/getEvents';

class TasksContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { tasks: null };
  }

  componentWillMount() {
    let { bountyBuster } = this.props;
    getEvents(bountyBuster, 'TaskAdded')
      .then((events) => {
        debugger;
        return bountyBuster.tasks.call(events[0].args.taskHash)
      })
      .then((task) => {
      })
  }

  onAddTask() {
    let { bountyBuster, web3 } = this.props;
    let taskReward = 100, taskDescription = 'A New Task Description', from = web3.eth.accounts[0];
    bountyBuster.addTask(taskReward, taskDescription, { from })
      .then(() => {
        debugger;
      });
  }

  render() {
    return (
      <button onClick={() => this.onAddTask()}>Add Task</button>
    );
  }
}

export default compose(withWeb3, withBountyBuster)(TasksContainer);
