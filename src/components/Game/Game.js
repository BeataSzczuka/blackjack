import React, { Component } from 'react';
import styles from './Game.module.css';
import { API_BASE_URL } from '../../App.js';


export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerCards: []
    }
  }

  getCards() {
    fetch(`${API_BASE_URL}${this.props.deckID}/draw/?count=4`)
      .then((res) => res.json())
      .then((resJson) => this.setState({ playerCards: [resJson.cards[0], resJson.cards[1]] }));
  }

  componentDidMount() {

  }
  render() {
    console.log(this.props.state)

    return (
      <div className={styles.Game} data-testid="Game">
        Game Component
      </div>
    );
  }
}

