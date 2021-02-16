import React, { Component } from 'react';
import { Button } from '@material-ui/core';
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
    const remeberedState = Store.getState(GAME_ROUND_KEY);
    if (this.props.continueLastGame && remeberedState) {
      this.setState(remeberedState);
    } else this.startGameRound();
  }

  componentWillUnmount() {
    this.props.saveGameRound(this.state);
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
            else if (!playerHasHit) this.checkResult();
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

  checkResult() {
    let winner = 'player';
    if (
      this.state.playerScore > 21 ||
      (this.state.dealerScore < 21 && this.state.playerScore < this.state.dealerScore)
    )
      winner = 'dealer';
    else if (this.state.playerScore < 21 && this.state.playerScore === this.state.dealerScore)
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
      <Card key={JSON.stringify(card)} image={card.image} />
    ));
    const dealerCards = this.state.dealerCards.map((card, i) => {
      if (i === 0 && !this.state.showDealersFstCard) return <Card key={card} />;
      return <Card key={card} image={card.image} />;
    });
    const gameRoundHandlers = (
      <div id={styles.gameRoundHandlers}>
        <Button onClick={() => this.handleHit()}>Hit</Button>
        <Button onClick={() => this.handleStand()}>Stand</Button>
        <Button
          disabled={!this.state.playerCards.length === 2}
          onClick={() => this.handleDoubleDown()}
        >
          Double down
        </Button>
      </div>
    );

    return (
      <div className={styles.GameRound} data-testid="GameRound">
        <div>
          <span id={styles.roundNumber}>
            {'Round '}
            {this.props.roundNumber}
          </span>
          <div id={styles.round}>
            <div className={styles.cardsContainer}>
              <span>Player</span>
              <div className={styles.cards}>{playerCards}</div>
              <span id={styles.score}>
                {'Score: '}
                {this.state.playerScore}
              </span>
            </div>
            <div className={styles.cardsContainer}>
              <span>Dealer</span>
              <div className={styles.cards}>{dealerCards}</div>
              <span id={styles.score}>
                {'Score: '}
                {this.state.dealerScore}
              </span>
            </div>
          </div>
        </div>
        {gameRoundHandlers}
        <div id="appButtons">
          <Button onClick={() => this.props.saveGameRound(this.state)}>Save game</Button>
        </div>
      </div>
    );
  }
}
