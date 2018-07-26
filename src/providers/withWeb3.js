import { getContext } from 'recompose';
import PropTypes from 'prop-types';

const withWeb3 = (Component) => {
  return getContext({
    web3: PropTypes.object,
  })(Component);
};

export default withWeb3;
