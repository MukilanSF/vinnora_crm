import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps<T> {
  placeholder?: string;
  data: T[];
  filter: (item: T, query: string) => boolean;
  onSelect: (item: T) => void;
  display: (item: T) => React.ReactNode;
}

function SearchBar<T>({ placeholder, data, filter, onSelect, display }: SearchBarProps<T>) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = query
    ? data.filter(item => filter(item, query)).slice(0, 8)
    : [];

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
        <Search className="w-4 h-4 text-gray-400 mr-2" />
        <input
          type="text"
          className="w-full bg-transparent outline-none text-gray-900"
          placeholder={placeholder || 'Search...'}
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        />
      </div>
      {showDropdown && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filtered.map((item, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
              onMouseDown={() => {
                onSelect(item);
                setQuery('');
                setShowDropdown(false);
              }}
            >
              {display(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;