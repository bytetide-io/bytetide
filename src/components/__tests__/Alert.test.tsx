import { render, screen } from '@testing-library/react'
import { Alert } from '../Alert'

describe('Alert', () => {
  it('renders alert with children', () => {
    render(<Alert>Alert message</Alert>)
    expect(screen.getByText('Alert message')).toBeInTheDocument()
  })

  it('renders success variant correctly', () => {
    render(<Alert variant="success">Success message</Alert>)
    const alert = screen.getByText('Success message').closest('.bg-green-50')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass('border-green-200', 'text-green-800')
  })

  it('renders error variant correctly', () => {
    render(<Alert variant="error">Error message</Alert>)
    const alert = screen.getByText('Error message').closest('.bg-red-50')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass('border-red-200', 'text-red-800')
  })

  it('renders warning variant correctly', () => {
    render(<Alert variant="warning">Warning message</Alert>)
    const alert = screen.getByText('Warning message').closest('.bg-amber-50')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass('border-amber-200', 'text-amber-800')
  })

  it('renders info variant correctly', () => {
    render(<Alert variant="info">Info message</Alert>)
    const alert = screen.getByText('Info message').closest('.bg-blue-50')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveClass('border-blue-200', 'text-blue-800')
  })

  it('renders with title', () => {
    render(<Alert title="Alert Title">Alert message</Alert>)
    expect(screen.getByText('Alert Title')).toBeInTheDocument()
    expect(screen.getByText('Alert message')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <Alert className="custom-class" data-testid="alert">
        Message
      </Alert>
    )
    const alert = screen.getByTestId('alert')
    expect(alert).toHaveClass('custom-class')
  })

  it('has correct accessibility attributes', () => {
    render(
      <Alert variant="error" data-testid="alert">
        Error message
      </Alert>
    )
    const alert = screen.getByTestId('alert')
    expect(alert).toHaveAttribute('role', 'alert')
  })

  it('renders appropriate icons for variants', () => {
    render(
      <div>
        <Alert variant="success" data-testid="success">Success</Alert>
        <Alert variant="error" data-testid="error">Error</Alert>
        <Alert variant="warning" data-testid="warning">Warning</Alert>
        <Alert variant="info" data-testid="info">Info</Alert>
      </div>
    )

    // Each variant should have its appropriate icon
    expect(screen.getByTestId('success').querySelector('svg')).toBeInTheDocument()
    expect(screen.getByTestId('error').querySelector('svg')).toBeInTheDocument()
    expect(screen.getByTestId('warning').querySelector('svg')).toBeInTheDocument()
    expect(screen.getByTestId('info').querySelector('svg')).toBeInTheDocument()
  })
})