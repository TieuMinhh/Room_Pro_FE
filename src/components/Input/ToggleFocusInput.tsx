import { useState } from 'react'
import { Input } from '../ui/input'

interface ToggleFocusInputProps {
    value: string
    onChangedValue: (newValue: string) => void
    inputFontSize?: string
    [key: string]: any // for other props
}

function ToggleFocusInput({ value, onChangedValue, inputFontSize = '16px', ...props }: ToggleFocusInputProps) {
    const [inputValue, setInputValue] = useState(value)
    const [isFocused, setIsFocused] = useState(false)

    const triggerBlur = () => {
        const trimmedValue = inputValue.trim()
        setInputValue(trimmedValue)

        if (!trimmedValue || trimmedValue === value) {
            setInputValue(value)
            return
        }
        onChangedValue(trimmedValue)
    }

    return (
        <div className="w-full">
            <Input
                className={`
          w-full 
          ${isFocused ? 'bg-white dark:bg-slate-800 border-primary' : 'bg-transparent border-transparent'}
          text-[${inputFontSize}] 
          font-bold 
          px-2 
          overflow-hidden 
          whitespace-nowrap 
          text-ellipsis
          text-black dark:text-white
          focus-visible:ring-0
        `}
                value={inputValue}
                onChange={(event) => { setInputValue(event.target.value) }}
                onBlur={() => {
                    triggerBlur()
                    setIsFocused(false)
                }}
                onFocus={() => setIsFocused(true)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        triggerBlur()
                            ; (event.target as HTMLInputElement).blur()
                    }
                }}
                {...props}
            />
        </div>
    )
}

export default ToggleFocusInput