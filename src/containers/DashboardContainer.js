import React, { Component } from 'react';
import withWeb3 from '../providers/withWeb3';
import withBountyBuster from '../providers/withBountyBuster';
import { compose } from 'recompose';
import { Map } from 'immutable';
import TextField from '@material-ui/core/TextField';

import CustomButton from '../components/button/CustomButton';
import DashboardTasksContainer from './DashboardTasksContainer';
import Modal from '../components/modal/Modal';
import ModalForm from '../components/modal/ModalForm';
import Task from '../utils/Task';
import getTasks from '../utils/getTasks';
import watchEvent from '../utils/watchEvent';
import './DashboardContainer.css';

class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myTasks: null,
      myTaskEvents: null,

      addTaskModal: Map({ visible: false, title: '', reward: '', description: '' })
    }
  }

  componentDidMount() {
    let { bountyBuster, account, web3 } = this.props;
    getTasks(bountyBuster, { poster: web3.eth.accounts[0] })
      .then((myTasks) => {
        this.setState({ myTasks });
        watchEvent(bountyBuster, 'TaskAdded', this.watchTaskAdded.bind(this));
      });
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

  watchTaskAdded(error, event) {
    let { taskHash } = event.args;
    let { myTasks } = this.state;
    let { bountyBuster } = this.props;
    if (!myTasks.get(taskHash)) {
      bountyBuster.tasks.call(taskHash).then((taskStruct) => {
        let task = new Task(taskHash, taskStruct);
        this.setState(({ myTasks }) => ({
          myTasks: myTasks.update(taskHash, () => task)
        }));
      });
    }
  }

  handleAddTaskModalUpdate(property, value) {
    this.setState(({ addTaskModal }) => ({
      addTaskModal: addTaskModal.update(property, () => value)
    }));
  }

  render() {
    return (
      <div className='DashboardContainer'>
        <div className='AddTask' >
          <CustomButton variant='fab' onClick={this.handleAddTaskModalUpdate.bind(this, 'visible', true)} iconName='add' />
        </div>
        <p>My Tasks</p>
        <DashboardTasksContainer tasks={this.state.myTasks} />
        <p>My Requests</p>
        <DashboardTasksContainer tasks={null} />
        {this.state.addTaskModal.get('visible') ?
          <Modal onClose={this.handleAddTaskModalUpdate.bind(this, 'visible', false)}>
            <ModalForm>
              <TextField
                label='Title'
                required={true}
                value={this.state.addTaskModal.get('title')}
                onChange={(e) => this.handleAddTaskModalUpdate('title', e.target.value)} />
              <TextField
                label='Reward'
                required={true}
                value={this.state.addTaskModal.get('reward')}
                onChange={(e) => this.handleAddTaskModalUpdate('reward', e.target.value)} />
              <TextField
                label='Desciption'
                multiline={true}
                rows={5}
                required={true}
                value={this.state.addTaskModal.get('description')}
                onChange={(e) => this.handleAddTaskModalUpdate('description', e.target.value)} />
              <CustomButton value='Create' onClick={() => this.addTask()} />
            </ModalForm>
          </Modal> : null}
      </div>
    );
  }
}

export default compose(withWeb3, withBountyBuster)(DashboardContainer);
