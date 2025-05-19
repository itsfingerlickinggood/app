import { destinations } from './data.js';
import { initRegionFilters, filterDestinationsByRegion, showDestinationDetail } from './regionFilters.js';
import { initStarRating, renderStarRatings } from './starRating.js';
import { initMapbox, map, filterMarkersByRegion, addMarkers } from './mapbox.js';
import { initCarousel } from './carousel.js';
import { initModals, showDestinationModal } from './modals.js';
import { initSwipe } from './swipe.js';
import { initChecklist } from './checklist.js';
import { initCurrencyConverter } from './currency.js';
import { initPlanner } from './planner.js';
import { initGallery } from './gallery.js';

// DOM Elements
const appHeader = document.querySelector('.app-header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const closeMenuButton = document.querySelector('.close-menu-btn');
const loadingOverlay = document.querySelector('.loading-overlay');
const categoryPills = document.querySelectorAll('.category-pills .pill');
const mobilePills = document.querySelectorAll('.mobile-tabs .pill');
const themeSwitch = document.getElementById('theme-switch');
const appBody = document.body;

// App state
let currentCategory = 'all';
let currentRegion = null;
let isDarkMode = false; // Default to light mode always
let isAppLoaded = false;

/**
 * Initialize the application
 * Sets up all components and event listeners
 */
function initApp() {
    // Forcefully hide any existing loading overlay
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
    
    // Add entry animation class
    appBody.classList.add('app-entry-animation');
    
    // Show loading overlay while initializing
    showLoading();
    
    let mapInitialized = false;
    let componentsInitialized = false;
    
    // Create a timeout to ensure loading screen doesn't get stuck
    const loadingTimeout = setTimeout(() => {
        if (!isAppLoaded) {
            console.warn('Initialization taking longer than expected, forcing completion');
            hideLoading();
            triggerAppEntryAnimation();
            isAppLoaded = true;
        }
    }, 5000); // Force complete after 5 seconds
    
    // Init Mapbox with a callback when ready
    try {
        initMapbox(destinations, () => {
            mapInitialized = true;
            checkAllInitialized();
        });
    } catch (err) {
        console.error('Error initializing map:', err);
        mapInitialized = true; // Consider it "done" even if it failed
        checkAllInitialized();
    }
    
    // Init other components
    try {
        initRegionFilters(filterDestinations);
        initStarRating();
        initCarousel();
        initModals(destinations);
        initSwipe();
        initChecklist();
        initCurrencyConverter();
        initPlanner();
        initGallery();
        
        // Set up event listeners
        setupEventListeners();
        
        // Load initial destinations
        loadDestinations();
        
        componentsInitialized = true;
        checkAllInitialized();
    } catch (err) {
        console.error('Error initializing components:', err);
        componentsInitialized = true; // Consider it "done" even if it failed
        checkAllInitialized();
    }
    
    // Check if everything is initialized
    function checkAllInitialized() {
        if (mapInitialized && componentsInitialized && !isAppLoaded) {
            clearTimeout(loadingTimeout);
            
            // Apply theme
            setTheme(isDarkMode);
            
            // Hide loading overlay with a slight delay
            setTimeout(() => {
                hideLoading();
                triggerAppEntryAnimation();
                isAppLoaded = true;
            }, 500);
        }
    }
}

/**
 * Set up event listeners for user interactions
 */
function setupEventListeners() {
    // View toggle buttons
    setupViewToggle();
    
    // Map style toggle
    setupMapStyleToggle();
    
    // Category pills
    setupCategoryFilters();
    
    // Carousel navigation
    setupCarousel();
    
    // Details modal events
    setupDetailsEvents();
    
    // Mobile search toggle
    setupMobileSearch();
    
    // Header scroll effect
    window.addEventListener('scroll', handleScroll);
    
    // Mobile menu
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    closeMenuButton.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            closeMobileMenu();
        }
    });
    
    // Theme toggle - Make just cosmetic, always staying in light mode
    themeSwitch.addEventListener('change', () => {
        // Toggle the switch visually but don't change the actual theme
        isDarkMode = false; // Always remain in light mode
        setTheme(false); // Always apply light theme
        
        // Keep the switch state for visual feedback
        if (themeSwitch) {
            // Just visual toggle of the switch without affecting theme
            console.log("Theme switch toggled (visual only, staying in light mode)");
        }
    });
    
    // Initial theme state
    themeSwitch.checked = false; // Always start unchecked (light mode)
    
    // Add staggered animation to elements
    setupStaggeredAnimations();
}

/**
 * Set up view toggle between grid and map
 */
function setupViewToggle() {
    const mapFab = document.querySelector('.map-fab');
    const viewToggles = document.querySelectorAll('.view-toggles .btn');
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');
    
    // Set initial state based on viewport
    if (window.innerWidth < 992) {
        leftPanel.style.display = 'block';
        rightPanel.style.display = 'none';
    }
    
    // Toggle between grid and map views on mobile using view toggle buttons
    if (viewToggles && viewToggles.length) {
        viewToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const view = toggle.dataset.view;
                
                // Update active state on buttons
                viewToggles.forEach(btn => {
                    btn.classList.remove('active', 'btn-primary');
                    btn.classList.add('btn-secondary');
                });
                toggle.classList.add('active', 'btn-primary');
                toggle.classList.remove('btn-secondary');
                
                if (view === 'map') {
                    // Switch to map view
                    leftPanel.style.display = 'none';
                    rightPanel.style.display = 'block';
                    rightPanel.classList.add('active');
                    
                    // Refresh map when showing
                    if (window.map) {
                        setTimeout(() => window.map.resize(), 100);
                    }
                } else {
                    // Switch to list view
                    leftPanel.style.display = 'block';
                    rightPanel.style.display = 'none';
                    rightPanel.classList.remove('active');
                    
                    // Add animation to cards
                    const cards = document.querySelectorAll('.destination-card');
                    cards.forEach((card, index) => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 50);
                    });
                }
            });
        });
    }
    
    // Toggle between grid and map views using floating action button
    if (mapFab) {
    mapFab.addEventListener('click', () => {
        const isMapVisible = rightPanel.style.display === 'block';
        
        if (isMapVisible) {
            // Switch to grid view
            leftPanel.style.display = 'block';
            rightPanel.style.display = 'none';
                rightPanel.classList.remove('active');
                
                // Update toggle buttons if they exist
                if (viewToggles && viewToggles.length) {
                    viewToggles.forEach(btn => {
                        if (btn.dataset.view === 'list') {
                            btn.classList.add('active', 'btn-primary');
                            btn.classList.remove('btn-secondary');
                        } else {
                            btn.classList.remove('active', 'btn-primary');
                            btn.classList.add('btn-secondary');
                        }
                    });
                }
                
                // Add animation to cards
                const cards = document.querySelectorAll('.destination-card');
                cards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
            });
        } else {
            // Switch to map view
            leftPanel.style.display = 'none';
            rightPanel.style.display = 'block';
                rightPanel.classList.add('active');
                
                // Update toggle buttons if they exist
                if (viewToggles && viewToggles.length) {
                    viewToggles.forEach(btn => {
                        if (btn.dataset.view === 'map') {
                            btn.classList.add('active', 'btn-primary');
                            btn.classList.remove('btn-secondary');
                        } else {
                            btn.classList.remove('active', 'btn-primary');
                            btn.classList.add('btn-secondary');
                        }
                    });
                }
                
                // Refresh map when showing
                if (window.map) {
                    setTimeout(() => window.map.resize(), 100);
            }
        }
    });
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992) {
            // Reset to default two-panel layout on larger screens
            leftPanel.style.display = 'block';
            rightPanel.style.display = 'block';
            rightPanel.classList.remove('active');
        } else {
            // On smaller screens maintain current state or default to list view
            if (!rightPanel.classList.contains('active')) {
                leftPanel.style.display = 'block';
                rightPanel.style.display = 'none';
            }
        }
    });
}

/**
 * Set up map style toggle buttons
 */
function setupMapStyleToggle() {
    const outdoorsStyleBtn = document.getElementById('outdoors-style');
    const satelliteStyleBtn = document.getElementById('satellite-style');
    
    if (!outdoorsStyleBtn || !satelliteStyleBtn) return;
    
    outdoorsStyleBtn.addEventListener('click', () => {
        if (!window.map) return;
        
        // Update styles
        outdoorsStyleBtn.classList.add('active');
        satelliteStyleBtn.classList.remove('active');
        
        // Set map style
        window.map.setStyle('mapbox://styles/mapbox/outdoors-v12');
    });
    
    satelliteStyleBtn.addEventListener('click', () => {
        if (!window.map) return;
        
        // Update styles
        outdoorsStyleBtn.classList.remove('active');
        satelliteStyleBtn.classList.add('active');
        
        // Set map style
        window.map.setStyle('mapbox://styles/mapbox/satellite-streets-v12');
    });
}

/**
 * Set up category filter pills
 */
function setupCategoryFilters() {
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Remove active class from all pills
            categoryPills.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked pill
            pill.classList.add('active');
            
            // Filter by category (placeholder for now)
            const category = pill.dataset.category;
            currentCategory = category;
            
            // Update the UI
            handleCategoryClick({target: pill});
        });
    });
    
    // Mobile pills
    mobilePills.forEach((pill, index) => {
        // Set the pill index for staggered animation
        pill.style.setProperty('--pill-index', index);
        
        pill.addEventListener('click', () => {
            mobilePills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            
            // Add animation to clicked pill
            pill.style.animation = 'popSmooth 0.5s var(--easing-standard)';
            setTimeout(() => {
                pill.style.animation = '';
            }, 500);
        });
    });
}

/**
 * Set up carousel navigation
 * Note: Complex carousel interactions are now handled in carousel.js
 * This function just initializes the carousel and sets up integration 
 * with other app components
 */
function setupCarousel() {
    // Carousel is now fully initialized in carousel.js
    // Nothing additional needed here as this is handled by the initCarousel function
}

/**
 * Set up details modal events
 * Note: Most modal interactions are now handled in modals.js
 */
function setupDetailsEvents() {
    // Listen for showDetails custom event
    document.addEventListener('showDetails', (e) => {
        const destinationId = e.detail.destinationId;
        const destination = destinations.find(d => d.id === destinationId);
        
        if (destination) {
            // Use the new modals.js function instead of the old function
            showDestinationModal(destination);
        }
    });
}

/**
 * Set up mobile search toggle
 */
function setupMobileSearch() {
    const searchBox = document.querySelector('#search-box-container');
    const mapboxSearchBox = document.querySelector('mapbox-search-box');
    
    if (mapboxSearchBox) {
        // Ensure search box is bound to the map
        if (map && mapboxSearchBox.bindMap) {
            mapboxSearchBox.bindMap(map);
        }
        
        // Configure search options
        if (mapboxSearchBox.options) {
            mapboxSearchBox.options = {
                language: 'en',
                country: 'US',
                limit: 5,
                types: 'poi,address,place'
            };
        }
        
        // Search box container focus effect
        mapboxSearchBox.addEventListener('focus', () => {
            searchBox.classList.add('focused');
        });
        
        mapboxSearchBox.addEventListener('blur', () => {
            searchBox.classList.remove('focused');
        });
        
        // Success animation when a place is selected
        mapboxSearchBox.addEventListener('retrieve', (event) => {
            // Add success animation
            searchBox.classList.add('success');
            setTimeout(() => {
                searchBox.classList.remove('success');
            }, 1000);
            
            // Handle the retrieved location if needed
            const feature = event.detail;
            if (feature && feature.features && feature.features.length > 0) {
                const selectedFeature = feature.features[0];
                const coords = selectedFeature.geometry.coordinates;
                
                // Fly to the selected location
                if (map) {
                    map.flyTo({
                        center: coords,
                        zoom: 15,
                        essential: true
                    });
                    
                    // Add a marker if needed
                    if (window.addCustomMarker) {
                        window.clearMarkers && window.clearMarkers();
                        window.addCustomMarker(selectedFeature);
                    }
                }
            }
        });
    }
    
    // Mobile search toggle (for smaller screens)
    const mobileSearchToggle = document.querySelector('.mobile-search-toggle');
    if (mobileSearchToggle) {
        mobileSearchToggle.addEventListener('click', () => {
            searchBox.scrollIntoView({behavior: 'smooth'});
            setTimeout(() => {
                if (mapboxSearchBox.focus) {
                mapboxSearchBox.focus();
                }
            }, 500);
        });
    }
}

/**
 * Load initial destinations
 * Populates destination grid with all available destinations
 */
function loadDestinations() {
    // Filter destinations to show all initially
    filterDestinationsByRegion(null);
    
    // Render star ratings
    setTimeout(() => {
        renderStarRatings();
    }, 100);
}

/**
 * Handle scroll effects for the header
 */
function handleScroll() {
    if (window.scrollY > 10) {
        appHeader.classList.add('scrolled');
    } else {
        appHeader.classList.remove('scrolled');
    }
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    mobileMenuOverlay.classList.toggle('active');
    document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Handle category pill click
 * @param {Event} e - Click event
 */
function handleCategoryClick(e) {
    const category = e.target.closest('.pill').dataset.category;
    
    // Remove active class from all pills
    const pills = document.querySelectorAll('.pill');
    pills.forEach(p => p.classList.remove('active'));
    
    // Add active class to clicked pill
    e.target.closest('.pill').classList.add('active');
    
    // Update current category
    currentCategory = category;
    
    // Apply filter
    filterDestinations();
    
    // Animate the destination cards
    document.querySelectorAll('.destination-card').forEach((card, index) => {
        card.style.animation = 'none';
        // Trigger reflow
        void card.offsetWidth;
        card.style.animation = `fadeInUp 0.5s var(--easing-decelerate) forwards ${index * 0.05}s`;
    });
}

/**
 * Filter destinations based on current filters
 */
function filterDestinations() {
    let filtered = [...destinations];
    
    // Apply category filter if not "all"
    if (currentCategory && currentCategory !== 'all') {
        filtered = filtered.filter(dest => 
            dest.categories && dest.categories.includes(currentCategory)
        );
    }
    
    // Apply region filter if set
    if (currentRegion) {
        filtered = filtered.filter(dest => dest.region === currentRegion);
    }
    
    // Render filtered destinations
    renderDestinations(filtered);
    
    // Update the map (if exists)
    if (window.updateMapMarkers) {
        window.updateMapMarkers(filtered);
    }
}

/**
 * Render destinations to the grid
 * @param {Array} destinations - Array of destination objects
 */
function renderDestinations(destinations) {
    const grid = document.querySelector('.destination-grid');
    
    if (!grid) return;
    
    // Clear existing content
    grid.innerHTML = '';
    
    if (destinations.length === 0) {
        // Show empty state
        grid.innerHTML = `
            <div class="empty-state">
                <img src="https://img.icons8.com/clouds/200/000000/search.png" alt="No results">
                <h3>No destinations found</h3>
                <p>Try changing your filters or search for something else.</p>
            </div>
        `;
        return;
    }
    
    // Create cards for each destination
    destinations.forEach(dest => {
        const card = createDestinationCard(dest);
        grid.appendChild(card);
    });
    
    // Initialize star ratings on new cards
    initStarRating();
}

/**
 * Create a destination card element
 * @param {Object} dest - Destination object
 * @returns {HTMLElement} - Card element
 */
function createDestinationCard(dest) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    card.dataset.id = dest.id;
    
    // Add badge if featured or trending
    let badgeHTML = '';
    if (dest.featured) {
        badgeHTML = `<div class="badge featured">Featured</div>`;
    } else if (dest.trending) {
        badgeHTML = `<div class="badge trending">Trending</div>`;
    } else if (dest.isNew) {
        badgeHTML = `<div class="badge new">New</div>`;
    }
    
    card.innerHTML = `
        ${badgeHTML}
        <button class="favorite-btn" aria-label="Add ${dest.name} to favorites">
            <i class="far fa-heart"></i>
        </button>
        <img src="${dest.image}" alt="${dest.name}" loading="lazy">
        <div class="card-content">
            <h3>${dest.name}</h3>
            <p>${dest.shortDescription}</p>
            <div class="card-footer">
                <div class="star-rating" data-rating="${dest.rating || 0}" data-id="${dest.id}">
                    <button class="star" data-value="1" aria-label="Rate 1 star">★</button>
                    <button class="star" data-value="2" aria-label="Rate 2 stars">★</button>
                    <button class="star" data-value="3" aria-label="Rate 3 stars">★</button>
                    <button class="star" data-value="4" aria-label="Rate 4 stars">★</button>
                    <button class="star" data-value="5" aria-label="Rate 5 stars">★</button>
                </div>
                <button class="view-details" data-id="${dest.id}">Details</button>
            </div>
        </div>
    `;
    
    // Add event listener to view details button
    card.querySelector('.view-details').addEventListener('click', () => {
        const modal = document.querySelector('.detail-modal');
        if (modal && window.openModal) {
            window.openModal(dest.id);
        }
    });
    
    // Favorite button functionality
    const favoriteBtn = card.querySelector('.favorite-btn');
    
    // Check if already favorited
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favorites.includes(dest.id)) {
        favoriteBtn.classList.add('active');
        favoriteBtn.querySelector('i').classList.replace('far', 'fas');
    }
    
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(dest.id, favoriteBtn);
    });
    
    return card;
}

/**
 * Toggle favorite status for a destination
 * @param {string} id - Destination ID
 * @param {HTMLElement} btn - Favorite button element
 */
function toggleFavorite(id, btn) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.includes(id)) {
        // Remove from favorites
        favorites = favorites.filter(favId => favId !== id);
        btn.classList.remove('active');
        btn.querySelector('i').classList.replace('fas', 'far');
    } else {
        // Add to favorites
        favorites.push(id);
        btn.classList.add('active');
        btn.querySelector('i').classList.replace('far', 'fas');
        
        // Animate heart
        btn.classList.add('pop');
        setTimeout(() => btn.classList.remove('pop'), 300);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Update all instances of this destination's favorite button
    document.querySelectorAll(`.favorite-btn[data-id="${id}"]`).forEach(button => {
        if (button !== btn) {
            if (favorites.includes(id)) {
                button.classList.add('active');
                button.querySelector('i').classList.replace('far', 'fas');
            } else {
                button.classList.remove('active');
                button.querySelector('i').classList.replace('fas', 'far');
            }
        }
    });
}

/**
 * Show loading overlay
 */
function showLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        // Reset opacity first
        loadingOverlay.style.opacity = '1';
        loadingOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add a safety timeout - force hide after 5 seconds no matter what
        setTimeout(() => {
            if (loadingOverlay.style.display !== 'none') {
                hideLoading();
            }
        }, 5000);
    }
}

/**
 * Hide loading overlay with better error handling
 * @param {boolean} force - Whether to force hide immediately
 */
function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (!loadingOverlay) return;
    
    try {
        // Set opacity to 0 for fade out
        loadingOverlay.style.opacity = '0';
        console.log('Hiding loading overlay...');
        
        // Set timeout to remove after fade animation
        setTimeout(() => {
                loadingOverlay.style.display = 'none';
                document.body.style.overflow = '';
            console.log('Loading overlay hidden');
        }, 300);
    } catch (err) {
        console.error('Error hiding loading overlay:', err);
        // Fallback direct removal
            loadingOverlay.style.display = 'none';
            document.body.style.overflow = '';
    }
}

/**
 * Set theme (light/dark)
 * Always uses light theme regardless of parameter
 */
function setTheme(isDark) {
    // Always use light theme regardless of the parameter
    isDark = false;
    
    // Toggle light/dark on html element
        document.documentElement.setAttribute('data-theme', 'light');
    
    // Toggle dark theme class for body 
            if (isDark) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
                    }
    
    // Store in localStorage (always light)
    localStorage.setItem('theme', 'light');
    
    // Update UI
    updateUIForTheme(isDark);
}

/**
 * Set up staggered animations
 */
function setupStaggeredAnimations() {
    // Add staggered animations to carousel items
    const carouselItems = document.querySelectorAll('.carousel-item');
    carouselItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
    });
    
    // Add entry animations to sections
    document.querySelectorAll('.section-title').forEach((title, index) => {
        title.style.animationDelay = `${0.2 + (index * 0.1)}s`;
    });
}

/**
 * Trigger app entry animation after loading
 */
function triggerAppEntryAnimation() {
    if (!isAppLoaded) {
        appBody.classList.add('loaded');
        isAppLoaded = true;
    }
}

/**
 * Update UI elements for the given theme
 */
function updateUIForTheme(isDark) {
    // Always update for light theme
    isDark = false;
    
    // Update theme toggle visual state
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.checked = isDark;
    }
    
    // Make sure all switch labels are updated
    document.querySelectorAll('.switch-label').forEach(switchLabel => {
    if (isDark) {
            switchLabel.classList.add('dark');
    } else {
            switchLabel.classList.remove('dark');
        }
    });
    
    // Update logo if needed
    const logoImg = document.querySelector('.logo img');
    if (logoImg) {
        logoImg.src = isDark 
            ? logoImg.dataset.darkSrc || logoImg.src
            : logoImg.dataset.lightSrc || logoImg.src;
    }
    
    // Update Mapbox theme if map is loaded
    if (window.map) {
        try {
            const mapStyle = isDark 
                ? 'mapbox://styles/mapbox/dark-v11'
                : 'mapbox://styles/mapbox/outdoors-v12';
            window.map.setStyle(mapStyle);
        } catch (err) {
            console.error('Error updating map style:', err);
        }
    }
    
    // Update custom elements that may have theme-specific colors
    document.querySelectorAll('.card, .destination-card, .tool-card').forEach(card => {
        if (isDark) {
            card.classList.add('dark-theme');
        } else {
            card.classList.remove('dark-theme');
        }
    });
    
    // Update quick filters with theme-specific colors
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        if (isDark) {
            btn.classList.add('dark-theme');
        } else {
            btn.classList.remove('dark-theme');
        }
    });
    
    // Update navigation active states
    document.querySelectorAll('.main-nav a.active, .mobile-nav a.active').forEach(link => {
        if (isDark) {
            link.classList.add('dark-active');
        } else {
            link.classList.remove('dark-active');
        }
    });
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved theme preference but default to light mode
    const savedTheme = localStorage.getItem('theme');
    // Only use dark mode if explicitly set in localStorage
    isDarkMode = savedTheme === 'dark';
    
    // Apply the theme immediately to prevent flash
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    // Initialize the app
    initApp();
    
    // Force hide loading screen after 2 seconds in case something gets stuck
    setTimeout(() => {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay && loadingOverlay.style.display !== 'none') {
            console.log('Forcing loading screen to hide');
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }, 2000);
    
    // Listen for system theme changes but don't automatically apply them
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // Only apply if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            // Default to light mode always, don't sync with system preference
            isDarkMode = false;
            setTheme(isDarkMode);
        }
    });
});

// Export functions that need to be accessible from other modules
window.filterByRegion = function(region) {
    currentRegion = region;
    filterDestinations();
};

window.toggleFavorite = toggleFavorite;

function enhanceInteractions() {
  // Add hover effect to cards
  document.querySelectorAll('.destination-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const id = card.dataset.id;
      highlightMapMarker(id);
    });
    
    card.addEventListener('mouseleave', () => {
      resetMapMarkers();
    });
  });
  
  // Add scroll-based animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        entry.target.style.animationDelay = `${entry.target.dataset.index * 0.1}s`;
      }
    });
  }, {
    threshold: 0.1
  });
  
  document.querySelectorAll('.destination-card').forEach((card, index) => {
    card.dataset.index = index;
    observer.observe(card);
  });
}