import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../Input'

describe('Input', () => {
  it('renders input with label', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders required indicator', () => {
    render(<Input label="Email" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const handleChange = jest.fn()
    const user = userEvent.setup()
    
    render(<Input label="Email" onChange={handleChange} />)
    const input = screen.getByLabelText('Email')
    
    await user.type(input, 'test@example.com')
    
    expect(handleChange).toHaveBeenCalledTimes('test@example.com'.length)
    expect(input).toHaveValue('test@example.com')
  })

  it('displays error message', () => {
    render(<Input label="Email" error="Invalid email" />)
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
    
    const input = screen.getByLabelText('Email')
    expect(input).toHaveClass('border-red-500')
  })

  it('displays help text', () => {
    render(<Input label="Email" helpText="Enter your email address" />)
    expect(screen.getByText('Enter your email address')).toBeInTheDocument()
  })

  it('supports different input types', () => {
    render(
      <>
        <Input label="Email" type="email" />
        <Input label="Password" type="password" />
        <Input label="Number" type="number" />
      </>
    )

    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
    expect(screen.getByLabelText('Number')).toHaveAttribute('type', 'number')
  })

  it('renders with placeholder', () => {
    render(<Input label="Email" placeholder="Enter your email" />)
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
  })

  it('renders left icon', () => {
    const LeftIcon = () => <svg data-testid="left-icon" />
    render(<Input label="Email" leftIcon={<LeftIcon />} />)
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
  })

  it('renders right icon', () => {
    const RightIcon = () => <svg data-testid="right-icon" />
    render(<Input label="Email" rightIcon={<RightIcon />} />)
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input label="Email" disabled />)
    const input = screen.getByLabelText('Email')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('supports controlled input', async () => {
    const Component = () => {
      const [value, setValue] = React.useState('')
      return (
        <Input 
          label="Email" 
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
        />
      )
    }

    const user = userEvent.setup()
    render(<Component />)
    
    const input = screen.getByLabelText('Email')
    await user.type(input, 'test')
    
    expect(input).toHaveValue('test')
  })

  it('supports uncontrolled input', async () => {
    const user = userEvent.setup()
    render(<Input label="Email" defaultValue="default@example.com" />)
    
    const input = screen.getByLabelText('Email')
    expect(input).toHaveValue('default@example.com')
    
    await user.clear(input)
    await user.type(input, 'new@example.com')
    expect(input).toHaveValue('new@example.com')
  })

  it('applies custom className', () => {
    render(<Input label="Email" className="custom-class" />)
    const container = screen.getByLabelText('Email').closest('.space-y-2')
    expect(container).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = jest.fn()
    render(<Input label="Email" ref={ref} />)
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement))
  })

  it('has correct accessibility attributes', () => {
    render(
      <Input 
        label="Email" 
        error="Invalid email"
        helpText="Enter your email"
        required 
      />
    )
    
    const input = screen.getByLabelText('Email *')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby')
    expect(input).toHaveAttribute('required')
  })

  it('shows error state correctly', () => {
    render(<Input label="Email" error="Invalid email" />)
    
    const input = screen.getByLabelText('Email')
    const errorText = screen.getByText('Invalid email')
    
    expect(input).toHaveClass('border-red-500')
    expect(errorText).toHaveClass('text-red-600')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('focuses input when label is clicked', async () => {
    const user = userEvent.setup()
    render(<Input label="Email" />)
    
    const label = screen.getByText('Email')
    const input = screen.getByLabelText('Email')
    
    await user.click(label)
    expect(input).toHaveFocus()
  })
})