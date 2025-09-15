import { forwardRef } from 'react'
import clsx from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-slate-700" htmlFor={props.id}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <div className="text-slate-400">{leftIcon}</div>
            </div>
          )}
          
          <input
            ref={ref}
            className={clsx(
              'block w-full rounded-lg border px-3 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200',
              'focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400',
              'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
              error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                : 'border-slate-200 hover:border-slate-300',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <div className="text-slate-400">{rightIcon}</div>
            </div>
          )}
        </div>
        
        {error && <p className="text-sm text-red-600">{error}</p>}
        {helpText && !error && <p className="text-sm text-slate-500">{helpText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }