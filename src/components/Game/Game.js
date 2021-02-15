import React, { Component } from 'react';
import styles from './Game.module.css';
import { API_BASE_URL } from '../../AppConstants';
import Card from '../Card/Card';
import Chip from '../Chip/Chip';
import Store from '../../Store';

const GAME_KEY = 'GAME_KEY';

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerCards: [],
      dealerCards: [],
      playerScore: 0,
      dealerScore: 0,
      gameResult: null,
      //  showDealersFstCard: false
    };
  }

  componentDidMount() {
    if (this.props.continueGame) {
      this.setState(Store.getState(GAME_KEY));
    } else this.startGame();

    window.addEventListener('beforeunload', this.saveGame);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.saveGame);
  }

  handleHit() {
    this.getCards(1).then((resJson) =>
      this.setState(
        (prevState) => ({
          playerCards: [...prevState.playerCards, resJson.cards[0]],
          playerScore: this.calculateScore([...prevState.playerCards, resJson.cards[0]]),
        }),
        () => this.checkResult(),
      ),
    );
  }

  handleStand() {
    this.handleDealersMovement();
  }

  handleDoubleDown() {
    this.handleDealersMovement();
  }

  handleDealersMovement() {
    if (this.state.dealerScore <= 16) {
      this.getCards(1).then((resJson) =>
        this.setState((prevState) => ({
          dealerCards: [...prevState.dealerCards, resJson.cards[0]],
          dealerScore: this.calculateScore([...prevState.dealerCards, resJson.cards[0]]),
        })),
      );
    }
    //  this.setState({showDealersFstCard: true});
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
  saveGame(ev) {
    /* eslint-disable no-param-reassign */
    ev = ev || window.event;
    ev.preventDefault();
    ev.returnValue = '';
    return '';
  }

  checkResult() {
    if (
      this.state.playerScore > 21 ||
      (this.state.dealerScore < 21 && this.state.playerScore < this.state.dealerScore)
    )
      this.setState({ gameResult: false });
    else this.setState({ gameResult: true });
  }

  startGame() {
    this.getCards(4).then((resJson) =>
      this.setState({
        playerCards: [resJson.cards[0], resJson.cards[1]],
        playerScore: this.calculateScore([resJson.cards[0], resJson.cards[1]]),
        dealerCards: [resJson.cards[2], resJson.cards[3]],
        dealerScore: this.calculateScore([resJson.cards[2], resJson.cards[3]]),
      }),
    );
  }

  render() {
    const playerCards = this.state.playerCards.map((card) => <Card image={card.image} />);
    const dealerCards = this.state.dealerCards.map((card) => <Card image={card.image} />);
    const chips = <Chip value="3" />;
    let gameHandlers = <></>;
    if (this.state.gameResult !== null)
      gameHandlers = this.state.gameResult ? (
        <div>Congratulations! You won the game</div>
      ) : (
        <div>You lost the game</div>
      );
    else
      gameHandlers = (
        <div>
          <button onClick={() => this.handleHit()}>Hit</button>
          <button onClick={() => this.handleStand()}>Stand</button>
          <button onClick={() => this.handleDoubleDown()}>Double down</button>
          <button onClick={this.saveGame}>Save game</button>
        </div>
      );

    return (
      <div className={styles.Game} data-testid="Game">
        <div>
          <h3>Dealer&apos;s cards</h3>
          {dealerCards}
          {this.state.dealerScore}
        </div>
        <div>
          <h3>Player&apos;s cards</h3>
          {playerCards}
          {this.state.playerScore}
        </div>

        <div>
          <h3>Player&apos;s chips</h3>
          {chips}
        </div>
        {gameHandlers}
      </div>
    );
  }
}
