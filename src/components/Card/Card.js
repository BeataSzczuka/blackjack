import React from 'react';
import PropTypes from 'prop-types';
import styles from './Card.module.css';

const Card = ({ image }) => (
  <div className={styles.Card} data-testid="Card">
    <img src={image} alt="card" />
  </div>
);

Card.propTypes = {
  image: PropTypes.string.isRequired
};

Card.defaultProps = {};

export default Card;
