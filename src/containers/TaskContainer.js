import React, { Component } from 'react';
import { compose } from 'recompose';
import { Map } from 'immutable';
import TextField from '@material-ui/core/TextField';

import Modal from '../components/modal/Modal';
import ModalForm from '../components/modal/ModalForm';
import CustomButton from '../components/button/CustomButton';
import TaskDataContainer from '../containers/TaskDataContainer';
import './TaskContainer.css';

import Task from '../utils/Task';
import withBountyBuster from '../providers/withBountyBuster';
import withWeb3 from '../providers/withWeb3';

class TaskContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { task: null, applyForTaskModal: Map({ visible: false, message: '' }) };
  }
  componentWillMount() {
    let { bountyBuster, match } = this.props;
    let { taskHash } = match.params;
    bountyBuster.tasks.call(taskHash)
      .then((taskStruct) => {
        let task = new Task(taskHash, taskStruct);
        this.setState({ task: Map(task) });
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
    let taskHash = task.get('hash');
    let message = applyForTaskModal.get('message');
    bountyBuster.submitRequest(taskHash, message, { from: account })
      .then(() => {
        this.handleApplyForTaskModalUpdate('visible', false);
      });
  }

  render() {
    let { task, applyForTaskModal } = this.state;
    let { account } = this.props;
    return (
      <div>
        {task ?
          <div className='TaskContainer'>
            <div className='TaskTitle'>
              <p>{task.get('title')}</p>
              {account !== task.get('poster') ?
                <CustomButton value='Apply' onClick={this.handleApplyForTaskModalUpdate.bind(this, 'visible', true)}>
                </CustomButton> :
              null}
            </div>
            <TaskDataContainer
              reward={task.get('reward')}
              poster={task.get('poster')}
              description={task.get('description')} />
          </div> :
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
