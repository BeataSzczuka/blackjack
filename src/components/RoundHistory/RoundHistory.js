import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import styles from './RoundHistory.module.css';
import Card from '../Card/Card';

export default class RoundHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyHidden: true,
    };
  }

  toggleHistory() {
    this.setState((prevState) => ({ historyHidden: !prevState.historyHidden }));
  }

  render() {
    console.log(this.props.rounds);
    return (
      <div data-testid="RoundHistory" id="appButtons">
        <Button onClick={() => this.toggleHistory()}>
          {this.state.historyHidden ? 'show round history' : 'hide round history'}
        </Button>
        <div className={this.state.historyHidden ? styles.hidden : styles.RoundHistory}>
          <span className={styles.goldText}>Round history</span>
          <table>
            <thead>
              <tr>
                <th>Round</th>
                <th>Winner</th>
                <th>Players cards</th>
                <th>Dealers cards</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {this.props.rounds.map((round) => (
                <tr>
                  <td>{round.number}</td>
                  <td>{round.winner}</td>
                  <td className={styles.cards}>
                    <div>
                      {round.playerCards.map((card) => (
                        <Card image={card.image} />
                      ))}
                    </div>
                  </td>
                  <td className={styles.cards}>
                    <div>
                      {round.dealerCards.map((card) => (
                        <Card image={card.image} />
                      ))}
                    </div>
                  </td>
                  <td>{round.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

RoundHistory.propTypes = {};

RoundHistory.defaultProps = {};
