import React, { Component } from 'react';
import { compose } from 'recompose';
import { Map } from 'immutable';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Web3Utils from 'web3-utils';

import Task from '../utils/Task';
import withBountyBuster from '../providers/withBountyBuster';
import withWeb3 from '../providers/withWeb3';
import CustomButton from '../components/button/CustomButton';
import './TaskContainer.css';

class TaskContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { task: null }
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

  render() {
    let { task } = this.state;
    let { account } = this.props;
    return (
      <div>
        {this.state.task ?
          <div className='TaskContainer'>
            <div className='TaskTitle'>
              <p>{task.get('title')}</p>
            </div>
            <div className='TaskData'>
              <FormControl className='TaskReward' disabled={true}>
                <InputLabel>Reward (Eth)</InputLabel>
                <Input
                  disableUnderline={true}
                  value={Web3Utils.fromWei(task.get('reward'), 'ether')}
                  onChange={null} />
              </FormControl>
              <FormControl className='TaskPoster' disabled={true}>
                <InputLabel>Poster</InputLabel>
                <Input
                  disableUnderline={true}
                  value={task.get('poster')}
                  onChange={null} />
              </FormControl>
              <FormControl className='TaskDescription' disabled={true}>
                <InputLabel>Description</InputLabel>
                <Input
                  disableUnderline={true}
                  value={task.get('description')}
                  onChange={null} />
              </FormControl>
            </div>
            {account !== task.get('poster') ?
              <div className='OpenTaskButton'>
                <CustomButton value='Open' onClick={() => console.log('suh')} />
              </div> : null}
          </div> :
        null}
      </div>
    );
  }
}

export default compose(withBountyBuster, withWeb3)(TaskContainer);
