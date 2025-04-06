import React from 'react';

function Item({ item, onAddToFavorites, isFavorite, onItemClick }) {
  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <div className="item-card" onClick={handleItemClick}>
      <div className="category-tag">{item.category}</div>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <div className="item-actions" onClick={(e) => e.stopPropagation()}>
        {!isFavorite ? (
          <button onClick={() => onAddToFavorites(item)}>
            Add to Favorites
          </button>
        ) : (
          <span className="favorite-badge">
            ★ Added to Favorites
          </span>
        )}
      </div>
    </div>
  );
}

export default Item;