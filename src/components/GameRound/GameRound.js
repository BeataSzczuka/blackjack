import React, { Component } from 'react';
import styles from './GameRound.module.css';
import { API_BASE_URL } from '../../AppConstants';
import Card from '../Card/Card';
import Store from '../../Store';

const GAME_ROUND_KEY = 'GAME_ROUND_KEY';

export default class GameRound extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerCards: [],
      dealerCards: [],
      playerScore: 0,
      dealerScore: 0,
      betDoubled: false,
      showDealersFstCard: false,
    };
    this.onEndOfRound = this.props.onEndOfRound.bind(this);
  }

  componentDidMount() {
    if (this.props.continueGame) {
      this.setState(Store.getState(GAME_ROUND_KEY));
    } else this.startGameRound();

    window.addEventListener('beforeunload', this.saveGameRound);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.saveGameRound);
  }

  handleHit() {
    this.getCards(1).then((resJson) =>
      this.setState(
        (prevState) => ({
          playerCards: [...prevState.playerCards, resJson.cards[0]],
          playerScore: this.calculateScore([...prevState.playerCards, resJson.cards[0]]),
        }),
        () => {
          if (this.state.playerScore >= 21) this.checkResult();
          this.handleDealersMovement(true);
        },
      ),
    );
  }

  handleStand() {
    this.handleDealersMovement(false);
  }

  handleDoubleDown() {
    this.setState({ betDoubled: true }, () => this.handleDealersMovement(false));
  }

  handleDealersMovement(playerHasHit) {
    if (this.state.dealerScore <= 16) {
      this.getCards(1).then((resJson) =>
        this.setState(
          (prevState) => ({
            dealerCards: [...prevState.dealerCards, resJson.cards[0]],
            dealerScore: this.calculateScore([...prevState.dealerCards, resJson.cards[0]]),
            showDealersFstCard: true,
          }),
          () => {
            if (this.state.dealerScore <= 16 && !playerHasHit) this.handleDealersMovement(false);
            else this.checkResult();
          },
        ),
      );
    } else if (!playerHasHit) {
      this.checkResult();
    }
  }

  getCards(amount) {
    return fetch(`${API_BASE_URL}${this.props.deckID}/draw/?count=${amount}`).then((res) =>
      res.json(),
    );
  }

  calculateScore = (cards) => {
    let score = 0;
    let asesAmount = 0;
    cards.forEach((card) => {
      if (Number(card.value)) {
        score += Number(card.value);
      } else if (card.value === 'ACE') asesAmount += 1;
      else score += 10;
    });
    while (asesAmount > 0) {
      asesAmount -= 1;
      if (score + 11 + asesAmount <= 21) score += 11;
      else score += 1;
    }
    return score;
  };

  /* eslint-disable class-methods-use-this */
  saveGameRound(ev) {
    /* eslint-disable no-param-reassign */
    ev = ev || window.event;
    ev.preventDefault();
    ev.returnValue = '';
    return '';
  }

  checkResult() {
    let winner = 'player';
    if (
      this.state.playerScore > 21 ||
      (this.state.dealerScore < 21 && this.state.playerScore < this.state.dealerScore)
    )
      winner = 'dealer';
    else if (this.state.playerScore < 21 || this.state.playerScore === this.state.dealerScore)
      winner = 'ex aequo';
    this.onEndOfRound({
      number: this.props.roundNumber,
      winner,
      betDoubled: this.state.betDoubled,
      playerCards: this.state.playerCards,
      dealerCards: this.state.dealerCards,
    });
  }

  startGameRound() {
    this.getCards(4).then((resJson) =>
      this.setState(
        {
          playerCards: [resJson.cards[0], resJson.cards[1]],
          playerScore: this.calculateScore([resJson.cards[0], resJson.cards[1]]),
          dealerCards: [resJson.cards[2], resJson.cards[3]],
          dealerScore: this.calculateScore([resJson.cards[2], resJson.cards[3]]),
        },
        () => {
          if (this.state.playerScore >= 21) this.checkResult();
        },
      ),
    );
  }

  render() {
    const playerCards = this.state.playerCards.map((card) => (
      <Card key={card} image={card.image} />
    ));
    const dealerCards = this.state.dealerCards.map((card, i) => {
      if (i === 0 && !this.state.showDealersFstCard) return <Card key={card} />;
      return <Card key={card} image={card.image} />;
    });
    const gameRoundHandlers = (
      <div>
        <button onClick={() => this.handleHit()}>Hit</button>
        <button onClick={() => this.handleStand()}>Stand</button>
        <button
          disabled={!this.state.playerCards.length === 2}
          onClick={() => this.handleDoubleDown()}
        >
          Double down
        </button>
        <button onClick={this.saveGameRound}>Save game</button>
      </div>
    );

    return (
      <div className={styles.GameRound} data-testid="GameRound">
        <div>
          <h2>
            Round
            {this.props.roundNumber}
          </h2>
          <h3>Gameer&apos;s cards</h3>
          {dealerCards}
          {this.state.dealerScore}
        </div>
        <div>
          <h3>Player&apos;s cards</h3>
          {playerCards}
          {this.state.playerScore}
        </div>
        {gameRoundHandlers}
      </div>
    );
  }
}
