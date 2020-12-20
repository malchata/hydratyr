import PropTypes from "prop-types";

export const HydratyrPropTypes = {
  children: PropTypes.node.isRequired,
  wrapper: PropTypes.string,
  observe: PropTypes.bool,
  timeout: PropTypes.number
};
