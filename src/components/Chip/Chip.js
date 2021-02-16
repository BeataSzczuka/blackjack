import React from 'react';
import PropTypes from 'prop-types';
import styles from './Chip.module.css';

const stylesList = [styles.red, styles.green, styles.blue, styles.gray, styles.black];
const values = [1, 5, 10, 100, 1000];

const Chip = ({ clickCallback }) => (
  <div>
    <h2 className={styles.goldText}>Place a bet and play!</h2>
    {values.map((val, i) => (
      <button
        key={val}
        onClick={() => clickCallback(val)}
        className={`${styles.Chip} ${stylesList[i]}`}
        data-testid="Chip"
      >
        <div>{val}</div>
      </button>
    ))}
  </div>
);

Chip.propTypes = {
  clickCallback: PropTypes.func.isRequired,
};

Chip.defaultProps = {};

export default Chip;
