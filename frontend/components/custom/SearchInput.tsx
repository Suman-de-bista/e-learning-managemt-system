import React, { useRef, useState } from 'react'
import { Input } from '../ui/input'

interface SearchInputProps {
    placeholder?: string;
    debounceMs?: number;
    onSearch: (query: string) => void;
}

export const SearchInput = ({ placeholder = "Search...", debounceMs= 300, onSearch }: SearchInputProps) => {
    const [value, setValue] = useState('');
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value
        setValue(searchValue)

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onSearch(searchValue);
        }, debounceMs);
    }
    return (
        <div className="w-2/10">
        <Input
            type="search"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
        />
        </div>
    )
}
