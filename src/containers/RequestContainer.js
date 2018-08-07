import React, { Component } from 'react';
import { compose } from 'recompose';

import withBountyBuster from '../providers/withBountyBuster';
import withWeb3 from '../providers/withWeb3';
import RequestDataContainer from './RequestDataContainer';
import PageHeader from '../components/page-header/PageHeader';
import MenuActions from '../components/menu-actions/MenuActions';
import Request from '../utils/Request';
import Task from '../utils/Task';

class RequestContainer extends Component {
  constructor(props) {
    super(props);

    this.state = { request: null, task: null };
  }

  componentWillMount() {
    let { match, bountyBuster } = this.props;
    let { requestHash } = match.params;
    bountyBuster.requests.call(requestHash)
      .then((requestStruct) => {
        let request = new Request(requestHash, requestStruct);
        this.setState({ request });
        return bountyBuster.tasks.call(request.taskHash);
      })
      .then((taskStruct) => {
        let task = new Task(this.state.request.taskHash, taskStruct);
        this.setState({ task });
      });
  }

  handleAcceptRequest() {
    // debugger;
  }

  handleRejectRequest() {
    // debugger;
  }

  render() {
    let { request, task } = this.state;
    let { web3 } = this.props;
    return (
      <div>
        <PageHeader title='Request' right={
          task && task.poster === web3.eth.accounts[0]
          ? <MenuActions
              actions={[
                { name: 'Accept', handler: this.handleAcceptRequest.bind(this) },
                { name: 'Reject', handler: this.handleRejectRequest.bind(this) }]
              } />
          : null
        } />
        {request ? <RequestDataContainer request={request} /> : null}
      </div>
    );
  }
}

export default compose(withBountyBuster, withWeb3)(RequestContainer);
