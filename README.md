# Searchy - A Simple React Search Website

## Overview
Searchy is a ReactJS-based web application designed to allow users to search for items, view results, and manage a "Favorites" list. Built with modern React practices, it leverages hooks for state management, Axios for API simulation, and localStorage for persistence. The app meets the core requirements of searching items from an API, displaying results, maintaining a separate Favorites list, and debouncing search input.

Current Version: 1.0

## Core Requirements Met

### Search for Items from Any API
- **Implementation**: The app fetches data from a mock API endpoint (`/data/items.json`) using Axios in `App.js`. This simulates an external API, and the structure allows easy replacement with a real API by updating the axios.get URL.
- **Code Reference**: `App.js`, useEffect block

### Display Search Results
- **Implementation**: Search results are displayed in the `ItemList` component, which renders individual `Item` components in a grid. Results update dynamically based on search input and category filters.
- **Code Reference**: `App.js`

### Add Items to a "Favorites" List Displayed Separately
- **Implementation**: Users can add items to a favorites array via the "Add to Favorites" button on `Item` or `ItemDetail`. The `FavoritesList` component displays these items separately in a dedicated section, with removal functionality.
- **Code Reference**: 
  - Adding: `App.js`, `addToFavorites` function

### Debounced Search to Avoid Excessive API Calls
- **Implementation**: The `SearchBar` component debounces user input by 500ms using a useEffect hook with a timeout, preventing excessive updates. While the current setup searches a local dataset, the debouncing ensures efficiency, adaptable to real API calls.

### Use of a JSON File for Mock API
- **Implementation**: The app uses `/data/items.json` as a mock API, fetched on mount. This aligns with the instruction's flexibility to use a local JSON file.

## Additional Features
Beyond the core requirements, the app includes several enhancements:

### Voice Search
Description: Users can search using voice input via the Web Speech API (browser-dependent).

### Search History
Description: Tracks the last 5 search terms, displayed below the search bar, clickable to reuse, and clearable.

### Category Filtering
Description: Users can filter search results by category using the FilterPanel, with an "All" option

### Item Detail View
Description: Clicking an item shows a detailed view with additional info and favorite toggle.

### Notifications
Description: Temporary notifications appear for actions like adding/removing favorites or clearing history.

### Dark Mode
Description: Users can toggle between light and dark themes, persisted in localStorage.

### LocalStorage Persistence
Description: Favorites, search history, and theme preferences persist across sessions.
- **Implementation**: `App.js`, initial useEffect and update functions.

### Advanced Search Scoring
Description: A sophisticated scoring algorithm ranks search results by relevance (name, category, description).
- **Implementation**: `App.js`, handleSearch's getItemScore.

### Loading State
Description: Displays a spinner during initial data fetch.
- **Implementation**: `App.js`, conditional JSX with isLoading.

### Reset Functionality
Description: Clicking the "Searchy" logo resets the app to its initial state.

## Setup Instructions
### Prerequisites:
- Node.js and npm installed.

```
git clone <repository-url>
cd searchy
npm install
```

### Mock API Setup:
Use my json items or you can place `items.json` in `src/data/` with a structure like:

```json
{
  "items": [
    { "id": 1, "name": "Item 1", "category": "Tech", "description": "A tech item" },
    ...
  ]
}
```

### Run the App:
```
npm start
```

## Usage Guide

### 🔍 Search
Enter your query in the search bar or tap the voice icon (🎤) to search using speech. Results update automatically with a 500ms debounce to improve performance.

### 🎯 Filter
Use the Filter Panel to select a category and narrow down your results instantly.

### ⭐ Favorites
Click "Add to Favorites" on any item to save it. View or remove your favorites in the Favorites section.

### 📄 Details
Click on any search result to view more detailed information.

### 🌓 Theme Toggle
Switch between dark and light mode using the toggle button in the header.

### 🕘 Search History
Access your past searches by clicking on them, or clear your entire search history in one click.

### 🔄 Reset
Click the Searchy logo to reset the app and start fresh.