import React from 'react';

function FilterPanel({ onFilterChange, availableCategories, activeCategory }) {
  
  const handleFilterClick = (category) => {
    onFilterChange(category);
  };
  
  return (
    <div className="filter-panel">
      <h3>Filter by Category</h3>
      <div className="filter-options">
        {availableCategories.map(category => (
          <div 
            key={category}
            className={`filter-option ${activeCategory === category ? 'active' : ''}`}
            onClick={() => handleFilterClick(category)}
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FilterPanel;