import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Web3Utils from 'web3-utils';

import './TaskDataContainer.css';

const TaskDataContainer = ({ reward, poster, description }) => {
  return (
    <div className='TaskData'>
      <FormControl className='TaskReward' disabled={true}>
        <InputLabel>Reward (Eth)</InputLabel>
        <Input
          disableUnderline={true}
          value={Web3Utils.fromWei(reward, 'ether')}
          onChange={null} />
      </FormControl>
      <FormControl className='TaskPoster' disabled={true}>
        <InputLabel>Poster</InputLabel>
        <Input
          disableUnderline={true}
          value={poster}
          onChange={null} />
      </FormControl>
      <FormControl className='TaskDescription' disabled={true}>
        <InputLabel>Description</InputLabel>
        <Input
          disableUnderline={true}
          value={description}
          onChange={null} />
      </FormControl>
    </div>
  );
};

export default TaskDataContainer;
