import React, { Component } from 'react';
import withWeb3 from '../providers/withWeb3';
import withBountyBuster from '../providers/withBountyBuster';
import { compose } from 'recompose';
import { Map } from 'immutable';
import TextField from '@material-ui/core/TextField';
import Web3Utils from 'web3-utils';

import CustomButton from '../components/button/CustomButton';
import DashboardSection from '../components/dashboard/DashboardSection';
import DashboardTasksContainer from './DashboardTasksContainer';
import DashboardRequestsContainer from './DashboardRequestsContainer';
import Modal from '../components/modal/Modal';
import ModalForm from '../components/modal/ModalForm';
import Task from '../utils/Task';
import getTasks from '../utils/getTasks';
import getRequests from '../utils/getRequests';
import watchEvent from '../utils/watchEvent';
import './DashboardContainer.css';

class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: null,
      requests: null,

      addTaskModal: Map({ visible: false, title: '', reward: '', description: '' })
    }
  }

  componentWillMount() {
    let { bountyBuster, web3 } = this.props;
    let account = web3.eth.accounts[0];
    Promise.all([
      bountyBuster.balances.call(account),
      getTasks(bountyBuster, { poster: account }),
      getRequests(bountyBuster, { requester: account })
    ]).then(([balance, tasks, requests]) => {
      this.setState({ balance, tasks, requests });
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

  cashOut() {
    let { bountyBuster, web3 } = this.props;
    bountyBuster.cashOut({ from: web3.eth.accounts[0] })
      .then(() => {
        bountyBuster.balances.call(web3.eth.accounts[0]);
      })
      .then((balance) => {
        console.log('balance, ', balance.toNumber());
        this.setState({ balance });
      });
  }

  watchTaskAdded(error, event) {
    let { taskHash, poster } = event.args;
    let { tasks } = this.state;
    let { bountyBuster, web3 } = this.props;
    if (!tasks.get(taskHash) && poster === web3.eth.accounts[0]) {
      bountyBuster.tasks.call(taskHash).then((taskStruct) => {
        let task = new Task(taskHash, taskStruct);
        this.setState(({ tasks }) => ({
          tasks: tasks.update(taskHash, () => task)
        }));
      });
    }
  }

  handleAddTaskModalUpdate(property, value) {
    this.setState(({ addTaskModal }) => ({
      addTaskModal: addTaskModal.update(property, () => value)
    }));
  }

  onClickTask(taskHash) {
    this.props.history.push(`tasks/${taskHash}`);
  }

  onClickRequest(requestHash) {
    this.props.history.push(`requests/${requestHash}`);
  }

  render() {
    return (
      <div className='DashboardContainer'>
        <div className='AddTask' >
          <CustomButton variant='fab' onClick={this.handleAddTaskModalUpdate.bind(this, 'visible', true)} iconName='add' />
        </div>
        <DashboardSection title='My Bounty Buster Balance'>
          <div className='DashboardContainerBalance'>
            <p>Account: {this.props.web3.eth.accounts[0]}</p>
            <p>{this.state.balance ? Web3Utils.fromWei(this.state.balance.toString(), 'ether') + ' Eth' : 'Loading'}</p>
            {this.state.balance && this.state.balance > 0 ? <CustomButton value='Cash Out' onClick={() => this.cashOut()} /> : null}
          </div>
        </DashboardSection>
        <DashboardSection title='My Tasks'>
          <DashboardTasksContainer tasks={this.state.tasks} onClickTask={this.onClickTask.bind(this)} />
        </DashboardSection>
        <DashboardSection title='My Requests'>
          <DashboardRequestsContainer requests={this.state.requests} onClickRequest={this.onClickRequest.bind(this)} />
        </DashboardSection>
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
