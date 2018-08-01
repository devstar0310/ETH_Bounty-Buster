import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Web3Utils from 'web3-utils';

import PaperSection from '../components/paper-section/PaperSection';
import './DashboardTasksContainer.css';

const DashboardTasksContainer = ({ tasks }) => {
  return (
    <div className='DashboardTasksContainer'>
      <PaperSection>
        {tasks ? <Table>
          <TableBody>
            {tasks.toArray().map((task) => {
              return (
                <TableRow key={task.hash} hover={true}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{Web3Utils.fromWei(task.reward, 'ether')}</TableCell>
                  <TableCell>{task.status}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table> : null}
      </PaperSection>
    </div>
  );
}

export default DashboardTasksContainer;
