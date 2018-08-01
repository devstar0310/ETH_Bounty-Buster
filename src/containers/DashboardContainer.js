import React, { Component } from 'react';
import withWeb3 from '../providers/withWeb3';
import withBountyBuster from '../providers/withBountyBuster';
import { compose } from 'recompose';
import { Map } from 'immutable';
import TextField from '@material-ui/core/TextField';

import CustomButton from '../components/button/CustomButton';
import DashboardTasksContainer from './DashboardTasksContainer';
import Modal from '../components/modal/Modal';
import getTasks from '../utils/getTasks';
import './DashboardContainer.css';

class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postedTasks: null,
      postedTaskEvents: null,

      addTaskModal: Map({ visible: false, title: '', reward: '', description: '' })
    }
  }

  componentWillMount() {
    let { bountyBuster, account } = this.props;
    getTasks(bountyBuster, { poster: account })
      .then((postedTasks) => {
        this.setState({ postedTasks });
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
        <p>My Posted Tasks</p>
        <DashboardTasksContainer tasks={this.state.postedTasks} />
        <p>Tasks for Submission</p>
        <DashboardTasksContainer tasks={null} />
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

export default compose(withWeb3, withBountyBuster)(DashboardContainer);
