import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Web3Utils from 'web3-utils';

import PaperSection from '../components/paper-section/PaperSection';
import './DashboardTasksContainer.css';

const DashboardTasksContainer = ({ tasks, onClickTask }) => {
  return (
    <div className='DashboardTasksContainer'>
      <PaperSection>
        {tasks && tasks.size > 0 ? <Table>
          <TableBody>
            {tasks.toArray().map((task) => {
              return (
                <TableRow
                  className='DashboardTaskRow'
                  key={task.hash}
                  hover={true}
                  onClick={() => onClickTask(task.hash)}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{Web3Utils.fromWei(task.reward, 'ether')}</TableCell>
                  <TableCell>{task.status}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table> : <p className='NoTasks'>No Tasks</p>}
      </PaperSection>
    </div>
  );
}

export default DashboardTasksContainer;
