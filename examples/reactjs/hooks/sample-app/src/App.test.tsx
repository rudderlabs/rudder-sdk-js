import React from 'react';
import { render, waitFor } from '@testing-library/react';
import App from './App';

// Mock the useRudderAnalytics hook
jest.mock('./useRudderAnalytics', () => {
  return {
    __esModule: true,
    default: () => undefined // Return undefined instead of an actual analytics instance
  };
});

test('renders learn react link', async () => {
  const { getByText } = render(<App />);
  
  await waitFor(() => {
    const textElement = getByText(/Edit/i);
    expect(textElement).toBeInTheDocument();
  });
});
