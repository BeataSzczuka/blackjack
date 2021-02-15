import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import styles from './Game.module.css';
import Chip from '../Chip/Chip';
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
    };
    this.handleEndOfRound = this.handleEndOfRound.bind(this);
  }

  handleEndOfRound(result) {
    this.setState((prevState) => ({
      roundsResults: [...prevState.roundsResults, result],
      betPlaced: false,
    }));
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
    const game = this.state.betPlaced ? (
      <GameRound
        key={this.props.deckID}
        deckID={this.props.deckID}
        continueLastGame={this.props.continueLastGame}
        onEndOfRound={this.handleEndOfRound}
        roundNumber={this.state.roundNumber}
      />
    ) : (
      <></>
    );
    const chips = values.map((val) => <Chip clickCallback={this.raiseBet} value={val} />);
    const betHandler = (
      <div>
        {chips}
        <Button onClick={() => this.placeBet()}>Game</Button>
      </div>
    );
    const results = <div>game is over</div>;
    return (
      <div className={styles.Game} data-testid="Game">
        {game}
        {this.canStartNewRound() ? betHandler : <></>}
        {!this.state.betPlaced && this.state.roundNumber === 5 ? results : <></>}
        {this.state.bet}
        <Button onClick={() => this.setState({ bet: 0 })}>clear</Button>
        <RoundHistory rounds={this.state.roundsResults} />
      </div>
    );
  }
}
