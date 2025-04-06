import React from 'react';
import Item from './Item';

function ItemList({ items, onAddToFavorites, favorites, onItemClick }) {
  // Check if item is in favorites
  const isInFavorites = (itemId) => {
    return favorites.some(fav => fav.id === itemId);
  };

  return (
    <div className="items-grid">
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        items.map(item => (
          <Item
            key={item.id}
            item={item}
            onAddToFavorites={onAddToFavorites}
            isFavorite={isInFavorites(item.id)}
            onItemClick={onItemClick}
          />
        ))
      )}
    </div>
  );
}

export default ItemList;