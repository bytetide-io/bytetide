'use client'

import { forwardRef } from 'react'
import clsx from 'clsx'

interface SelectOption {
  value: string
  label: string
  description?: string
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  error?: string
  helpText?: string
  leftIcon?: React.ReactNode
  placeholder?: string
  fullWidth?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      value,
      onChange,
      error,
      helpText,
      leftIcon,
      placeholder,
      fullWidth = true,
      className,
      disabled,
      required,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={clsx('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-medium text-slate-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-slate-400">{leftIcon}</div>
            </div>
          )}
          
          <select
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            required={required}
            className={clsx(
              // Base styles
              'block w-full rounded-lg border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset transition-colors',
              
              // Padding with icon
              leftIcon ? 'pl-10 pr-10' : 'px-3 pr-10',
              
              // Default state
              'ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600',
              
              // Error state
              error && 'ring-red-300 focus:ring-red-600',
              
              // Disabled state
              disabled && 'bg-slate-50 text-slate-500 cursor-not-allowed',
              
              // Custom arrow styling
              'appearance-none bg-white',
              
              className
            )}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* Help text or description for selected option */}
        {(helpText || (value && options.find(opt => opt.value === value)?.description)) && (
          <p className="text-xs text-slate-500">
            {helpText || options.find(opt => opt.value === value)?.description}
          </p>
        )}
        
        {/* Error message */}
        {error && (
          <p className="text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'