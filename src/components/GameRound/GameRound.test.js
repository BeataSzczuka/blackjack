import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GameRound from './GameRound';

describe('<GameRound />', () => {
  test('it should mount', () => {
    render(<GameRound />);

    const game = screen.getByTestId('GameRound');

    expect(game).toBeInTheDocument();
  });
});
