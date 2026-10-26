import { render, screen } from '@testing-library/react';
import App from './App';

test('renders edit instruction text', () => {
  render(<App />);
  const textElement = screen.getByText(/Edit/i);
  expect(textElement).toBeInTheDocument();
});
