import { destinations } from './data.js';

// Mapbox API integration
let map;
let markers = [];
let currentInfoWindow = null;

// Mapbox access token
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoieC0wMDciLCJhIjoiY21hc2M2YzlyMGswejJrc2ZkcmxrczdhcCJ9.WDicPdPwfpF6W0NwUXRL8w';

/**
 * Initialize Mapbox map
 * @param {Array} destinations - Array of destination objects
 * @param {Function} callback - Callback function to run after map is initialized
 */
function initMapbox(destinations, callback) {
    
    // Initialize the map
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    
    try {
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/outdoors-v12', // Using outdoors style as default
            center: [0, 20], // Default to world view
            zoom: 2,
            attributionControl: false
        });
        
        // Make map available globally for direct access
        window.map = map;

        // Add zoom and rotation controls
        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        
        // Add attribution control
        map.addControl(new mapboxgl.AttributionControl({
            compact: true
        }));
        
        // Setup event listener for custom zoom buttons
        const zoomInBtn = document.getElementById('zoom-in');
        const zoomOutBtn = document.getElementById('zoom-out');
        
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                map.zoomIn();
            });
        }
        
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                map.zoomOut();
            });
        }

        // Wait for map to load before adding markers
        map.on('load', () => {
            // Add markers for destinations
            addMarkers(destinations);
            
            // Run callback if provided
            if (callback && typeof callback === 'function') {
                callback(map);
            }
        });
        
        // Re-add markers when style changes
        map.on('style.load', () => {
            // Skip the initial style load (when map first loads)
            if (map._loaded) {
                // Re-add all markers after a slight delay to ensure the style is fully loaded
                setTimeout(() => {
                    addMarkers(destinations);
                }, 200);
                
                console.log('Map style changed, markers reloaded');
            }
        });

        // Handle map errors
        map.on('error', (e) => {
            console.error('Mapbox error:', e);
        });
    } catch (err) {
        console.error('Error initializing map:', err);
        
        // Show error in map container
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; color: var(--primary);">
                    <h3>Map Loading Error</h3>
                    <p>${err.message}</p>
                </div>
            `;
        }
        
        // Execute callback even if map fails to load
        if (callback && typeof callback === 'function') {
            callback(null);
        }
    }
}

/**
 * Add markers to the map for each destination
 * @param {Array} destinations - Array of destination objects
 */
function addMarkers(destinations) {
    // Clear existing markers
    clearMarkers();
    
    // Add new markers
    destinations.forEach(dest => {
        if (dest.coordinates && dest.coordinates.lat && dest.coordinates.lng) {
            // Create custom marker element with primary color
        const el = document.createElement('div');
            el.className = 'custom-marker';
            el.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
            el.style.color = 'var(--primary)';
            el.style.fontSize = '32px';
            el.style.textShadow = '0 2px 4px rgba(0,0,0,0.2)';
            el.style.cursor = 'pointer';
            el.style.transition = 'transform 0.3s ease, filter 0.3s ease';
        
            // Add hover effect
        el.addEventListener('mouseenter', () => {
                el.style.transform = 'translateY(-5px) scale(1.1)';
                el.style.filter = 'drop-shadow(0 4px 4px rgba(0,0,0,0.3))';
        });
        
        el.addEventListener('mouseleave', () => {
                el.style.transform = 'translateY(0) scale(1)';
                el.style.filter = 'none';
        });
        
            // Add badge for featured/trending destinations
            if (dest.featured || dest.trending || dest.isNew) {
                const badge = document.createElement('span');
                badge.className = 'marker-badge';
                badge.style.position = 'absolute';
                badge.style.top = '-5px';
                badge.style.right = '-5px';
                badge.style.width = '14px';
                badge.style.height = '14px';
                badge.style.borderRadius = '50%';
                badge.style.border = '2px solid white';
                badge.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                
                if (dest.featured) {
                    badge.style.backgroundColor = 'var(--primary)';
                } else if (dest.trending) {
                    badge.style.backgroundColor = 'var(--warning)';
                } else if (dest.isNew) {
                    badge.style.backgroundColor = 'var(--success)';
                }
                
                el.appendChild(badge);
            }
            
            // Create and add the marker
            const marker = new mapboxgl.Marker({
                element: el,
                anchor: 'bottom'
            })
            .setLngLat([dest.coordinates.lng, dest.coordinates.lat])
            .addTo(map);
            
            // Create popup for the marker with improved styling
            const popup = new mapboxgl.Popup({
                offset: 25,
                closeButton: true,
                closeOnClick: true,
                maxWidth: '320px',
                className: 'custom-popup'
            }).setHTML(`
                    <div class="popup-content">
                    <div class="popup-header">
                        <img src="${dest.imageUrl || dest.image}" alt="${dest.name}" 
                            style="width: 100%; height: 160px; object-fit: cover; border-radius: var(--radius-md) var(--radius-md) 0 0;">
                        ${dest.featured ? '<span class="popup-badge featured">Featured</span>' : ''}
                        ${dest.trending ? '<span class="popup-badge trending">Trending</span>' : ''}
                        ${dest.isNew ? '<span class="popup-badge new">New</span>' : ''}
                    </div>
                    <div class="popup-body">
                        <h3 style="margin: 0; font-size: var(--font-size-lg); color: var(--text-primary); padding: 12px 0 4px 0;">${dest.name}</h3>
                        <p style="margin: 0 0 12px 0; font-size: var(--font-size-sm); color: var(--text-secondary);">${dest.shortDescription || dest.description.substring(0, 100) + '...'}</p>
                        <div class="popup-rating" style="display: flex; align-items: center; margin-bottom: 12px;">
                            ${generateStarRating(dest.rating)}
                            <span style="margin-left: 4px; font-size: var(--font-size-sm); color: var(--text-secondary);">${dest.rating}</span>
                        </div>
                        <button class="popup-details-btn" data-id="${dest.id}" 
                            style="background-color: var(--primary); color: white; border: none; padding: 8px 16px; 
                            border-radius: var(--radius-pill); font-weight: var(--font-weight-medium); cursor: pointer; 
                            transition: background-color 0.2s ease, transform 0.2s ease;">
                            View Details
                        </button>
                    </div>
                </div>
            `);
            
            // Customize the popup element
            popup.on('open', () => {
                // Style the popup container
                const popupEl = document.querySelector('.mapboxgl-popup-content');
            if (popupEl) {
                    popupEl.style.padding = '0';
                    popupEl.style.borderRadius = 'var(--radius-md)';
                    popupEl.style.overflow = 'hidden';
                    popupEl.style.boxShadow = 'var(--shadow-lg)';
                }
                
                // Style the close button
                const closeBtn = document.querySelector('.mapboxgl-popup-close-button');
                if (closeBtn) {
                    closeBtn.style.fontSize = '20px';
                    closeBtn.style.color = 'white';
                    closeBtn.style.top = '8px';
                    closeBtn.style.right = '8px';
                    closeBtn.style.backgroundColor = 'rgba(0,0,0,0.3)';
                    closeBtn.style.borderRadius = '50%';
                    closeBtn.style.width = '24px';
                    closeBtn.style.height = '24px';
                    closeBtn.style.display = 'flex';
                    closeBtn.style.alignItems = 'center';
                    closeBtn.style.justifyContent = 'center';
                    closeBtn.style.padding = '0';
                    closeBtn.style.lineHeight = '1';
                }
                
                // Style the view details button
                const detailsBtn = document.querySelector('.popup-details-btn');
                if (detailsBtn) {
                    detailsBtn.addEventListener('mouseenter', () => {
                        detailsBtn.style.backgroundColor = 'var(--primary-dark)';
                        detailsBtn.style.transform = 'translateY(-2px)';
                    });
                    
                    detailsBtn.addEventListener('mouseleave', () => {
                        detailsBtn.style.backgroundColor = 'var(--primary)';
                        detailsBtn.style.transform = 'translateY(0)';
                    });
                }
                
                // Style badges
                document.querySelectorAll('.popup-badge').forEach(badge => {
                    badge.style.position = 'absolute';
                    badge.style.top = '12px';
                    badge.style.left = '12px';
                    badge.style.padding = '4px 8px';
                    badge.style.borderRadius = 'var(--radius-pill)';
                    badge.style.fontSize = 'var(--font-size-xs)';
                    badge.style.fontWeight = 'var(--font-weight-bold)';
                    badge.style.textTransform = 'uppercase';
                    
                    if (badge.classList.contains('featured')) {
                        badge.style.backgroundColor = 'var(--primary)';
                        badge.style.color = 'white';
                    } else if (badge.classList.contains('trending')) {
                        badge.style.backgroundColor = 'var(--warning)';
                        badge.style.color = 'var(--text-primary)';
                    } else if (badge.classList.contains('new')) {
                        badge.style.backgroundColor = 'var(--success)';
                        badge.style.color = 'white';
                    }
        });
    });
            
            // Add popup to marker
            marker.setPopup(popup);
            
            // Add event listeners
            marker.getElement().addEventListener('click', () => {
                // Close any open popup
                if (currentInfoWindow) {
                    currentInfoWindow.remove();
                }
                
                // Set current popup
                currentInfoWindow = popup;
                
                // Pan to marker location
                map.flyTo({
                    center: [dest.coordinates.lng, dest.coordinates.lat],
                    zoom: 8,
                    essential: true,
                    duration: 1000,
                    easing: t => t * (2 - t) // Ease-out effect
                });
            });
    
            // Add marker to markers array
            markers.push(marker);
        }
    });
    
    // Add event listeners to popup details buttons
    setTimeout(() => {
        document.querySelectorAll('.popup-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const destId = btn.getAttribute('data-id');
    
                // Dispatch custom event for destination details
                document.dispatchEvent(new CustomEvent('showDetails', {
                    detail: { destinationId: destId }
                }));
            });
        });
    }, 500);
}

/**
 * Clear all markers from the map
 */
function clearMarkers() {
    markers.forEach(marker => marker.remove());
    markers = [];
}

/**
 * Filter markers by region
 * @param {string} region - Region to filter by
 */
function filterMarkersByRegion(region) {
    markers.forEach(marker => {
        const markerId = marker.getElement().querySelector('.popup-details-btn')?.getAttribute('data-id');
        const dest = findDestinationById(markerId);
        
        if (!dest) return;
        
        if (!region || dest.region === region) {
            marker.getElement().style.display = 'block';
        } else {
            marker.getElement().style.display = 'none';
        }
    });
}

/**
 * Find destination by ID
 * @param {string} id - Destination ID
 * @returns {Object} Destination object
 */
function findDestinationById(id) {
    return window.destinations?.find(d => d.id === id);
}

/**
 * Generate HTML for star rating
 * @param {number} rating - Rating value
 * @returns {string} HTML for star rating
 */
function generateStarRating(rating) {
    if (!rating) return '';
    
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let html = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star filled"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        html += '<i class="fas fa-star-half-alt filled"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star"></i>';
    }
    
    // Add numeric rating
    html += `<span class="rating-value">${rating.toFixed(1)}</span>`;
    
    return html;
}

/**
 * Highlight a specific marker on the map
 * @param {string} id - Destination ID
 */
function highlightMapMarker(id) {
    markers.forEach(marker => {
        const markerId = marker.getElement().querySelector('.popup-details-btn')?.getAttribute('data-id');
        
        if (markerId === id) {
            marker.getElement().style.transform = 'scale(1.3)';
            marker.getElement().style.zIndex = '1000';
        }
    });
}

/**
 * Reset all markers to default state
 */
function resetMapMarkers() {
    markers.forEach(marker => {
        marker.getElement().style.transform = '';
        marker.getElement().style.zIndex = '';
    });
}

/**
 * Fly to a specific destination on the map
 * @param {string} id - Destination ID
 */
function flyToDestination(id) {
    const dest = findDestinationById(id);
    
    if (dest && dest.coordinates) {
        map.flyTo({
            center: [dest.coordinates.lng, dest.coordinates.lat],
            zoom: 8,
            essential: true
        });
        
        // Open popup for this destination
        const marker = markers.find(m => {
            const markerId = m.getElement().querySelector('.popup-details-btn')?.getAttribute('data-id');
            return markerId === id;
        });
    
        if (marker) {
            setTimeout(() => {
                marker.togglePopup();
            }, 1000);
        }
    }
}

/**
 * Add a custom marker for search results
 * @param {Object} feature - GeoJSON Feature to create marker for
 * @returns {Object} - The created marker
 */
function addCustomMarker(feature) {
    if (!feature || !feature.geometry || !feature.geometry.coordinates) {
        console.error('Invalid feature for marker creation:', feature);
        return null;
    }
    
    const coords = feature.geometry.coordinates;
    const props = feature.properties || {};
    
    // Create custom marker element with red color
    const el = document.createElement('div');
    el.className = 'custom-marker search-marker';
    el.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
    el.style.color = '#E31837'; // Primary red color
    el.style.fontSize = '32px';
    el.style.filter = 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))';
    
    // Create popup content
    const name = props.name || 'Unknown Location';
    const address = props.address || '';
    const placeFormatted = props.place_formatted || '';
    
    const popupContent = `
        <div class="popup-content">
            <h3>${name}</h3>
            ${address ? `<p>${address}</p>` : ''}
            ${placeFormatted ? `<p>${placeFormatted}</p>` : ''}
            ${props.poi_category ? `<p><small>${props.poi_category.join(', ')}</small></p>` : ''}
        </div>
    `;
    
    // Create popup
    const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: true,
        className: 'custom-popup'
    }).setHTML(popupContent);
    
    // Create and add the marker
    const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    })
    .setLngLat(coords)
    .setPopup(popup)
    .addTo(map);
    
    // Store in separate array for search markers
    if (!window.searchMarkers) {
        window.searchMarkers = [];
    }
    window.searchMarkers.push(marker);
    
    return marker;
}

/**
 * Clear all search-specific markers from the map
 */
function clearSearchMarkers() {
    if (window.searchMarkers && window.searchMarkers.length) {
        window.searchMarkers.forEach(marker => marker.remove());
        window.searchMarkers = [];
    }
    }
    
// Export these functions to the window object for use in HTML
window.addCustomMarker = addCustomMarker;
window.clearMarkers = clearSearchMarkers;

// Export functions for use in other modules
export {
    initMapbox,
    map,
    addMarkers,
    clearMarkers,
    filterMarkersByRegion,
    highlightMapMarker,
    resetMapMarkers,
    flyToDestination,
    addCustomMarker,
    clearSearchMarkers,
    initMapStyles,
    createCustomMarker
};

function initMapStyles() {
  // Apply custom map styling for premium feel
  map.setStyle({
    'version': 8,
    'sources': {
      'mapbox': {
        'type': 'vector',
        'url': 'mapbox://mapbox.mapbox-streets-v8'
      }
    },
    'layers': [
      // Base land
      {
        'id': 'background',
        'type': 'background',
        'paint': {
          'background-color': '#f8f8f8'
        }
      },
      // Water
      {
        'id': 'water',
        'source': 'mapbox',
        'source-layer': 'water',
        'type': 'fill',
        'paint': {
          'fill-color': '#E6F0FF'
        }
      },
      // Land
      // ... more layers
    ]
  });
}

function createCustomMarker(destination) {
  // Create custom marker element
  const el = document.createElement('div');
  el.className = 'map-marker';
  
  // Add inner pulse effect element
  const pulse = document.createElement('div');
  pulse.className = 'marker-pulse';
  el.appendChild(pulse);
  
  // Add marker label
  const label = document.createElement('div');
  label.className = 'marker-label';
  label.textContent = destination.price || '';
  el.appendChild(label);
  
  // Create and return the marker
  return new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
    offset: [0, 0]
  })
  .setLngLat(destination.coords);
}