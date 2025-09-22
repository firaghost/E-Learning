import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '../components/Card';

describe('Card', () => {
  const mockProps = {
    title: 'Test Title',
    description: 'Test Description',
  };

  test('renders title and description', () => {
    render(<Card {...mockProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('renders tags when provided', () => {
    const propsWithTags = {
      ...mockProps,
      tags: ['Tag1', 'Tag2'],
    };

    render(<Card {...propsWithTags} />);

    expect(screen.getByText('Tag1')).toBeInTheDocument();
    expect(screen.getByText('Tag2')).toBeInTheDocument();
  });

  test('does not render tags when not provided', () => {
    render(<Card {...mockProps} />);

    expect(screen.queryByText('Tag1')).not.toBeInTheDocument();
  });
});