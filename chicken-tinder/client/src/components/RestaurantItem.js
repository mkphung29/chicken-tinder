import React, { useState } from 'react';

const RestaurantItem = ({ restaurant }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`restaurant-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="restaurant-header" onClick={handleToggleExpand}>
        <img src={restaurant.image_url} alt={restaurant.name} className="restaurant-image" />
        <div className="restaurant-info">
          <h3>{restaurant.name}</h3>
          <div className="sub-info">
            <p>{restaurant.categories.map(category => category.title).join(', ')}</p>
            <p>Price: {restaurant.price}</p>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="expanded-details">
          <p>Rating: {restaurant.rating}</p>
          <button>Swipe Right</button>
        </div>
      )}
    </div>
  );
};

export default RestaurantItem;
