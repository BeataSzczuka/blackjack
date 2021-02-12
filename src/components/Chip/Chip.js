import React from 'react';
import PropTypes from 'prop-types';
import styles from './Chip.module.css';

const Chip = ({ value }) => (
  <div className={styles.Chip} data-testid="Chip">
    <button>{value}</button>
  </div>
);

Chip.propTypes = {
  value: PropTypes.number
};

Chip.defaultProps = {};

export default Chip;
