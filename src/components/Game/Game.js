import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import styles from './Game.module.css';
import Chip from '../Chip/Chip';
import { RANKING_KEY } from '../../AppConstants';
import Store from '../../Store';
import GameRound from '../GameRound/GameRound';
import RoundHistory from '../RoundHistory/RoundHistory';

const values = [1, 5, 10, 100, 1000];

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bet: 0,
      roundNumber: 0,
      betPlaced: false,
      roundsResults: [],
      credit: 1000,
    };
    this.handleEndOfRound = this.handleEndOfRound.bind(this);
  }

  handleEndOfRound(result) {
    let newCredit;
    const bet = result.betDoubled ? 2 * this.state.bet : this.state.bet;
    if (result.winner === 'player') newCredit = this.state.credit + bet * 1.5;
    else newCredit = this.state.credit - bet;
    this.setState(
      (prevState) => ({
        roundsResults: [...prevState.roundsResults, result],
        betPlaced: false,
        credit: newCredit,
      }),
      () => {
        if (this.state.roundNumber === 5) this.handleEndOfGame();
      },
    );
  }

  handleEndOfGame() {
    const newResult = { date: new Date().toLocaleString('en-US'), score: this.state.credit };
    const ranking = [...(Store.getState(RANKING_KEY) || []), newResult];
    ranking.sort((a, b) => (a.score <= b.score ? 1 : -1));
    Store.saveState(RANKING_KEY, ranking.slice(0, 10));
  }

  raiseBet = (value) => {
    this.setState((prevState) => ({
      bet: prevState.bet + value,
    }));
  };

  canStartNewRound() {
    return !this.state.betPlaced && this.state.roundNumber < 5;
  }

  placeBet() {
    this.setState((prevState) => ({
      betPlaced: true,
      roundNumber: prevState.roundNumber + 1,
    }));
  }

  render() {
    const game = this.state.betPlaced && (
      <GameRound
        key={this.props.deckID}
        deckID={this.props.deckID}
        continueLastGame={this.props.continueLastGame}
        onEndOfRound={this.handleEndOfRound}
        roundNumber={this.state.roundNumber}
      />
    );
    const chips = values.map((val) => <Chip clickCallback={this.raiseBet} value={val} />);
    const betHandler = (
      <div>
        {chips}
        <Button
          disabled={this.state.bet > this.state.credit || this.state.bet === 0}
          onClick={() => this.placeBet()}
        >
          Deal
        </Button>
        {this.state.bet > this.state.credit && <div>Your bet is higher than your credit!</div>}
      </div>
    );
    const results = <div>game is over</div>;
    return (
      <div className={styles.Game} data-testid="Game">
        {game}
        {this.canStartNewRound() && betHandler}
        {!this.state.betPlaced && this.state.roundNumber === 5 && results}
        {this.state.bet}
        <Button onClick={() => this.setState({ bet: 0 })}>clear</Button>
        <RoundHistory rounds={this.state.roundsResults} />
      </div>
    );
  }
}
