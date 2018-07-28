import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import './TasksTableContainer.css';

const TasksTableContainer = ({ tasks }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Reward</TableCell>
          <TableCell>Poster</TableCell>
        </TableRow>
      </TableHead>
        {tasks ? tasks.map((task) => {
          return (
            <TableBody key={task.hash}>
              <TableRow>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.reward}</TableCell>
                <TableCell>{task.poster}</TableCell>
              </TableRow>
            </TableBody>
          );
        }) : null}
    </Table>
  );
};

export default TasksTableContainer;
