import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardContent, CardFooter } from '../Card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders card with children', () => {
      render(
        <Card>
          <div>Card content</div>
        </Card>
      )
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('applies default card styles', () => {
      render(<Card data-testid="card">Content</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('bg-white', 'rounded-xl', 'shadow-xl', 'border', 'border-slate-200')
    })

    it('applies custom className', () => {
      render(
        <Card className="custom-class" data-testid="card">
          Content
        </Card>
      )
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('custom-class')
      expect(card).toHaveClass('bg-white') // Still has default classes
    })

    it('forwards additional props', () => {
      render(
        <Card data-testid="card" role="article">
          Content
        </Card>
      )
      const card = screen.getByTestId('card')
      expect(card).toHaveAttribute('role', 'article')
    })
  })

  describe('CardHeader', () => {
    it('renders header with children', () => {
      render(
        <CardHeader>
          <h2>Header Title</h2>
        </CardHeader>
      )
      expect(screen.getByText('Header Title')).toBeInTheDocument()
    })

    it('applies default header styles', () => {
      render(<CardHeader data-testid="header">Header</CardHeader>)
      const header = screen.getByTestId('header')
      expect(header).toHaveClass('px-6', 'py-4', 'border-b', 'border-slate-200')
    })

    it('applies custom className', () => {
      render(
        <CardHeader className="custom-header" data-testid="header">
          Header
        </CardHeader>
      )
      const header = screen.getByTestId('header')
      expect(header).toHaveClass('custom-header')
      expect(header).toHaveClass('px-6') // Still has default classes
    })
  })

  describe('CardContent', () => {
    it('renders content with children', () => {
      render(
        <CardContent>
          <p>Content text</p>
        </CardContent>
      )
      expect(screen.getByText('Content text')).toBeInTheDocument()
    })

    it('applies default content styles', () => {
      render(<CardContent data-testid="content">Content</CardContent>)
      const content = screen.getByTestId('content')
      expect(content).toHaveClass('px-6', 'py-4')
    })

    it('applies custom className', () => {
      render(
        <CardContent className="custom-content" data-testid="content">
          Content
        </CardContent>
      )
      const content = screen.getByTestId('content')
      expect(content).toHaveClass('custom-content')
      expect(content).toHaveClass('px-6') // Still has default classes
    })
  })

  describe('CardFooter', () => {
    it('renders footer with children', () => {
      render(
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      )
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    it('applies default footer styles', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>)
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveClass('px-6', 'py-4', 'border-t', 'border-slate-200', 'bg-slate-50')
    })

    it('applies custom className', () => {
      render(
        <CardFooter className="custom-footer" data-testid="footer">
          Footer
        </CardFooter>
      )
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveClass('custom-footer')
      expect(footer).toHaveClass('px-6') // Still has default classes
    })
  })

  describe('Card Composition', () => {
    it('renders complete card with all sections', () => {
      render(
        <Card>
          <CardHeader>
            <h2>Card Title</h2>
            <p>Card subtitle</p>
          </CardHeader>
          <CardContent>
            <p>This is the main content of the card.</p>
          </CardContent>
          <CardFooter>
            <button>Primary Action</button>
            <button>Secondary Action</button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card subtitle')).toBeInTheDocument()
      expect(screen.getByText('This is the main content of the card.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Primary Action' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Secondary Action' })).toBeInTheDocument()
    })

    it('renders card with only content', () => {
      render(
        <Card>
          <CardContent>
            <p>Simple card content</p>
          </CardContent>
        </Card>
      )

      expect(screen.getByText('Simple card content')).toBeInTheDocument()
    })

    it('renders card with header and content only', () => {
      render(
        <Card>
          <CardHeader>
            <h3>Title Only</h3>
          </CardHeader>
          <CardContent>
            <p>Content without footer</p>
          </CardContent>
        </Card>
      )

      expect(screen.getByText('Title Only')).toBeInTheDocument()
      expect(screen.getByText('Content without footer')).toBeInTheDocument()
    })

    it('maintains semantic structure', () => {
      render(
        <Card role="article">
          <CardHeader>
            <h2>Article Title</h2>
          </CardHeader>
          <CardContent>
            <p>Article content</p>
          </CardContent>
        </Card>
      )

      const article = screen.getByRole('article')
      expect(article).toContainElement(screen.getByText('Article Title'))
      expect(article).toContainElement(screen.getByText('Article content'))
    })
  })

  describe('Accessibility', () => {
    it('supports aria labels', () => {
      render(
        <Card aria-label="Information card" data-testid="card">
          <CardContent>Information</CardContent>
        </Card>
      )

      const card = screen.getByTestId('card')
      expect(card).toHaveAttribute('aria-label', 'Information card')
    })

    it('supports custom roles', () => {
      render(
        <Card role="region" aria-labelledby="card-title">
          <CardHeader>
            <h2 id="card-title">Settings</h2>
          </CardHeader>
          <CardContent>Settings content</CardContent>
        </Card>
      )

      const region = screen.getByRole('region')
      expect(region).toHaveAttribute('aria-labelledby', 'card-title')
    })
  })
})