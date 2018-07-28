import React, { Component } from 'react';
import { compose } from 'recompose';
import TextField from '@material-ui/core/TextField';

import withWeb3 from '../providers/withWeb3';
import withBountyBuster from '../providers/withBountyBuster';
import TasksTableContainer from './TasksTableContainer';
import Modal from '../components/modal/Modal';
import CustomButton from '../components/button/CustomButton';
import getEvents from '../utils/getEvents';
import Task from '../utils/Task';
import './TaskContainer.css';

const PER_PAGE_TASKS = 10;

class TasksContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: null,
      taskAddedEvents: null,

      isAddTaskModalVisible: false,
      addTaskTitle: '',
      addTaskReward: '',
      addTaskDescription: ''
    };
  }

  componentWillMount() {
    let { bountyBuster, web3 } = this.props;
    getEvents(bountyBuster, 'TaskAdded')
      .then((taskAddedEvents) => {
        this.setState({ taskAddedEvents });
        let getTasks = taskAddedEvents.map((taskAddedEvent) => {
          return bountyBuster.tasks.call(taskAddedEvent.args.taskHash);
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
    let { addTaskTitle, addTaskReward, addTaskDescription } = this.state;
    addTaskReward = parseFloat(addTaskReward);
    bountyBuster.addTask(addTaskTitle, addTaskReward, addTaskDescription, { from: web3.eth.accounts[0] })
      .then(() => {
        this.setState({
          addTaskTitle: '',
          addTaskReward: '',
          addTaskDescription: ''
        });
        this.closeAddTaskModal();
      });
  }

  displayAddTaskModal() {
    this.setState({ isAddTaskModalVisible: true });
  }

  closeAddTaskModal() {
    this.setState({ isAddTaskModalVisible: false });
  }

  render() {
    return (
      <div className='TaskContainer'>
        <div className='AddTask' >
          <CustomButton onClick={this.displayAddTaskModal.bind(this)} iconName='add' />
        </div>
        <div className='TaskTable'>
          <TasksTableContainer tasks={this.state.tasks} />
        </div>
        {this.state.isAddTaskModalVisible ?
          <Modal onClose={this.closeAddTaskModal.bind(this)}>
            <form className='AddTaskModalForm'>
              <TextField
                label='Title'
                required={true}
                value={this.state.addTaskTitle}
                onChange={(e) => this.setState({ addTaskTitle: e.target.value })} />
              <TextField
                label='Reward'
                required={true}
                value={this.state.addTaskReward}
                onChange={(e) => this.setState({ addTaskReward: e.target.value })} />
              <TextField
                label='Desciption'
                multiline={true}
                rows={5}
                required={true}
                value={this.state.addTaskDescription}
                onChange={(e) => this.setState({ addTaskDescription: e.target.value })} />
              <CustomButton value='Create' onClick={() => this.addTask()} />
            </form>
          </Modal> : null}
      </div>
    );
  }
}

export default compose(withWeb3, withBountyBuster)(TasksContainer);
