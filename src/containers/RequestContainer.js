import React, { Component } from 'react';
import { compose } from 'recompose';

import withBountyBuster from '../providers/withBountyBuster';
import Request from '../utils/Request';

class RequestContainer extends Component {
  constructor(props) {
    super(props);

    this.state = { request: null };
  }
  componentWillMount() {
    let { match, bountyBuster } = this.props;
    let { requestHash } = match.params;
    bountyBuster.requests.call(requestHash)
      .then((requestStruct) => {
        let request = new Request(requestHash, requestStruct);
        debugger;
      });
  }
  render() {
    return <div></div>
  }
}

export default compose(withBountyBuster)(RequestContainer);
