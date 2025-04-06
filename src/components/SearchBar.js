import React, { useState, useEffect, useCallback, useRef } from 'react';

function SearchBar({ onSearch, onAddToHistory, initialValue = '' }) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);
  
  // Update search term if initialValue changes (for history clicks)
  useEffect(() => {
    setSearchTerm(initialValue);
    if (inputRef.current) {
      inputRef.current.value = initialValue;
    }
  }, [initialValue]);
  
  // Use useCallback to memoize the debounced search function
  const debouncedSearch = useCallback(
    (term) => {
      if (term.trim()) {
        onSearch(term);
        if (onAddToHistory) onAddToHistory(term);
      } else {
        onSearch('');
      }
    },
    [onSearch, onAddToHistory]
  );
  
  // Improved debouncing implementation
  useEffect(() => {
    const debounceTime = 500; // 500ms delay
    const handler = setTimeout(() => {
      debouncedSearch(searchTerm);
    }, debounceTime);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debouncedSearch]);
  
  // Voice search functionality
  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        if (inputRef.current) {
          inputRef.current.value = transcript;
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('Voice search is not supported in your browser.');
    }
  };
  
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    debouncedSearch(searchTerm);
  };
  
  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search items..."
        defaultValue={initialValue}
        onChange={handleInputChange}
        aria-label="Search items"
        className="search-input"
      />
      <button 
        type="button"
        className="voice-search"
        onClick={handleVoiceSearch}
        title="Search by voice"
      >
        {isListening ? '🔴' : '🎤'}
      </button>
    </form>
  );
}

export default SearchBar;