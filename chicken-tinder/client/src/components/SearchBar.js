import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
    const [city, setCity] = useState("")
    const [price, setPrice] = useState("")

    const handleSearch = () => {
        onSearch(city, price);
    }
    
    return (
        <div className="search-container">
            <input 
            type="text"
            className="input"
            placeholder="📍 Enter your location..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            />
            <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="price-dropdown"
            >
                <option value="">Select Price</option>
                <option value="$">$</option>
                <option value="$$">$$</option>
                <option value="$$$">$$$</option>
                <option value="$$$$">$$$$</option>
            </select>
            <button 
            onClick={handleSearch}
            className="search-button"
            >
                Search
            </button>
        </div>
    );
};

export default SearchBar;