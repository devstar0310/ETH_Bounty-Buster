import React, { Component } from 'react';
import { compose } from 'recompose';

import withWeb3 from '../providers/withWeb3';
import withBountyBuster from '../providers/withBountyBuster';
import TasksTableContainer from './TasksTableContainer';
import getTasks from '../utils/getTasks';
import Task from '../utils/Task';
import './TasksContainer.css';

class TasksContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: null,
      taskAddedEvents: null
    };
  }

  componentWillMount() {
    let { bountyBuster } = this.props;
    getTasks(bountyBuster)
      .then((tasks) => {
        this.setState({ tasks });
        bountyBuster.TaskAdded().watch(this.addTaskWatch.bind(this));
      });
  }

  addTaskWatch(error, taskAddedEvent) {
    let { bountyBuster } = this.props;
    let { tasks } = this.state;
    let { taskHash } = taskAddedEvent.args;
    if (!tasks.get(taskHash)) {
      bountyBuster.tasks.call(taskHash).then((taskStruct) => {
        let task = new Task(taskHash, taskStruct);
        this.setState(({ tasks }) => ({
          tasks: tasks.update(taskHash, () => task)
        }));
      });
    }
  }

  redirectToTask(taskHash) {
    this.props.history.push(`${this.props.match.path}/${taskHash}`);
  }

  render() {
    return (
      <div className='TasksContainer'>
        <div className='TaskTable'>
          <TasksTableContainer tasks={this.state.tasks} onClickTask={this.redirectToTask.bind(this)} />
        </div>
      </div>
    );
  }
}

export default compose(withWeb3, withBountyBuster)(TasksContainer);
