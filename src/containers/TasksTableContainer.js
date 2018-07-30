import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Web3Utils from 'web3-utils';

import './TasksTableContainer.css';

const TasksTableContainer = ({ tasks, onClickTask }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Reward</TableCell>
          <TableCell>Poster</TableCell>
        </TableRow>
      </TableHead>
        {tasks ? tasks.toArray().map((task) => {
          return (
            <TableBody key={task.hash}>
              <TableRow className='TasksRow' hover={true} onClick={() => onClickTask(task.hash)}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{Web3Utils.fromWei(task.reward, 'ether')}</TableCell>
                <TableCell>{task.poster}</TableCell>
              </TableRow>
            </TableBody>
          );
        }) : null}
    </Table>
  );
};

export default TasksTableContainer;
