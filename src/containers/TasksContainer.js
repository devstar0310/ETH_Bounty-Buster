import React, { Component } from 'react';
import { compose } from 'recompose';
import TextField from '@material-ui/core/TextField';

import withWeb3 from '../providers/withWeb3';
import withBountyBuster from '../providers/withBountyBuster';
import Modal from '../components/modal/Modal';
import CustomButton from '../components/button/CustomButton';
import getEvents from '../utils/getEvents';
import './TaskContainer.css';

class TasksContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: null,
      isAddTaskModalVisible: false,
      addTaskTitle: '',
      addTaskReward: '',
      addTaskDescription: ''
    };
  }

  componentWillMount() {
    let { bountyBuster } = this.props;
    // getEvents(bountyBuster, 'TaskAdded')
    //   .then((events) => {
    //     return bountyBuster.tasks.call(events[0].args.taskHash)
    //   })
    //   .then((task) => {
    //   })
  }

  addTask() {
    let { bountyBuster, web3 } = this.props;
    let { addTaskTitle, addTaskReward, addTaskDescription } = this.state;
    bountyBuster.addTask(addTaskReward, addTaskDescription, { from: web3.eth.accounts[0] })
      .then(() => {
        debugger;
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
        <table className='TaskTable'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Reward</th>
              <th>Poster</th>
            </tr>
          </thead>
        </table>
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
