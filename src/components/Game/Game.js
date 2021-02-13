import React, { Component } from 'react';
import styles from './Game.module.css';
import { API_BASE_URL } from '../../AppConstants';
import Card from '../Card/Card';
import Chip from '../Chip/Chip';

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerCards: [],
      dealerCards: [],
      gameResult: null,
    //  showDealersFstCard: false
    }
  }

  componentDidMount() {
    this.startGame();
  }

  handleHit(){
    this.getCards(1)
    .then((resJson) => this.setState((prevState) => ({
        playerCards: [...prevState.playerCards, resJson.cards[0]]
      }), () => this.checkResult()))
  }

  handleStand() {
    while (this.calculateScore(this.state.dealerCards) < 21) 
      this.handleDealersMovement();
  }

  handleDealersMovement(dealerScore) {
    if (dealerScore  <= 36) {
      this.getCards(1)
      .then((resJson) => this.setState((prevState) => ({
        dealerCards: [...prevState.dealerCards, resJson.cards[0]]
      }), () => {}));
    }
  //  this.setState({showDealersFstCard: true});
  }

  getCards(amount) {
    return fetch(`${API_BASE_URL}${this.props.deckID}/draw/?count=${amount}`)
      .then((res) => res.json());
  }

  calculateScore = (cards) => {
    let score = 0;
    let asesAmount = 0;
    cards.forEach((card) => {
      if (Number(card.value)) {
        score += Number(card.value);
      }
      else if (card.value === "ACE") asesAmount += 1;
      else score += 10;
    });
    while (asesAmount > 0) {
      asesAmount -= 1;
      if (score + 11 + asesAmount <= 21) score += 11;
      else score += 1;
    }
    return score;
  }

  startGame() {
    this.getCards(4)
      .then((resJson) => this.setState({
        playerCards: [resJson.cards[0], resJson.cards[1]],
        dealerCards: [resJson.cards[2], resJson.cards[3]]
      }));
  }

  checkResult() {
    const playerScore = this.calculateScore(this.state.playerCards);
    const dealerScore = this.calculateScore(this.state.dealerCards);

    if (playerScore > 21) this.setState({ gameResult: false}); 
    else this.handleDealersMovement(dealerScore);

  }



  render() {
    const playerCards = this.state.playerCards.map(card => (<Card image={card.image} />));
    const dealerCards = this.state.dealerCards.map(card => (<Card image={card.image} />));
    const chips = (<Chip value="3" />);
    let gameHandlers = <></>;
    if (this.state.gameResult !== null) gameHandlers = this.state.gameResult ? 
      <div>Congratulations! You won the game</div> : <div>You lost the game</div>;
    else gameHandlers = (
      <div>
        <button onClick={()=>this.handleHit()}>Hit</button>
        <button onClick={()=>this.checkResult()}>Stand</button>
        <button onClick={()=>this.checkResult()}>Double down</button>
      </div>
)

    return (
      <div className={styles.Game} data-testid="Game">
        <div>
          <h3>Dealer&apos;s cards</h3>
          {dealerCards}
        </div>
        <div>
          <h3>Player&apos;s cards</h3>
          {playerCards}
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

