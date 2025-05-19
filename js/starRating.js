import { destinations } from './data.js';

// Local storage key for ratings
const STORAGE_KEY = 'travel-idea-wall-ratings';

/**
 * Initialize star ratings
 * Sets up event delegation and loads saved ratings
 */
function initStarRating() {
    // Load saved ratings from localStorage
    loadSavedRatings();
    
    // Add event delegation for star ratings
    document.addEventListener('click', handleStarClick);
    document.addEventListener('mouseover', handleStarHover);
    document.addEventListener('mouseout', handleStarMouseOut);
    
    // Initialize star ratings on initial page load
    renderStarRatings();
}

/**
 * Load saved ratings from localStorage
 */
function loadSavedRatings() {
    try {
        const savedRatings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        
        // Update destinations with saved ratings
        destinations.forEach(dest => {
            if (savedRatings[dest.id] !== undefined) {
                dest.rating = savedRatings[dest.id];
            }
        });
    } catch (error) {
        console.error('Error loading saved ratings:', error);
    }
}

/**
 * Save ratings to localStorage
 */
function saveRatings() {
    try {
        const ratings = {};
        
        destinations.forEach(dest => {
            ratings[dest.id] = dest.rating;
        });
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
    } catch (error) {
        console.error('Error saving ratings:', error);
    }
}

/**
 * Handle star click event
 * @param {Event} event - Click event
 */
function handleStarClick(event) {
    const target = event.target;
    
    if (target.classList.contains('star')) {
        const ratingContainer = target.closest('.star-rating');
        if (ratingContainer) {
            const destinationId = parseInt(ratingContainer.dataset.id);
            const starValue = parseInt(target.dataset.value);
            
            // Find destination and update rating
            const destination = destinations.find(d => d.id === destinationId);
            if (destination) {
                destination.rating = starValue;
                
                // Update UI
                updateStarRating(ratingContainer, starValue);
                
                // Save to localStorage
                saveRatings();
            }
        }
    }
}

/**
 * Handle star hover event
 * @param {Event} event - Mouseover event
 */
function handleStarHover(event) {
    const target = event.target;
    
    if (target.classList.contains('star')) {
        const container = target.closest('.star-rating');
        if (container) {
            const stars = container.querySelectorAll('.star');
            const value = parseInt(target.dataset.value);
            
            // Highlight stars on hover
            stars.forEach(star => {
                const starValue = parseInt(star.dataset.value);
                if (starValue <= value) {
                    star.classList.add('hover');
                } else {
                    star.classList.remove('hover');
                }
            });
        }
    }
}

/**
 * Handle mouseout from star rating
 * @param {Event} event - Mouseout event
 */
function handleStarMouseOut(event) {
    const target = event.target;
    
    if (target.classList.contains('star') || target.closest('.star-rating')) {
        const container = target.closest('.star-rating');
        if (container) {
            const stars = container.querySelectorAll('.star');
            const currentRating = parseInt(container.dataset.rating) || 0;
            
            // Reset to current rating
            stars.forEach(star => {
                star.classList.remove('hover');
                const starValue = parseInt(star.dataset.value);
                if (starValue <= currentRating) {
                    star.classList.add('selected');
                } else {
                    star.classList.remove('selected');
                }
            });
        }
    }
}

/**
 * Create star rating element for a destination
 * @param {number} destinationId - ID of the destination
 * @param {number} currentRating - Current star rating (0-5)
 * @returns {HTMLElement} - Star rating element
 */
function createStarRating(destinationId, currentRating = 0) {
    const container = document.createElement('div');
    container.className = 'star-rating';
    container.dataset.id = destinationId;
    container.dataset.rating = currentRating;
    
    // Create 5 stars
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.dataset.value = i;
        star.innerHTML = '★';
        
        // Add 'selected' class if current rating >= star value
        if (i <= currentRating) {
            star.classList.add('selected');
        }
        
        container.appendChild(star);
    }
    
    return container;
}

/**
 * Update star rating UI
 * @param {HTMLElement} container - Star rating container
 * @param {number} rating - New rating value
 */
function updateStarRating(container, rating) {
    // Update container data attribute
    container.dataset.rating = rating;
    
    // Update star classes
    const stars = container.querySelectorAll('.star');
    stars.forEach(star => {
        const value = parseInt(star.dataset.value);
        if (value <= rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

/**
 * Render all star ratings on the page
 * Creates star rating components for all destinations in the grid
 */
function renderStarRatings() {
    // Find all star-rating containers that need to be rendered
    const starContainers = document.querySelectorAll('.star-rating[data-id]');
    
    starContainers.forEach(container => {
        const destinationId = parseInt(container.dataset.id);
        const destination = destinations.find(d => d.id === destinationId);
        
        if (destination) {
            // Clear existing content
            container.innerHTML = '';
            
            // Create stars
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('span');
                star.className = 'star';
                star.dataset.value = i;
                star.innerHTML = '★';
                
                // Add 'selected' class if destination rating >= star value
                if (i <= destination.rating) {
                    star.classList.add('selected');
                }
                
                container.appendChild(star);
            }
            
            // Update container data attribute
            container.dataset.rating = destination.rating;
        }
    });
}

export { initStarRating, createStarRating, renderStarRatings };