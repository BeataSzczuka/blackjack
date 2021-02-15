import React, { Component } from 'react';
import styles from './RoundHistory.module.css';
import Card from '../Card/Card';

export default class RoundHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.RoundHistory} data-testid="RoundHistory">
        {this.props.rounds.map((round) => (
          <div>
            <h5>
              Round
              {round.number}
            </h5>
            <div id="cards">
              <h6>Player</h6>
              {round.playerCards.map((card) => (
                <Card image={card.image} />
              ))}
            </div>
            <div id="cards">
              <h6>Gameer</h6>
              {round.dealerCards.map((card) => (
                <Card image={card.image} />
              ))}
            </div>
            <div>
              Result:
              {round.result}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

RoundHistory.propTypes = {};

RoundHistory.defaultProps = {};
