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
    this.shuffle();
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
    const game = this.state.gameState && (
      <Game
        key={this.state.deckID}
        deckID={this.state.deckID}
        continueLastGame={this.state.continueLastGame}
      />
    );
    return (
      <div className={this.state.gameState ? 'App game' : 'App beginning'}>
        <div id="background" />
        <div id="foreground">
          <h1>BLACKJACK</h1>
          {game}

          <div id="appButtons">
            {this.state.gameState ? (
              <Button onClick={() => this.resetGame()}>New game</Button>
            ) : (
              <>
                <Button className="Button" onClick={() => this.startGame()}>
                  Play
                </Button>
                <Button disabled={!Store.getState('GAME_KEY')} onClick={() => this.continueGame()}>
                  Continue game
                </Button>
              </>
            )}
            <Button onClick={() => this.onRankingOpen()}>Ranking</Button>
          </div>
          <Ranking open={this.state.rankingOpened} onClose={this.onRankingClose} />
        </div>
      </div>
    );
  }
}
