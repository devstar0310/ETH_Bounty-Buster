import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import './RequestDataContainer.css';

const RequestDataContainer = ({ request }) => {
  return (
    <div className='RequestDataContainer'>
      <FormControl disabled={true}>
        <InputLabel>Status</InputLabel>
        <Input
          disableUnderline={true}
          value={request.status}
          onChange={null} />
      </FormControl>
      <FormControl disabled={true}>
        <InputLabel>Requester</InputLabel>
        <Input
          disableUnderline={true}
          value={request.requester}
          onChange={null} />
      </FormControl>
      <FormControl disabled={true}>
        <InputLabel>Message</InputLabel>
        <Input
          disableUnderline={true}
          value={request.message}
          onChange={null} />
      </FormControl>
    </div>
  );
}

export default RequestDataContainer;
