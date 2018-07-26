import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import contract from 'truffle-contract';

import BountyBuster from '../../build/contracts/BountyBuster.json';
import withWeb3 from './withWeb3';

class BountyBusterProvider extends Component {
  getChildContext() {
    return { bountyBuster: this.bountyBuster };
  }
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }
  componentWillMount() {
    let { web3 } = this.props;
    let bountyBuster = contract(BountyBuster);
    bountyBuster.setProvider(web3.currentProvider);
    bountyBuster.deployed()
      .then((instance) => {
        this.bountyBuster = instance;
        this.setState({ loading: false });
      });
  }
  render() {
    return this.state.loading ? <div>Loading BountyBuster</div> : Children.only(this.props.children);
  }
}

BountyBusterProvider.childContextTypes = {
  bountyBuster: PropTypes.object
};

export default withWeb3(BountyBusterProvider);
