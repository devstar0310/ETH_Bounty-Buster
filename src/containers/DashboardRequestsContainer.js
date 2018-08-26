import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import PaperSection from '../components/paper-section/PaperSection';
import './DashboardRequestsContainer.css';

const DashboardRequestsContainer = ({ requests, onClickRequest }) => {
  return (
    <div className='DashboardRequestsContainer'>
      <PaperSection>
        {requests && requests.size > 0 ? <Table>
          <TableBody>
            {requests.toArray().map((request) => {
              return (
                <TableRow
                  className='DashboardRequestRow'
                  key={request.hash}
                  hover={true}
                  onClick={() => onClickRequest(request.hash)}>
                  <TableCell>{request.taskHash}</TableCell>
                  <TableCell>{request.status}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table> : <p className='NoTasks'>No Requests</p>}
      </PaperSection>
    </div>
  );
};

export default DashboardRequestsContainer;
