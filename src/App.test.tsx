import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '@/App';

test('renders login with Discord CTA', () => {
  render(<App />);
  const linkElement = screen.getByText(/Login with Discord/i);
  expect(linkElement).toBeInTheDocument();
});
