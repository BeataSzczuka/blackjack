# BLACKJACK

This project is my implementation of a common game Blackjack.

## Demo

Demo version has been deployed [here](https://beataszczuka.github.io/blackjack/)

## Rules

You can learn about the rules of Blackjack [here](https://pl.wikipedia.org/wiki/Blackjack)

## Implementation

In this project I used the [Deck of cards API](https://deckofcardsapi.com/).\
It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Functionality:

All the cards for the player and dealer are visualized and the game functions as per rules.

During the game the hands from every round and their result is saved and displayed in ‘Round History’.

After 5 rounds the game ends and the credit score is added to a ranking showing top historic results.

The game can be saved and loaded at any time.

The game ranking is stored locally and can be viewed at any time

The game saves when the tab/window is closed and a prompt appears to inform the player about this.

The game can be reset at any time.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.
