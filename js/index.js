// Main application entry point - handles loading all modules and initializing components

// Import all required modules
import { destinations, regions, checklistItems, tripPlans, currencyRates, galleryItems } from './data.js';
import { initMapbox } from './mapbox.js';
import { initStarRating } from './starRating.js';
import { initRegionFilters } from './regionFilters.js';
import { initSwipe } from './swipe.js';
import { initChecklist } from './checklist.js';
import { initCurrencyConverter } from './currency.js';
import { initPlanner } from './planner.js';
import { initGallery } from './gallery.js';

// App initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Travel Idea Wall application...');
    
    try {
        // Hide loading overlay and emergency error screen
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        
        // Get current page based on the HTML file
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop() || 'index.html';
        
        console.log(`Current page: ${pageName}`);
        
        // Initialize common components for all pages
        initStarRating();
        
        // Initialize page-specific components
        if (pageName === 'index.html' || pageName === '') {
            // Home page initialization
            initRegionFilters((region) => {
                // Callback when region is selected
                if (window.map) {
                    filterMarkersByRegion(region);
                }
            });
            
            // Initialize mapbox map
            if (document.getElementById('map')) {
                initMapbox(destinations);
            }
            
            // Initialize swipe interface if on home page
            if (document.getElementById('recommendation-cards')) {
                initSwipe();
            }
        } 
        else if (pageName === 'map.html') {
            // Map page initialization
            initRegionFilters((region) => {
                if (window.map) {
                    filterMarkersByRegion(region);
                }
            });
            
            if (document.getElementById('map')) {
                initMapbox(destinations);
            }
        } 
        else if (pageName === 'saved.html') {
            // Saved destinations page initialization
            initRegionFilters();
        } 
        else if (pageName === 'checklist.html') {
            // Checklist page initialization
            initChecklist();
        } 
        else if (pageName === 'currency.html') {
            // Currency converter page initialization
            initCurrencyConverter();
        } 
        else if (pageName === 'trips.html') {
            // Trip planner page initialization
            initPlanner();
        } 
        else if (pageName === 'gallery.html') {
            // Gallery page initialization
            initGallery();
        }
        
        console.log('Application initialized successfully!');
    } catch (error) {
        console.error('Error initializing application:', error);
        // Show error message
        const errorElement = document.createElement('div');
        errorElement.style.padding = '20px';
        errorElement.style.backgroundColor = '#fff';
        errorElement.style.color = '#E31837';
        errorElement.style.position = 'fixed';
        errorElement.style.top = '50%';
        errorElement.style.left = '50%';
        errorElement.style.transform = 'translate(-50%, -50%)';
        errorElement.style.borderRadius = '8px';
        errorElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        errorElement.style.zIndex = '9999';
        
        errorElement.innerHTML = `
            <h3>Application Error</h3>
            <p>${error.message}</p>
            <button onclick="location.reload()">Reload Page</button>
        `;
        
        document.body.appendChild(errorElement);
    }
}); 