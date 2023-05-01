import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders the app without crashing', () => {
  render(<App />);
});

test('renders app title', () => {
  render(<App />);
  const title = screen.getByText(/PERSONAL TRAINING APP/i);
  expect(title).toBeInTheDocument();
});

test('renders customer list and training list tabs', () => {
  render(<App />);
  const customerListTab = screen.getByText(/customer list/i);
  const trainingListTab = screen.getByText(/training list/i);
  expect(customerListTab).toBeInTheDocument();
  expect(trainingListTab).toBeInTheDocument();
});

test('customer list tab is the default tab', () => {
  render(<App />);
  const customerListTab = screen.getByRole('tab', { name: /customer list/i });
  expect(customerListTab).toHaveAttribute('aria-selected', 'true');
});


