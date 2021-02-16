import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import styles from './Game.module.css';
import Chip from '../Chip/Chip';
import { RANKING_KEY } from '../../AppConstants';
import Store from '../../Store';
import GameRound from '../GameRound/GameRound';
import RoundHistory from '../RoundHistory/RoundHistory';

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bet: 0,
      roundNumber: 0,
      betPlaced: false,
      roundsResults: [],
      credit: 1000,
      resultMessage: '',
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
        roundsResults: [{ ...result, score: newCredit }, ...prevState.roundsResults],
        betPlaced: false,
        credit: newCredit,
      }),
      () => {
        if (this.state.roundNumber === 5 || this.state.credit < 1) this.handleEndOfGame();
        let resultMessage = 'Congratulations! You won this round!';
        if (result.winner === 'dealer') resultMessage = 'You lost this round...';
        else if (result.winner === 'ex aequo') resultMessage = 'Ex aequo!';
        this.setState({ resultMessage });
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
    return !this.state.betPlaced && this.state.roundNumber < 5 && this.state.credit > 1;
  }

  placeBet() {
    this.setState((prevState) => ({
      betPlaced: true,
      roundNumber: prevState.roundNumber + 1,
    }));
  }

  summaryOfTheGame() {
    const won = this.state.roundsResults.filter((r) => r.winner === 'player').length >= 3;
    if (won)
      return (
        <div className={styles.goldText}>
          <span>Congratulations, you won the game!</span>
        </div>
      );
    return (
      <div className={styles.goldText}>
        <span>You lost the game!</span>
      </div>
    );
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
    const chips = <Chip clickCallback={this.raiseBet} />;
    const betHandler = (
      <div>
        <div>{chips}</div>
        <div id={styles.dealBtns}>
          <Button disabled={this.state.bet === 0} onClick={() => this.setState({ bet: 0 })}>
            clear
          </Button>
          <Button
            className={styles.Button}
            disabled={this.state.bet > this.state.credit || this.state.bet === 0}
            onClick={() => this.placeBet()}
          >
            {`Bet ${this.state.bet}$`}
          </Button>
        </div>
      </div>
    );

    return (
      <div className={styles.Game} data-testid="Game">
        <div id={styles.credit}>
          <img src="bag-147782_1280.png" alt="Credit" />
          <span>
            {this.state.credit}
            {'$'}
          </span>
        </div>
        {game}
        {this.canStartNewRound() ? betHandler : this.summaryOfTheGame()}
        <RoundHistory rounds={this.state.roundsResults} />
        <Snackbar
          anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
          className={styles.Info}
          autoHideDuration={6000}
          open={this.state.bet > this.state.credit}
          onClose={() => this.setState({ bet: 0 })}
          message="Your bet is higher than your credit!"
        />
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={!this.state.betPlaced && this.state.resultMessage !== ''}
          message={this.state.resultMessage}
          onClose={() => this.setState({ resultMessage: '' })}
        />
      </div>
    );
  }
}
