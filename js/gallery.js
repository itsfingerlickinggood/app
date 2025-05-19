// Import gallery data
import { galleryItems, destinations } from './data.js';

// DOM Elements
let galleryContainer;
let galleryGrid;
let galleryFilters;
let currentFilter = 'all';

/**
 * Initialize gallery functionality
 */
function initGallery() {
    // Get DOM elements
    galleryContainer = document.querySelector('.travel-gallery');
    galleryGrid = document.querySelector('.gallery-grid');
    galleryFilters = document.querySelectorAll('.gallery-filter');
    
    if (!galleryContainer || !galleryGrid) {
        console.error('Gallery container elements not found');
        return;
    }
    
    // Render initial gallery
    renderGallery();
    
    // Set up event listeners
    setupEventListeners();
}

/**
 * Set up gallery event listeners
 */
function setupEventListeners() {
    // Gallery filter buttons
    galleryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Remove active class from all filters
            galleryFilters.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked filter
            filter.classList.add('active');
            
            // Update current filter
            currentFilter = filter.dataset.filter;
            
            // Render filtered gallery
            renderGallery();
        });
    });
}

/**
 * Render gallery items
 */
function renderGallery() {
    // Clear gallery grid
    galleryGrid.innerHTML = '';
    
    // Filter gallery items
    let filteredItems = [...galleryItems];
    
    if (currentFilter === 'favorites') {
        filteredItems = galleryItems.filter(item => item.isFavorite);
    } else if (currentFilter === 'recent') {
        // Sort by date (newest first) and take first 10
        filteredItems = [...galleryItems].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        }).slice(0, 10);
    }
    
    // If no items in current filter
    if (filteredItems.length === 0) {
        galleryGrid.innerHTML = `
            <div class="empty-gallery">
                <i class="fas fa-images"></i>
                <p>No photos in this category</p>
            </div>
        `;
        return;
    }
    
    // Render each gallery item
    filteredItems.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        // Get destination name
        const destination = destinations.find(d => d.id === item.destination);
        
        galleryItem.innerHTML = `
            <div class="gallery-image-container">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="gallery-overlay">
                    <h4>${item.title}</h4>
                    <p>${destination ? destination.name : ''}</p>
                    <div class="gallery-date">${formatDate(item.date)}</div>
                </div>
                <button class="favorite-btn ${item.isFavorite ? 'active' : ''}" data-id="${item.id}">
                    <i class="${item.isFavorite ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
        `;
        
        // Add to gallery grid
        galleryGrid.appendChild(galleryItem);
        
        // Add event listener for favorite button
        const favoriteBtn = galleryItem.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', () => {
            toggleFavorite(item.id, favoriteBtn);
        });
        
        // Add event listener for image click (show full screen)
        galleryItem.querySelector('img').addEventListener('click', () => {
            showFullScreen(item);
        });
    });
}

/**
 * Toggle favorite status for a gallery item
 * @param {string} id - Gallery item ID
 * @param {HTMLElement} button - Favorite button element
 */
function toggleFavorite(id, button) {
    // Find gallery item
    const itemIndex = galleryItems.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        // Toggle favorite status
        galleryItems[itemIndex].isFavorite = !galleryItems[itemIndex].isFavorite;
        
        // Update button
        if (galleryItems[itemIndex].isFavorite) {
            button.classList.add('active');
            button.querySelector('i').classList.replace('far', 'fas');
        } else {
            button.classList.remove('active');
            button.querySelector('i').classList.replace('fas', 'far');
        }
        
        // If current filter is 'favorites', re-render gallery
        if (currentFilter === 'favorites') {
            renderGallery();
        }
    }
}

/**
 * Show image in full screen
 * @param {Object} item - Gallery item
 */
function showFullScreen(item) {
    // Create full screen container
    const fullScreen = document.createElement('div');
    fullScreen.className = 'fullscreen-container';
    fullScreen.innerHTML = `
        <div class="fullscreen-content">
            <button class="close-fullscreen">&times;</button>
            <img src="${item.image}" alt="${item.title}">
            <div class="fullscreen-info">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="fullscreen-date">${formatDate(item.date)}</div>
            </div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(fullScreen);
    
    // Show full screen with animation
    setTimeout(() => {
        fullScreen.classList.add('active');
    }, 10);
    
    // Close button event
    fullScreen.querySelector('.close-fullscreen').addEventListener('click', () => {
        fullScreen.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(fullScreen);
        }, 300);
    });
    
    // Close on click outside image
    fullScreen.addEventListener('click', (e) => {
        if (e.target === fullScreen) {
            fullScreen.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(fullScreen);
            }, 300);
        }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullScreen.classList.contains('active')) {
            fullScreen.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(fullScreen);
            }, 300);
        }
    });
}

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    
    // Return formatted date (e.g., "Mar 15, 2024")
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Export functions for use in other modules
export { 
    initGallery,
    renderGallery,
    toggleFavorite,
    showFullScreen,
    formatDate
}; 