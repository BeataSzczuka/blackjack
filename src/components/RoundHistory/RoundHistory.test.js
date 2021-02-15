import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RoundHistory from './RoundHistory';

describe('<RoundHistory />', () => {
  test('it should mount', () => {
    render(<RoundHistory />);
    
    const roundHistory = screen.getByTestId('RoundHistory');

    expect(roundHistory).toBeInTheDocument();
  });
});