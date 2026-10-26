import { render, screen } from '@testing-library/react';
import App from './App';

test('renders edit text', () => {
  render(<App />);
  const editText = screen.getByText(/Edit/i);
  expect(editText).toBeInTheDocument();
});
