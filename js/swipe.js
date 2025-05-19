// Import destinations data
import { destinations } from './data.js';

// DOM Elements
let cardStack;
let swipeContainer;
let likeButton;
let dislikeButton;
let infoButton;

// State variables
let currentCardIndex = 0;
let cards = [];
let userPreferences = {
    likes: [],
    dislikes: []
};
let swipeHistory = [];
let isDragging = false;
let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;

/**
 * Initialize swipe-based recommendation system
 */
function initSwipe() {
    // Get DOM elements
    cardStack = document.getElementById('recommendation-cards');
    swipeContainer = document.querySelector('.swipe-container');
    likeButton = document.querySelector('.swipe-btn.like');
    dislikeButton = document.querySelector('.swipe-btn.dislike');
    infoButton = document.querySelector('.swipe-btn.info');
    
    if (!cardStack || !swipeContainer) {
        console.error('Swipe container elements not found');
        return;
    }
    
    // Load user preferences from localStorage
    loadUserPreferences();
    
    // Create recommendation list based on preferences
    const recommendedDestinations = getRecommendedDestinations();
    
    // Create cards for each recommended destination
    createCards(recommendedDestinations);
    
    // Set up event listeners
    setupEventListeners();
}

/**
 * Create cards for the recommendation stack
 * @param {Array} destinations - Array of destination objects
 */
function createCards(destinations) {
    // Clear existing cards
    cardStack.innerHTML = '';
    cards = [];
    
    // Create cards for each destination
    destinations.forEach((dest, index) => {
        const card = document.createElement('div');
        card.className = 'swipe-card';
        card.dataset.id = dest.id;
        card.style.zIndex = destinations.length - index;
        
        // Set position absolute for all cards and stack them
        card.style.position = 'absolute';
        card.style.top = '0';
        card.style.left = '0';
        card.style.width = '100%';
        card.style.height = '100%';
        
        // Add badge if featured, trending, or new
        let badgeHTML = '';
        if (dest.featured) {
            badgeHTML = `<div class="badge featured">Featured</div>`;
        } else if (dest.trending) {
            badgeHTML = `<div class="badge trending">Trending</div>`;
        } else if (dest.isNew) {
            badgeHTML = `<div class="badge new">New</div>`;
        }
        
        // Create card content
        card.innerHTML = `
            ${badgeHTML}
            <div class="card-image" style="background-image: url('${dest.image}')"></div>
            <div class="card-overlay"></div>
            <div class="card-content">
                <h3>${dest.name}</h3>
                <p>${dest.shortDescription}</p>
                <div class="card-footer">
                    <div class="card-region">${dest.region} • ${dest.country}</div>
                    <div class="card-rating">
                        <i class="fas fa-star"></i>
                        <span>${dest.rating.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add card to stack and array
        cardStack.appendChild(card);
        cards.push(card);
        
        // Add event listeners for touch/mouse events
        addDragEvents(card);
    });
    
    // If no cards, show empty state
    if (cards.length === 0) {
        showEmptyState();
    }
}

/**
 * Add drag events to a card
 * @param {HTMLElement} card - Card element
 */
function addDragEvents(card) {
    // Mouse events
    card.addEventListener('mousedown', startDrag);
    card.addEventListener('mousemove', drag);
    card.addEventListener('mouseup', endDrag);
    card.addEventListener('mouseleave', endDrag);
    
    // Touch events
    card.addEventListener('touchstart', startDrag, { passive: true });
    card.addEventListener('touchmove', drag, { passive: false });
    card.addEventListener('touchend', endDrag);
    card.addEventListener('touchcancel', endDrag);
}

/**
 * Start drag event handler
 * @param {Event} e - Mouse or touch event
 */
function startDrag(e) {
    if (cards.length === 0) return;
    
    // Only handle the top card
    const topCard = cards[0];
    if (e.target.closest('.swipe-card') !== topCard) return;
    
    isDragging = true;
    
    // Get start position
    if (e.type === 'touchstart') {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    } else {
        startX = e.clientX;
        startY = e.clientY;
    }
    
    // Reset offset
    offsetX = 0;
    offsetY = 0;
    
    // Add dragging class
    topCard.classList.add('dragging');
}

/**
 * Drag event handler
 * @param {Event} e - Mouse or touch event
 */
function drag(e) {
    if (!isDragging || cards.length === 0) return;
    
    // Get current position
    let currentX, currentY;
    if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
        // Prevent scrolling while dragging
        e.preventDefault();
    } else {
        currentX = e.clientX;
        currentY = e.clientY;
    }
    
    // Calculate offset
    offsetX = currentX - startX;
    offsetY = currentY - startY;
    
    // Apply transform to top card
    const topCard = cards[0];
    topCard.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${offsetX * 0.1}deg)`;
    
    // Change opacity and background color based on direction
    const opacity = Math.min(Math.abs(offsetX) / 100, 0.8);
    
    if (offsetX > 0) {
        // Swiping right (like)
        topCard.style.boxShadow = `0 0 10px 5px rgba(0, 127, 79, ${opacity})`;
        likeButton.style.transform = `scale(${1 + opacity * 0.5})`;
        dislikeButton.style.transform = '';
    } else if (offsetX < 0) {
        // Swiping left (dislike)
        topCard.style.boxShadow = `0 0 10px 5px rgba(227, 24, 55, ${opacity})`;
        dislikeButton.style.transform = `scale(${1 + opacity * 0.5})`;
        likeButton.style.transform = '';
    } else {
        // Reset
        topCard.style.boxShadow = '';
        likeButton.style.transform = '';
        dislikeButton.style.transform = '';
    }
}

/**
 * End drag event handler
 */
function endDrag() {
    if (!isDragging || cards.length === 0) return;
    
    isDragging = false;
    
    // Get top card
    const topCard = cards[0];
    
    // Remove dragging class
    topCard.classList.remove('dragging');
    
    // Reset button scaling
    likeButton.style.transform = '';
    dislikeButton.style.transform = '';
    
    // Get the threshold for a swipe (half card width)
    const threshold = cardStack.offsetWidth * 0.4;
    
    if (offsetX > threshold) {
        // Swipe right (like)
        swipeCard('right');
    } else if (offsetX < -threshold) {
        // Swipe left (dislike)
        swipeCard('left');
    } else {
        // Reset position
        topCard.style.transition = 'transform 0.3s ease';
        topCard.style.transform = '';
        topCard.style.boxShadow = '';
        
        // Reset transition after animation completes
        setTimeout(() => {
            topCard.style.transition = '';
        }, 300);
    }
}

/**
 * Swipe card in specified direction
 * @param {string} direction - Direction to swipe ('left' or 'right')
 */
function swipeCard(direction) {
    if (cards.length === 0) return;
    
    // Get top card and ID
    const topCard = cards[0];
    const destId = topCard.dataset.id;
    
    // Set direction-specific properties
    const translateX = direction === 'right' ? cardStack.offsetWidth + 100 : -cardStack.offsetWidth - 100;
    const rotation = direction === 'right' ? 30 : -30;
    
    // Apply exit animation
    topCard.style.transition = 'transform 0.5s ease';
    topCard.style.transform = `translate(${translateX}px, ${offsetY}px) rotate(${rotation}deg)`;
    
    // Process swipe
    if (direction === 'right') {
        // Like
        addToLikes(destId);
    } else {
        // Dislike
        addToDislikes(destId);
    }
    
    // Add to swipe history
    swipeHistory.push({
        destId,
        direction,
        timestamp: Date.now()
    });
    
    // Remove card after animation
    setTimeout(() => {
        // Remove top card from DOM and array
        topCard.remove();
        cards.shift();
        
        // If no more cards, show empty state
        if (cards.length === 0) {
            showEmptyState();
        }
        
        // Refresh recommendations if less than 3 cards left
        if (cards.length < 3) {
            const newRecommendations = getRecommendedDestinations();
            
            // Filter out destinations already in cards
            const existingIds = cards.map(card => card.dataset.id);
            const filteredRecommendations = newRecommendations.filter(
                dest => !existingIds.includes(dest.id)
            );
            
            // Add new cards
            if (filteredRecommendations.length > 0) {
                createCards(filteredRecommendations);
            }
        }
    }, 500);
}

/**
 * Set up event listeners for swipe controls
 */
function setupEventListeners() {
    // Like button click
    likeButton.addEventListener('click', () => {
        swipeCard('right');
    });
    
    // Dislike button click
    dislikeButton.addEventListener('click', () => {
        swipeCard('left');
    });
    
    // Info button click
    infoButton.addEventListener('click', () => {
        if (cards.length === 0) return;
        
        const destId = cards[0].dataset.id;
        
        // Dispatch event to show destination details
        document.dispatchEvent(new CustomEvent('showDetails', {
            detail: { destinationId: destId }
        }));
    });
}

/**
 * Show empty state when no cards are available
 */
function showEmptyState() {
    cardStack.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-map-marker-alt"></i>
            <h3>No more destinations</h3>
            <p>We're finding new places for you to explore</p>
            <button class="reload-btn">Refresh Recommendations</button>
        </div>
    `;
    
    // Add event listener to reload button
    const reloadBtn = cardStack.querySelector('.reload-btn');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
            // Reset user preferences for testing
            userPreferences = { likes: [], dislikes: [] };
            saveUserPreferences();
            
            // Get new recommendations
            const newRecommendations = getRecommendedDestinations();
            createCards(newRecommendations);
        });
    }
}

/**
 * Add destination to likes
 * @param {string} destId - Destination ID
 */
function addToLikes(destId) {
    // Remove from dislikes if present
    userPreferences.dislikes = userPreferences.dislikes.filter(id => id !== destId);
    
    // Add to likes if not already there
    if (!userPreferences.likes.includes(destId)) {
        userPreferences.likes.push(destId);
    }
    
    // Save preferences
    saveUserPreferences();
}

/**
 * Add destination to dislikes
 * @param {string} destId - Destination ID
 */
function addToDislikes(destId) {
    // Remove from likes if present
    userPreferences.likes = userPreferences.likes.filter(id => id !== destId);
    
    // Add to dislikes if not already there
    if (!userPreferences.dislikes.includes(destId)) {
        userPreferences.dislikes.push(destId);
    }
    
    // Save preferences
    saveUserPreferences();
}

/**
 * Save user preferences to localStorage
 */
function saveUserPreferences() {
    localStorage.setItem('travelPreferences', JSON.stringify(userPreferences));
}

/**
 * Load user preferences from localStorage
 */
function loadUserPreferences() {
    const saved = localStorage.getItem('travelPreferences');
    if (saved) {
        try {
            userPreferences = JSON.parse(saved);
        } catch (e) {
            console.error('Error parsing preferences:', e);
            userPreferences = { likes: [], dislikes: [] };
        }
    } else {
        userPreferences = { likes: [], dislikes: [] };
    }
}

/**
 * Get recommended destinations based on user preferences
 * @returns {Array} Array of recommended destination objects
 */
function getRecommendedDestinations() {
    // Get liked and disliked destinations
    const likedDestinations = destinations.filter(dest => userPreferences.likes.includes(dest.id));
    
    // Create a scoring system based on user preferences
    const scores = {};
    
    // Initialize scores for all categories and regions
    destinations.forEach(dest => {
        if (dest.categories) {
            dest.categories.forEach(category => {
                if (!scores[category]) scores[category] = 0;
            });
        }
        
        if (dest.region && !scores[dest.region]) {
            scores[dest.region] = 0;
        }
    });
    
    // Increase scores for categories and regions of liked destinations
    likedDestinations.forEach(dest => {
        if (dest.categories) {
            dest.categories.forEach(category => {
                scores[category] += 1;
            });
        }
        
        if (dest.region) {
            scores[dest.region] += 1;
        }
    });
    
    // Calculate recommendation score for each destination
    const recommendations = destinations.map(dest => {
        // Skip destinations already liked or disliked
        if (userPreferences.likes.includes(dest.id) || userPreferences.dislikes.includes(dest.id)) {
            return { dest, score: -1 };
        }
        
        // Calculate score based on categories and region
        let score = 0;
        
        if (dest.categories) {
            dest.categories.forEach(category => {
                score += scores[category] || 0;
            });
        }
        
        if (dest.region) {
            score += scores[dest.region] || 0;
        }
        
        // Add bonus for trending and featured
        if (dest.trending) score += 2;
        if (dest.featured) score += 1;
        
        return { dest, score };
    });
    
    // Filter out negative scores (already liked/disliked)
    const validRecommendations = recommendations.filter(rec => rec.score >= 0);
    
    // Sort by score (highest first)
    validRecommendations.sort((a, b) => b.score - a.score);
    
    // If no preferences yet, use trending and featured as starting point
    if (userPreferences.likes.length === 0 && userPreferences.dislikes.length === 0) {
        validRecommendations.sort((a, b) => {
            // Prioritize trending and featured
            const aScore = (a.dest.trending ? 2 : 0) + (a.dest.featured ? 1 : 0);
            const bScore = (b.dest.trending ? 2 : 0) + (b.dest.featured ? 1 : 0);
            return bScore - aScore;
        });
    }
    
    // Return just the destination objects
    return validRecommendations.map(rec => rec.dest);
}

// Export functions for use in other modules
export { initSwipe }; 