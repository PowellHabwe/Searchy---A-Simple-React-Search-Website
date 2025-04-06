import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import ItemList from './components/ItemList';
import FavoritesList from './components/FavoritesList';
import FilterPanel from './components/FilterPanel';
import SearchHistory from './components/SearchHistory';
import ItemDetail from './components/ItemDetail';
import axios from 'axios';

function App() {

  // State management for different results types
  const [items, setItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  useEffect(() => {
    // Code Block that loads favorites from localStorage if available
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    // Code blokc that loads search history from localStorage
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
    
    // Code block that loads theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setIsDarkMode(JSON.parse(savedTheme));
      if (JSON.parse(savedTheme)) {
        document.body.classList.add('dark-theme');
      }
    }
    
    // Code block that fetches items from our mock API
    setIsLoading(true);
    axios.get('/data/items.json')
      .then(response => {
        setItems(response.data.items);
        setSearchResults(response.data.items);
        setFilteredResults(response.data.items);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  // Code Block that applies category filters to search results
  // This filters the search results by category when search results or active category changes
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredResults(searchResults);
    } else {
      const filtered = searchResults.filter(item => item.category === activeCategory);
      setFilteredResults(filtered);
    }
  }, [searchResults, activeCategory]);

  const handleSearch = (searchTerm) => {
    setCurrentSearchTerm(searchTerm);
    
    if (!searchTerm.trim()) {
      setSearchResults(items);
      return;
    }
    
    // My search algorithm 
    const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    
    const getItemScore = (item) => {
      let score = 0;
      const itemName = item.name.toLowerCase();
      const itemCategory = item.category.toLowerCase();
      const itemDesc = item.description ? item.description.toLowerCase() : '';
      
      // Check for exact matches (highest priority)
      if (itemName === searchTerm.toLowerCase()) score += 100;
      if (itemCategory === searchTerm.toLowerCase()) score += 75;
      
      // Check for full word matches
      searchWords.forEach(word => {
        // Word matches in name (high priority)
        if (itemName.includes(` ${word} `) || 
            itemName.startsWith(`${word} `) || 
            itemName.endsWith(` ${word}`) || 
            itemName === word) {
          score += 50;
        }
        
        // Word matches in category (medium priority)
        if (itemCategory.includes(` ${word} `) || 
            itemCategory.startsWith(`${word} `) || 
            itemCategory.endsWith(` ${word}`) || 
            itemCategory === word) {
          score += 30;
        }
        
        // Word matches in description (lower priority)
        if (itemDesc && (
            itemDesc.includes(` ${word} `) || 
            itemDesc.startsWith(`${word} `) || 
            itemDesc.endsWith(` ${word}`) || 
            itemDesc === word)) {
          score += 20;
        }
        
        // Partial matches
        if (itemName.includes(word)) score += 15;
        if (itemCategory.includes(word)) score += 10;
        if (itemDesc && itemDesc.includes(word)) score += 5;
      });
      
      return score;
    };
    
    // Filter and sort items based on relevance score
    const scoredItems = items
      .map(item => ({ 
        ...item, 
        score: getItemScore(item) 
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
    
    setSearchResults(scoredItems);
  };
  
  const handleAddToHistory = (term) => {
    if (term.trim() && !searchHistory.includes(term.trim())) {
      // Keep only the last 5 search terms
      const newHistory = [term.trim(), ...searchHistory.slice(0, 4)];
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };
  // Emptying of the search history by removing it from LocalSorage
  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
    showNotification('Search history cleared');
  };
  
  // Triggering a seach with the clicked term and focusing the search input
  const handleHistoryItemClick = (term) => {
    handleSearch(term);
    
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
      searchInput.value = term;
      searchInput.focus();
    }
  };

  // Adding an item to the favourites -- if its not already there,updates the local storage
  // and shows a notification
  const addToFavorites = (item) => {
    if (!favorites.some(fav => fav.id === item.id)) {
      const newFavorites = [...favorites, item];
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      
      // Show a notification
      showNotification(`Added ${item.name} to favorites!`);
    }
  };

  // Removal of a favourite item from local storage then updating the user
  const removeFromFavorites = (itemId) => {
    const itemToRemove = favorites.find(item => item.id === itemId);
    const newFavorites = favorites.filter(item => item.id !== itemId);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    // Show a notification
    if (itemToRemove) {
      showNotification(`Removed ${itemToRemove.name} from favorites`);
    }
  };

  // Resetting of the app to its initial state by removing all filters,favourites,clearing such
  const handleLogoClick = () => {
    setSearchResults(items);
    setFilteredResults(items);
    setSelectedItem(null);
    setCurrentSearchTerm('');
    setActiveCategory('All');
    // Reset search input
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
      searchInput.value = '';
    }
  };
  
  // Removal of temporal notification div ,showing it for 3 secs with a fading effect then removing it
  const showNotification = (message) => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };
  
  // Toggling the  IsDarkMode and saving it to local storage
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
  };

  // Handler for detail item click
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  // Handler to go back from item detail
  const handleBackToResults = () => {
    setSelectedItem(null);
  };

  // Get available categories based on current search results
  const getAvailableCategories = () => {
    const uniqueCategories = [...new Set(searchResults.map(item => item.category))];
    return ['All', ...uniqueCategories];
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-theme' : ''}`}>
      <header className="App-header">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <div className="logo-container" onClick={handleLogoClick}>
          <span className="logo">Searchy</span>
        </div>
        <SearchBar 
          onSearch={handleSearch} 
          onAddToHistory={handleAddToHistory}
          initialValue={currentSearchTerm} 
        />
        <SearchHistory 
          history={searchHistory} 
          onHistoryItemClick={handleHistoryItemClick}
          onClearHistory={handleClearHistory}
        />
      </header>
      <main>
        {selectedItem ? (
          <ItemDetail 
            item={selectedItem} 
            onBack={handleBackToResults} 
            onAddToFavorites={addToFavorites}
            isFavorite={favorites.some(fav => fav.id === selectedItem.id)}
            onRemoveFromFavorites={removeFromFavorites}
          />
        ) : (
          <div className="content">
            <div className="results-section">
              <FilterPanel 
                items={searchResults}
                onFilterChange={handleCategoryChange}
                availableCategories={getAvailableCategories()}
                activeCategory={activeCategory}
              />
              
              <h2>Search Results {filteredResults.length > 0 && `(${filteredResults.length})`}</h2>
              
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Searching...</p>
                </div>
              ) : filteredResults.length > 0 ? (
                <ItemList 
                  items={filteredResults} 
                  onAddToFavorites={addToFavorites} 
                  favorites={favorites}
                  onItemClick={handleItemClick}
                />
              ) : (
                <div className="no-results">
                  <h3>No results found</h3>
                  <p>Try different keywords or browse all items</p>
                  <button onClick={() => {
                    handleLogoClick();
                  }}>
                    Show All Items
                  </button>
                </div>
              )}
            </div>
            <div className="favorites-section">
              <h2>My Favorites {favorites.length > 0 && `(${favorites.length})`}</h2>
              <FavoritesList 
                favorites={favorites} 
                onRemoveFromFavorites={removeFromFavorites}
                onItemClick={handleItemClick}
              />
            </div>
          </div>
        )}
      </main>
      <footer>
        <p>© 2025 Searchy - Your Ultimate Search Tool</p>
      </footer>
    </div>
  );
}

export default App;