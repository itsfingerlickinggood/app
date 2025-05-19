import { destinations, regions } from './data.js';

// DOM Elements
let regionFilterButtons;
let currentRegion = null;
let filterCallback = null;

/**
 * Initialize region filters
 * @param {Function} callback - Callback function to run after region filter is applied
 */
function initRegionFilters(callback) {
    // Store callback function
    filterCallback = callback;
    
    // Find region filter buttons
    regionFilterButtons = document.querySelectorAll('.pill[data-region]');
    
    // Add event listeners to region filter buttons
    regionFilterButtons.forEach(button => {
        button.addEventListener('click', handleRegionFilterClick);
    });
}

/**
 * Handle region filter button click
 * @param {Event} e - Click event
 */
function handleRegionFilterClick(e) {
    const button = e.target.closest('.pill');
    const region = button.dataset.region;
    
    // Toggle active class on buttons
    regionFilterButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // If the same region was clicked, clear the filter
    if (currentRegion === region) {
        currentRegion = null;
    } else {
        button.classList.add('active');
        currentRegion = region;
    }
    
    // Filter destinations by region
    filterDestinationsByRegion(currentRegion);
    
    // Run callback if provided
    if (filterCallback && typeof filterCallback === 'function') {
        filterCallback(currentRegion);
    }
}

/**
 * Filter destinations by region and update UI
 * @param {string} region - Region to filter by
 */
function filterDestinationsByRegion(region) {
    // Update current region
    currentRegion = region;
            
            // Filter destinations
    const filteredDestinations = !region
        ? [...destinations]
        : destinations.filter(dest => dest.region === region);
    
    // Dispatch event for other modules
    document.dispatchEvent(new CustomEvent('destinationsFiltered', {
        detail: {
            destinations: filteredDestinations,
            region: region
        }
    }));
    
    // Return filtered destinations
    return filteredDestinations;
}

/**
 * Show destination details
 * @param {string} destinationId - ID of the destination to show
 */
function showDestinationDetail(destinationId) {
    const destination = destinations.find(dest => dest.id === destinationId);
    
    if (!destination) {
        console.error(`Destination with ID ${destinationId} not found`);
        return;
    }
    
    // Dispatch event for showing destination detail modal
    document.dispatchEvent(new CustomEvent('showDetails', {
        detail: {
            destinationId: destinationId
        }
    }));
}

/**
 * Set active region filter
 * @param {string} region - Region to set as active
 */
function setActiveRegion(region) {
    // Clear active class from all buttons
    regionFilterButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Set active class on matching button
    if (region) {
        const button = document.querySelector(`.pill[data-region="${region}"]`);
        if (button) {
            button.classList.add('active');
        }
    }
    
    // Update current region
    currentRegion = region;
    
    // Filter destinations
    return filterDestinationsByRegion(region);
}

/**
 * Get current active region
 * @returns {string} Current active region
 */
function getCurrentRegion() {
    return currentRegion;
}

/**
 * Create a destination card element
 * @param {Object} destination - Destination object
 * @returns {HTMLElement} Card element
 */
function createDestinationCard(destination) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    
    const region = regions.find(r => r.id === destination.region);
    
    card.innerHTML = `
        <img src="${destination.imageUrl}" class="card-img" alt="${destination.title}">
        <div class="card-body">
            <div class="card-region">${region ? region.emoji : ''} ${destination.region}</div>
            <h4 class="card-title">${destination.title}</h4>
            <p class="card-desc">${destination.description.substring(0, 100)}...</p>
            <div class="star-rating" data-id="${destination.id}" data-rating="${destination.rating}"></div>
            <button class="view-details" data-id="${destination.id}">View Details</button>
        </div>
    `;
    
    // Add click event for "View Details" button
    card.querySelector('.view-details').addEventListener('click', () => {
        showDestinationDetail(destination.id);
    });
    
    return card;
}

// Export functions for use in other modules
export {
    initRegionFilters,
    filterDestinationsByRegion,
    showDestinationDetail,
    setActiveRegion,
    getCurrentRegion
};