import React from 'react';

function ItemDetail({ item, onBack, onAddToFavorites, isFavorite, onRemoveFromFavorites }) {
  const handleFavoriteAction = () => {
    if (isFavorite) {
      onRemoveFromFavorites(item.id);
    } else {
      onAddToFavorites(item);
    }
  };

  return (
    <div className="item-detail-container">
      <div className="item-detail-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Results
        </button>
      </div>
      
      <div className="item-detail-content">
        <div className="item-detail-main">
          <div className="category-tag detail-tag">{item.category}</div>
          <h1 className="detail-title">{item.name}</h1>
          
          <div className="item-detail-description">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>
          
          {/* Additional details would go here */}
          <div className="item-detail-additional">
            <h3>Details</h3>
            <div className="detail-properties">
              <div className="detail-property">
                <span className="property-label">ID:</span>
                <span className="property-value">{item.id}</span>
              </div>
              {/* Add more properties as needed */}
            </div>
          </div>
        </div>
        
        <div className="item-detail-sidebar">
          <div className="detail-actions">
            <button 
              className={`favorite-button ${isFavorite ? 'remove-favorite' : 'add-favorite'}`}
              onClick={handleFavoriteAction}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;