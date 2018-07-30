import { getContext } from 'recompose';
import PropTypes from 'prop-types';

const withWeb3 = (Component) => {
  return getContext({
    web3: PropTypes.object,
    account: PropTypes.string
  })(Component);
};

export default withWeb3;
