import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Web3Utils from 'web3-utils';

import PaperSection from '../components/paper-section/PaperSection';
import './PostedTasksContainer.css';

const PostedTasksContainer = ({ postedTasks }) => {
  return (
    <PaperSection>
      {postedTasks ? <Table>
        <TableBody>
          {postedTasks.toArray().map((postedTask) => {
            return (
              <TableRow key={postedTask.hash} hover={true}>
                <TableCell>{postedTask.title}</TableCell>
                <TableCell>{Web3Utils.fromWei(postedTask.reward, 'ether')}</TableCell>
                <TableCell>{postedTask.status}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table> : null}
    </PaperSection>
  );
}

export default PostedTasksContainer;
