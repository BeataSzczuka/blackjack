import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import styles from './Ranking.module.css';
import { RANKING_KEY } from '../../AppConstants';
import Store from '../../Store';

const Ranking = ({ open, onClose }) => {
  const loadRanking = () => Store.getState(RANKING_KEY) || [];
  const table = (
    <table data-testid="Ranking">
      <thead>
        <tr>
          <th>Place</th>
          <th>Date</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {loadRanking().map((result, i) => (
          <tr key={JSON.stringify(result)}>
            <td>{i + 1}</td>
            <td>{result.date}</td>
            <td>{result.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <Dialog
      className={styles.Ranking}
      maxWidth="md"
      fullWidth
      open={open}
      onClose={() => onClose()}
    >
      <DialogTitle>
        <span className={styles.goldText}>Ranking</span>
      </DialogTitle>
      {table}
    </Dialog>
  );
};

Ranking.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

Ranking.defaultProps = {};

export default Ranking;
