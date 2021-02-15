import React from 'react';
import PropTypes from 'prop-types';
import styles from './Chip.module.css';

const stylesList = [styles.red, styles.green, styles.blue, styles.gray, styles.black];

const Chip = ({ value, clickCallback }) => (
  <button
    onClick={() => clickCallback(value)}
    className={`${styles.Chip} ${stylesList[0]}`}
    data-testid="Chip"
  >
    <div>{value}</div>
  </button>
);

Chip.propTypes = {
  value: PropTypes.number,
  clickCallback: PropTypes.func.isRequired,
};

Chip.defaultProps = {
  value: 1,
};

export default Chip;
