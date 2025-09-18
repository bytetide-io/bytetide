import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select } from '../Select'

const mockOptions = [
  { value: 'option1', label: 'Option 1', description: 'First option' },
  { value: 'option2', label: 'Option 2', description: 'Second option' },
  { value: 'option3', label: 'Option 3' },
]

describe('Select', () => {
  it('renders select with label', () => {
    render(
      <Select 
        label="Choose option" 
        value="" 
        onChange={jest.fn()} 
        options={mockOptions} 
      />
    )
    expect(screen.getByText('Choose option')).toBeInTheDocument()
  })

  it('renders required indicator', () => {
    render(
      <Select 
        label="Choose option" 
        value="" 
        onChange={jest.fn()} 
        options={mockOptions}
        required 
      />
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('displays placeholder when no value selected', () => {
    render(
      <Select 
        label="Choose option" 
        value="" 
        onChange={jest.fn()} 
        options={mockOptions}
        placeholder="Select an option"
      />
    )
    expect(screen.getByText('Select an option')).toBeInTheDocument()
  })

  it('displays selected option label', () => {
    render(
      <Select 
        label="Choose option" 
        value="option2" 
        onChange={jest.fn()} 
        options={mockOptions}
      />
    )
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('opens dropdown when clicked', async () => {
    const user = userEvent.setup()
    render(
      <Select 
        label="Choose option" 
        value="" 
        onChange={jest.fn()} 
        options={mockOptions}
      />
    )

    const selectButton = screen.getByRole('button')
    await user.click(selectButton)

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('calls onChange when option is selected', async () => {
    const handleChange = jest.fn()
    const user = userEvent.setup()
    
    render(
      <Select 
        label="Choose option" 
        value="" 
        onChange={handleChange} 
        options={mockOptions}
      />
    )

    const selectButton = screen.getByRole('button')
    await user.click(selectButton)

    const option = screen.getByText('Option 2')
    await user.click(option)

    expect(handleChange).toHaveBeenCalledWith('option2')
  })

  it('closes dropdown when option is selected', async () => {
    const user = userEvent.setup()
    render(
      <Select 
        label="Choose option" 
        value="" 
        onChange={jest.fn()} 
        options={mockOptions}
      />
    )

    const selectButton = screen.getByRole('button')
    await user.click(selectButton)

    expect(screen.getByText('Option 1')).toBeInTheDocument()

    const option = screen.getByText('Option 2')
    await user.click(option)

    expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
  })

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <Select 
          label="Choose option" 
          value="" 
          onChange={jest.fn()} 
          options={mockOptions}
        />
        <div data-testid="outside">Outside</div>
      </div>
    )

    const selectButton = screen.getByRole('button')
    await user.click(selectButton)

    expect(screen.getByText('Option 1')).toBeInTheDocument()

    const outside = screen.getByTestId('outside')
    await user.click(outside)

    expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
  })

  it('displays error message', () => {
    render(
      <Select 
        label="Choose option" 
        value="" 
        onChange={jest.fn()} 
        options={mockOptions}
        error="Please select an option"
      />
    )
    expect(screen.getByText('Please select an option')).toBeInTheDocument()
    
    const selectButton = screen.getByRole('button')
    expect(selectButton).toHaveClass('border-red-500')
  })

  it('displays help text', () => {
    render(
      <Select 
        label="Choose option" 
        value="" 
        onChange={jest.fn()} 
        options={mockOptions}
        helpText="Choose the best option for you"
      />
    )
    expect(screen.getByText('Choose the best option for you')).toBeInTheDocument()
  })

  it('renders left icon', () => {
    const LeftIcon = () => <svg data-testid="left-icon" />
    render(
      <Select 
        label="Choose option" 
        value="" 
        onChange={jest.fn()} 
        options={mockOptions}
        leftIcon={<LeftIcon />}
      />
    )
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(
      <Select 
        label="Choose option" 
        value="" 
        onChange={jest.fn()} 
        options={mockOptions}
        disabled
      />
    )
    const selectButton = screen.getByRole('button')
    expect(selectButton).toBeDisabled()
    expect(selectButton).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('supports keyboard navigation', async () => {
    const handleChange = jest.fn()
    const user = userEvent.setup()
    
    render(
      <Select 
        label="Choose option" 
        value="" 
        onChange={handleChange} 
        options={mockOptions}
      />
    )

    const selectButton = screen.getByRole('button')
    selectButton.focus()

    // Open with Enter
    await user.keyboard('{Enter}')
    expect(screen.getByText('Option 1')).toBeInTheDocument()

    // Navigate with arrow keys
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')

    expect(handleChange).toHaveBeenCalledWith('option1')
  })

  it('shows option descriptions when available', async () => {
    const user = userEvent.setup()
    render(
      <Select 
        label="Choose option" 
        value="" 
        onChange={jest.fn()} 
        options={mockOptions}
      />
    )

    const selectButton = screen.getByRole('button')
    await user.click(selectButton)

    expect(screen.getByText('First option')).toBeInTheDocument()
    expect(screen.getByText('Second option')).toBeInTheDocument()
    expect(screen.queryByText('Third option')).not.toBeInTheDocument() // Option 3 has no description
  })

  it('applies custom className', () => {
    render(
      <Select 
        label="Choose option" 
        value="" 
        onChange={jest.fn()} 
        options={mockOptions}
        className="custom-class"
      />
    )
    const container = screen.getByText('Choose option').closest('.space-y-2')
    expect(container).toHaveClass('custom-class')
  })

  it('has correct accessibility attributes', () => {
    render(
      <Select 
        label="Choose option" 
        value="option1" 
        onChange={jest.fn()} 
        options={mockOptions}
        error="Error message"
        required
      />
    )
    
    const selectButton = screen.getByRole('button')
    expect(selectButton).toHaveAttribute('aria-expanded', 'false')
    expect(selectButton).toHaveAttribute('aria-invalid', 'true')
    expect(selectButton).toHaveAttribute('aria-describedby')
    expect(selectButton).toHaveAttribute('aria-required', 'true')
  })

  it('updates aria-expanded when dropdown opens/closes', async () => {
    const user = userEvent.setup()
    render(
      <Select 
        label="Choose option" 
        value="" 
        onChange={jest.fn()} 
        options={mockOptions}
      />
    )

    const selectButton = screen.getByRole('button')
    expect(selectButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(selectButton)
    expect(selectButton).toHaveAttribute('aria-expanded', 'true')

    await user.click(selectButton)
    expect(selectButton).toHaveAttribute('aria-expanded', 'false')
  })
})