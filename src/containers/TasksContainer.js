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
import './TaskContainer.css';

class TasksContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: null,
      taskAddedEvents: null,

      addTaskModal: Map({ visible: false, title: '', reward: '', description: '' })
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
        let tasks = taskStructs.map((taskStruct, index) =>
        new Task(this.state.taskAddedEvents[index].args.taskHash, taskStruct)
      );
      this.setState({ tasks });
    });
  }

  addTask() {
    let { bountyBuster, web3 } = this.props;
    let { addTaskModal } = this.state;
    let title = addTaskModal.get('title');
    let reward = parseFloat(addTaskModal.get('reward'));
    let description = addTaskModal.get('description');
    bountyBuster.addTask(title, reward, description, { from: web3.eth.accounts[0] })
      .then(() => {
        this.handleAddTaskModalUpdate('visible', false);
        this.handleAddTaskModalUpdate('title', '');
        this.handleAddTaskModalUpdate('reward', '');
        this.handleAddTaskModalUpdate('description', '');
      });
  }

  handleAddTaskModalUpdate(property, value) {
    this.setState(({ addTaskModal }) => ({
      addTaskModal: addTaskModal.update(property, () => value)
    }));
  }

  render() {
    return (
      <div className='TaskContainer'>
        <div className='AddTask' >
          <CustomButton onClick={this.handleAddTaskModalUpdate.bind(this, 'visible', true)} iconName='add' />
        </div>
        <div className='TaskTable'>
          <TasksTableContainer tasks={this.state.tasks} />
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
