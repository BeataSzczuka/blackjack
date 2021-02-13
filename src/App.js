import React, { Component } from 'react';
import './App.css';
import Game from './components/Game/Game';
import { API_BASE_URL } from './AppConstants';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deckID: '',
      gameState: false
    };

  }

  componentDidMount() {
    this.shuffle();
  }

  shuffle() {
    fetch(`${API_BASE_URL}new/shuffle/?deck_count=6`)
    .then((res) => res.json())
    .then((resJson) => this.setState({ deckID: resJson.deck_id }));
  }

  startGame() {
    this.setState({ gameState: true });
  }

  resetGame() {
    this.shuffle();
    this.setState({gameState: true})
  }

  render() {
    let game = <></>;
    if (this.state.gameState)
      game = (
        <Game key={this.state.deckID} deckID={this.state.deckID} />
      );
    return (
      <div className="App">
        <h1>BLACKJACK</h1>
        { game}

        {this.state.gameState ? (
          <button onClick={() => this.resetGame()}>
            Reset game
          </button>
        ) : <button onClick={() => this.startGame()}>Start game</button>}
      </div>
    );
  }
}
