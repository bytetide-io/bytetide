import Link from 'next/link'
import clsx from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
)

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-slate-900 text-white shadow-sm hover:bg-slate-800 focus:ring-slate-900 border-transparent',
  secondary: 'bg-white text-slate-900 shadow-sm hover:bg-slate-50 focus:ring-slate-500 border-slate-200',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-500 border-transparent',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-600 border-transparent'
}

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-3 py-1.5 text-xs font-medium',
  sm: 'px-3 py-2 text-sm font-medium',
  md: 'px-4 py-2 text-sm font-semibold',
  lg: 'px-4 py-2.5 text-base font-semibold'
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  className = clsx(
    'inline-flex items-center justify-center rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    className
  )

  const content = (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </>
  )

  if (typeof props.href === 'undefined') {
    return (
      <button className={className} disabled={isDisabled} {...props}>
        {content}
      </button>
    )
  }

  return (
    <Link className={clsx(className, isDisabled && 'pointer-events-none')} {...props}>
      {content}
    </Link>
  )
}