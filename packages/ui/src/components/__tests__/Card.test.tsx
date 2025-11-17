import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../Card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render with children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should apply default variant styles', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('rounded-lg');
      expect(card.className).toContain('bg-white');
    });

    it('should apply bordered variant styles', () => {
      const { container } = render(<Card variant="bordered">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('border');
    });

    it('should apply elevated variant styles', () => {
      const { container } = render(<Card variant="elevated">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('shadow-lg');
    });

    it('should accept custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('custom-class');
    });

    it('should render as a div by default', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.tagName).toBe('DIV');
    });
  });

  describe('CardHeader', () => {
    it('should render header content', () => {
      render(<CardHeader>Header content</CardHeader>);
      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('should apply header styles', () => {
      const { container } = render(<CardHeader>Header</CardHeader>);
      const header = container.firstChild as HTMLElement;
      expect(header.className).toContain('mb-4');
    });

    it('should accept custom className', () => {
      const { container } = render(<CardHeader className="custom-header">Header</CardHeader>);
      const header = container.firstChild as HTMLElement;
      expect(header.className).toContain('custom-header');
    });
  });

  describe('CardTitle', () => {
    it('should render title content', () => {
      render(<CardTitle>Title text</CardTitle>);
      expect(screen.getByText('Title text')).toBeInTheDocument();
    });

    it('should apply title styles', () => {
      const { container } = render(<CardTitle>Title</CardTitle>);
      const title = container.firstChild as HTMLElement;
      expect(title.className).toContain('text-xl');
      expect(title.className).toContain('font-semibold');
    });

    it('should render as h3 by default', () => {
      const { container } = render(<CardTitle>Title</CardTitle>);
      const title = container.firstChild as HTMLElement;
      expect(title.tagName).toBe('H3');
    });

    it('should accept custom className', () => {
      const { container } = render(<CardTitle className="custom-title">Title</CardTitle>);
      const title = container.firstChild as HTMLElement;
      expect(title.className).toContain('custom-title');
    });
  });

  describe('CardContent', () => {
    it('should render content', () => {
      render(<CardContent>Content text</CardContent>);
      expect(screen.getByText('Content text')).toBeInTheDocument();
    });

    it('should apply content padding', () => {
      const { container } = render(<CardContent>Content</CardContent>);
      const content = container.firstChild as HTMLElement;
      expect(content.className).toContain('p-6');
    });

    it('should accept custom className', () => {
      const { container } = render(<CardContent className="custom-content">Content</CardContent>);
      const content = container.firstChild as HTMLElement;
      expect(content.className).toContain('custom-content');
    });
  });

  describe('CardFooter', () => {
    it('should render footer content', () => {
      render(<CardFooter>Footer content</CardFooter>);
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('should apply footer styles', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      const footer = container.firstChild as HTMLElement;
      expect(footer.className).toContain('mt-4');
      expect(footer.className).toContain('border-t');
    });

    it('should accept custom className', () => {
      const { container } = render(<CardFooter className="custom-footer">Footer</CardFooter>);
      const footer = container.firstChild as HTMLElement;
      expect(footer.className).toContain('custom-footer');
    });
  });

  describe('Card Composition', () => {
    it('should render all card parts together', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>Card content goes here</CardContent>
          <CardFooter>Card footer</CardFooter>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card content goes here')).toBeInTheDocument();
      expect(screen.getByText('Card footer')).toBeInTheDocument();
    });

    it('should work with only some parts', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title Only</CardTitle>
          </CardHeader>
        </Card>
      );

      expect(screen.getByText('Title Only')).toBeInTheDocument();
    });

    it('should work with just content', () => {
      render(
        <Card>
          <CardContent>Just content</CardContent>
        </Card>
      );

      expect(screen.getByText('Just content')).toBeInTheDocument();
    });
  });
});
