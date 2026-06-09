import React from 'react';
import { render } from '@testing-library/react';
import { StudyChat } from './StudyChat';

test('renders StudyChat', () => {
  const { getByText } = render(<StudyChat />);
  expect(getByText('Understand Anything Faster')).toBeTruthy();
});
