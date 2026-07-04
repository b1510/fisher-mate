import { WATER_CLARITY_OPTIONS } from '@shared/constants'
import type { WaterClarity } from '@shared/types'

interface WaterClarityPickerProps {
  value: WaterClarity | null
  onChange: (value: WaterClarity) => void
  helperText?: string
}

export function WaterClarityPicker({ value, onChange, helperText }: WaterClarityPickerProps) {
  return (
    <div>
      <div className="flex rounded-lg border border-neutral-300 dark:border-neutral-700 overflow-hidden">
        {WATER_CLARITY_OPTIONS.map((option, i) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              i > 0 ? 'border-l border-neutral-300 dark:border-neutral-700' : ''
            } ${
              value === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {helperText && (
        <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">{helperText}</p>
      )}
    </div>
  )
}
