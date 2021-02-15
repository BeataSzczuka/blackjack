import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import './App.css';
import Game from './components/Game/Game';
import { API_BASE_URL } from './AppConstants';
import Store from './Store';
import Ranking from './components/Ranking/Ranking';

const APP_KEY = 'APP_KEY';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deckID: '',
      gameState: false,
      continueLastGame: false,
      rankingOpened: false,
    };
  }

  componentDidMount() {
    const remeberdState = Store.getState(APP_KEY);
    console.log(remeberdState);
    if (remeberdState) this.setState(remeberdState);
    if (!this.state.gameState) this.shuffle();
  }

  componentWillUnmount() {
    Store.saveState(APP_KEY, this.state);
  }

  onRankingOpen() {
    this.setState({ rankingOpened: true });
  }

  onRankingClose = () => {
    this.setState({ rankingOpened: false });
  };

  continueGame() {
    this.setState({ continueLastGame: true, gameState: true });
  }

  startGame() {
    this.setState({ gameState: true });
  }

  shuffle() {
    fetch(`${API_BASE_URL}new/shuffle/?deck_count=6`)
      .then((res) => res.json())
      .then((resJson) => this.setState({ deckID: resJson.deck_id }));
  }

  resetGame() {
    this.shuffle();
    this.setState({ gameState: false, continueLastGame: false });
  }

  render() {
    let game = <></>;
    if (this.state.gameState)
      game = (
        <Game
          key={this.state.deckID}
          deckID={this.state.deckID}
          continueLastGame={this.state.continueLastGame}
        />
      );
    const buttons = [<button onClick={() => this.startGame()}>Start game</button>];
    buttons.push(<button onClick={() => this.continueGame()}>Continue game</button>);
    return (
      <div className="App">
        <h1>BLACKJACK</h1>
        {game}

        {this.state.gameState ? (
          <button onClick={() => this.resetGame()}>New game</button>
        ) : (
          buttons
        )}

        <Button onClick={() => this.onRankingOpen()}>Ranking</Button>
        <Ranking open={this.state.rankingOpened} onClose={this.onRankingClose} />
      </div>
    );
  }
}
