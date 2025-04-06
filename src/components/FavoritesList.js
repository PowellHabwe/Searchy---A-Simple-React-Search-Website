import React from 'react';

function FavoritesList({ favorites, onRemoveFromFavorites, onItemClick }) {
  if (favorites.length === 0) {
    return (
      <p className="no-favorites">
        No favorites added yet. Start adding items you like!
      </p>
    );
  }

  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <div className="favorites-list">
      {favorites.map(item => (
        <div 
          key={item.id} 
          className="favorite-item"
          onClick={() => handleItemClick(item)}
        >
          <h4>{item.name}</h4>
          <p>{item.category}</p>
          <p>{item.description}</p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFromFavorites(item.id);
            }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default FavoritesList;