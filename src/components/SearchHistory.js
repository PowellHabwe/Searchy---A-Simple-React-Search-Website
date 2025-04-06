import React from 'react';

function SearchHistory({ history, onHistoryItemClick, onClearHistory }) {
  if (history.length === 0) return null;
  
  return (
    <div className="search-history">
      <small>Recent searches: </small>
      {history.map((term, index) => (
        <span 
          key={index} 
          className="history-item"
          onClick={() => onHistoryItemClick(term)}
        >
          {term}
        </span>
      ))}
      {history.length > 0 && (
        <button 
          className="clear-history-btn"
          onClick={onClearHistory}
          title="Clear search history"
        >
          Clear
        </button>
      )}
    </div>
  );
}

export default SearchHistory;