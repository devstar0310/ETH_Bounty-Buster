import React, { Component } from 'react';
import { compose } from 'recompose';
import TextField from '@material-ui/core/TextField';
import { Map } from 'immutable';

import withWeb3 from '../providers/withWeb3';
import withBountyBuster from '../providers/withBountyBuster';
import TasksTableContainer from './TasksTableContainer';
import Modal from '../components/modal/Modal';
import CustomButton from '../components/button/CustomButton';
import getEvents from '../utils/getEvents';
import Task from '../utils/Task';
import './TasksContainer.css';

class TasksContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: null,
      taskAddedEvents: null,

      addTaskModal: Map({ visible: false, title: '', reward: '', description: '' }),
      selectedTaskHash: null
    };
  }

  componentWillMount() {
    let { bountyBuster } = this.props;
    getEvents(bountyBuster, 'TaskAdded')
      .then((taskAddedEvents) => {
        this.setState({ taskAddedEvents });
        let getTasks = taskAddedEvents.map((taskAddedEvent) => {
          let { taskHash } = taskAddedEvent.args;
          return bountyBuster.tasks.call(taskHash);
        });
        return Promise.all(getTasks);
      })
      .then((taskStructs) => {
        let tasksMap = {};
        taskStructs.forEach((taskStruct, index) => {
          let task = new Task(this.state.taskAddedEvents[index].args.taskHash, taskStruct);
          tasksMap[task.hash] = task;
        });
        this.setState({ tasks: Map(tasksMap) });
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

  addTask() {
    let { bountyBuster, web3 } = this.props;
    let { addTaskModal } = this.state;
    let title = addTaskModal.get('title');
    let reward = addTaskModal.get('reward');
    let description = addTaskModal.get('description');
    bountyBuster.addTask(title, description, { from: web3.eth.accounts[0], value: web3.toWei(reward, 'ether') })
      .then(() => {
        this.handleAddTaskModalUpdate('visible', false);
        this.handleAddTaskModalUpdate('title', '');
        this.handleAddTaskModalUpdate('reward', '');
        this.handleAddTaskModalUpdate('description', '');
      });
  }

  redirectToTask(taskHash) {
    this.props.history.push(`${this.props.match.path}/${taskHash}`);
  }

  handleAddTaskModalUpdate(property, value) {
    this.setState(({ addTaskModal }) => ({
      addTaskModal: addTaskModal.update(property, () => value)
    }));
  }

  render() {
    return (
      <div className='TasksContainer'>
        <div className='AddTask' >
          <CustomButton onClick={this.handleAddTaskModalUpdate.bind(this, 'visible', true)} iconName='add' />
        </div>
        <div className='TaskTable'>
          <TasksTableContainer tasks={this.state.tasks} onClickTask={this.redirectToTask.bind(this)} />
        </div>
        {this.state.addTaskModal.get('visible') ?
          <Modal onClose={this.handleAddTaskModalUpdate.bind(this, 'visible', false)}>
            <form className='AddTaskModalForm'>
              <TextField
                label='Title'
                required={true}
                value={this.state.addTaskTitle}
                onChange={(e) => this.handleAddTaskModalUpdate('title', e.target.value)} />
              <TextField
                label='Reward'
                required={true}
                value={this.state.addTaskReward}
                onChange={(e) => this.handleAddTaskModalUpdate('reward', e.target.value)} />
              <TextField
                label='Desciption'
                multiline={true}
                rows={5}
                required={true}
                value={this.state.addTaskDescription}
                onChange={(e) => this.handleAddTaskModalUpdate('description', e.target.value)} />
              <CustomButton value='Create' onClick={() => this.addTask()} />
            </form>
          </Modal> : null}
      </div>
    );
  }
}

export default compose(withWeb3, withBountyBuster)(TasksContainer);
