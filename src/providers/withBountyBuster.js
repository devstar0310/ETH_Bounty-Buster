import PropTypes from 'prop-types';
import { getContext } from 'recompose';

const withBountyBuster = (Component) => {
  return getContext({
    bountyBuster: PropTypes.object
  })(Component);
};

export default withBountyBuster;
