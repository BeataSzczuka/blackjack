import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Chip from './Chip';

describe('<Chip />', () => {
  test('it should mount', () => {
    render(<Chip />);
    
    const chip = screen.getByTestId('Chip');

    expect(chip).toBeInTheDocument();
  });
});