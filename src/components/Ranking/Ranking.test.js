import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Ranking from './Ranking';

describe('<Ranking />', () => {
  test('it should mount', () => {
    render(<Ranking />);
    
    const ranking = screen.getByTestId('Ranking');

    expect(ranking).toBeInTheDocument();
  });
});