import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

import getWeb3 from '../utils/getWeb3';

class Web3Provider extends Component {
  getChildContext() {
    return { web3: this.web3, account: this.account };
  }

  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentWillMount() {
    getWeb3
      .then((results) => {
        this.web3 = results.web3;
        this.account = results.web3.eth.accounts[0];
        this.setState({ loading: false });
      })
  }

  render() {
    return this.state.loading ? <div>Loading Web3</div> : Children.only(this.props.children);
  }
}

Web3Provider.childContextTypes = {
  web3: PropTypes.object,
  account: PropTypes.string
};

export default Web3Provider;
