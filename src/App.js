import React, { Component } from 'react';
import './App.css';
import Card from './components/Card/Card';
import Chip from './components/Chip/Chip';
import Game from './components/Game/Game';

export const API_BASE_URL = 'https://deckofcardsapi.com/api/deck/';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deckID: '',
      gameState: false
    };

  }

  componentDidMount() {
    fetch(`${API_BASE_URL}new/shuffle/?deck_count=6`)
      .then((res) => res.json())
      .then((resJson) => this.setState({ deckID: resJson.deck_id }));
  }

  startGame() {
    this.setState({ gameState: true });
  }

  resetGame() {
    //ToDo
  }

  render() {
    return (
      <div className="App">
        <h1>BLACKJACK</h1>
        <Game deckID={this.state.deckID} gameState={this.state.gameState} ></Game>
        <Card image="https://deckofcardsapi.com/static/img/3S.png"></Card>
        <Chip value="3"></Chip>

        {this.state.gameState ?
          <button onClick={() => this.resetGame()}>Reset game</button> : <button onClick={() => this.startGame()}>Start game</button>}
      </div>
    );
  }
}
