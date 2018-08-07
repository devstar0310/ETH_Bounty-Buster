import React, { Component } from 'react';
import { compose } from 'recompose';
import { Map } from 'immutable';
import TextField from '@material-ui/core/TextField';

import Modal from '../components/modal/Modal';
import ModalForm from '../components/modal/ModalForm';
import CustomButton from '../components/button/CustomButton';
import PageHeader from '../components/page-header/PageHeader';
import TaskDataContainer from '../containers/TaskDataContainer';
import DashboardRequestsContainer from '../containers/DashboardRequestsContainer';
import './TaskContainer.css';

import Task from '../utils/Task';
import getRequests from '../utils/getRequests';
import withBountyBuster from '../providers/withBountyBuster';
import withWeb3 from '../providers/withWeb3';

class TaskContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: null,
      requests: null,

      applyForTaskModal: Map({ visible: false, message: '' })
    };
  }
  componentWillMount() {
    let { bountyBuster, match, web3 } = this.props;
    let { taskHash } = match.params;
    bountyBuster.tasks.call(taskHash)
      .then((taskStruct) => {
        let task = new Task(taskHash, taskStruct);
        this.setState({ task });
        if (task.poster === web3.eth.accounts[0]) {
          return getRequests(bountyBuster, { taskHash: task.hash })
        }
      })
      .then((requests) => {
        if (requests && requests.size > 0) {
          this.setState({ requests });
        }
      });
  }

  handleApplyForTaskModalUpdate(property, value) {
    this.setState(({ applyForTaskModal }) => ({
      applyForTaskModal: applyForTaskModal.update(property, () => value)
    }));
  }

  submitTask() {
    let { task, applyForTaskModal } = this.state;
    let { account, bountyBuster } = this.props;
    let taskHash = task.hash;
    let message = applyForTaskModal.get('message');
    bountyBuster.submitRequest(taskHash, message, { from: account })
      .then(() => {
        this.handleApplyForTaskModalUpdate('visible', false);
      });
  }

  onClickRequest(requestHash) {
    this.props.history.push(`/requests/${requestHash}`);
  }

  render() {
    let { task, requests, applyForTaskModal } = this.state;
    let { web3 } = this.props;
    return (
      <div>
        {task ?
          <div className='TaskContainer'>
            <PageHeader title={task.title} right={
              web3.eth.accounts[0] !== task.poster ?
              <CustomButton value='Apply' onClick={this.handleApplyForTaskModalUpdate.bind(this, 'visible', true)} />
              : null}
              />
            <TaskDataContainer
              reward={task.reward}
              poster={task.poster}
              description={task.description} />
          </div> :
        null}
        {requests && requests.size > 0 ?
          <DashboardRequestsContainer requests={requests} onClickRequest={this.onClickRequest.bind(this)} /> :
        null}
        {applyForTaskModal.get('visible') ?
          <Modal onClose={this.handleApplyForTaskModalUpdate.bind(this, 'visible', false)}>
            <ModalForm>
              <TextField
                label='Message'
                required={true}
                value={applyForTaskModal.get('message')}
                onChange={(e) => this.handleApplyForTaskModalUpdate('message', e.target.value)} />
              <CustomButton value='Submit' onClick={() => this.submitTask()} />
            </ModalForm>
          </Modal> :
        null}
      </div>
    );
  }
}

export default compose(withBountyBuster, withWeb3)(TaskContainer);
