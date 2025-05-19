/**
 * carousel.js
 * Provides advanced carousel functionality for the explore nearby section
 * Features: touch/swipe support, pagination, auto-scrolling, keyboard navigation
 */

/**
 * Initialize carousel functionality
 */
export function initCarousel() {
    // Cache DOM elements
    const carouselContainers = document.querySelectorAll('.carousel-container');
    
    // Initialize each carousel on the page
    carouselContainers.forEach(container => {
        const carousel = container.querySelector('.carousel');
        const prevButton = container.querySelector('.carousel-arrow.prev');
        const nextButton = container.querySelector('.carousel-arrow.next');
        const dotsContainer = container.nextElementSibling;
        const dots = dotsContainer?.querySelectorAll('.dot');
        
        if (carousel) {
            // Initialize this carousel
            setupCarousel(carousel, prevButton, nextButton, dots);
            
            // Start auto-scroll for this carousel
            const autoScrollInterval = startAutoScroll(carousel, dots);
            
            // Stop auto-scroll on user interaction
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoScrollInterval);
            });
            
            carousel.addEventListener('mouseleave', () => {
                startAutoScroll(carousel, dots);
            });
        }
    });
}

/**
 * Set up a specific carousel with navigation and interaction
 * @param {HTMLElement} carousel - The carousel element
 * @param {HTMLElement} prevButton - Previous button
 * @param {HTMLElement} nextButton - Next button
 * @param {NodeList} dots - Pagination dots
 */
function setupCarousel(carousel, prevButton, nextButton, dots) {
    const items = carousel.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    let startX;
    let scrollLeft;
    let isDown = false;
    
    // Calculate visible items based on carousel width
    const getVisibleItems = () => {
        const carouselWidth = carousel.offsetWidth;
        const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight);
        return Math.floor(carouselWidth / itemWidth);
    };
    
    // Calculate how many indexes to skip when scrolling
    const getScrollMultiplier = () => {
        return Math.max(1, Math.floor(getVisibleItems() / 2));
    };
    
    // Previous button click
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            scrollCarousel(-getScrollMultiplier());
        });
    }
    
    // Next button click
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            scrollCarousel(getScrollMultiplier());
        });
    }
    
    // Pagination dots click
    if (dots) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                scrollToIndex(index);
                updateDots(index);
            });
        });
    }
    
    // Touch/mouse events for drag scrolling
    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('active');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        
        // Cancel any click events if dragging
        const clickCanceller = (e) => {
            e.preventDefault();
            e.stopPropagation();
            carousel.removeEventListener('click', clickCanceller, true);
        };
        carousel.addEventListener('click', clickCanceller, true);
    });
    
    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('active');
    });
    
    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('active');
        snapToNearestItem();
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // Adjust scrolling speed
        carousel.scrollLeft = scrollLeft - walk;
    });
    
    // Touch events for mobile swipe support
    carousel.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    
    carousel.addEventListener('touchend', () => {
        isDown = false;
        snapToNearestItem();
    });
    
    carousel.addEventListener('touchcancel', () => {
        isDown = false;
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });
    
    // Add keyboard navigation support
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            scrollCarousel(1);
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            scrollCarousel(-1);
            e.preventDefault();
        }
    });
    
    // Scroll carousel by a number of items
    function scrollCarousel(indexDelta) {
        const newIndex = Math.min(
            Math.max(0, currentIndex + indexDelta),
            items.length - getVisibleItems()
        );
        scrollToIndex(newIndex);
    }
    
    // Scroll to a specific index
    function scrollToIndex(index) {
        currentIndex = index;
        const targetItem = items[index];
        
        if (targetItem) {
            // Calculate scroll position with padding offset
            const containerRect = carousel.getBoundingClientRect();
            const targetRect = targetItem.getBoundingClientRect();
            const offset = targetRect.left - containerRect.left;
            
            // Smooth scroll to item
            carousel.scrollTo({
                left: carousel.scrollLeft + offset,
                behavior: 'smooth'
            });
            
            // Update dots
            updateDots(index);
        }
    }
    
    // Snap to the nearest item when scrolling ends
    function snapToNearestItem() {
        const itemWidth = items[0].offsetWidth + 
            parseInt(getComputedStyle(items[0]).marginRight);
            
        const scrollPos = carousel.scrollLeft;
        const nearestIndex = Math.round(scrollPos / itemWidth);
        
        // Get the current visible index based on scroll position
        currentIndex = Math.min(nearestIndex, items.length - 1);
        
        // Smooth scroll to the nearest item
        carousel.scrollTo({
            left: currentIndex * itemWidth,
            behavior: 'smooth'
        });
        
        // Update dots
        updateDots(currentIndex);
    }
    
    // Update active pagination dot
    function updateDots(index) {
        if (!dots) return;
        
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Handle resize event to recalculate visible items
    window.addEventListener('resize', () => {
        // Adjust current index based on new visible items count
        currentIndex = Math.min(currentIndex, items.length - getVisibleItems());
        scrollToIndex(currentIndex);
    });
    
    // Initial setup - set first item as active
    scrollToIndex(0);
}

/**
 * Start auto-scrolling for a carousel
 * @param {HTMLElement} carousel - The carousel element
 * @param {NodeList} dots - Pagination dots
 * @returns {number} - Interval ID for clearing
 */
function startAutoScroll(carousel, dots) {
    const items = carousel.querySelectorAll('.carousel-item');
    let autoScrollIndex = 0;
    
    // Calculate visible items
    const getVisibleItems = () => {
        const carouselWidth = carousel.offsetWidth;
        const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight);
        return Math.floor(carouselWidth / itemWidth);
    };
    
    // Auto-scroll interval
    return setInterval(() => {
        // Increment and loop back if needed
        autoScrollIndex++;
        if (autoScrollIndex >= items.length - getVisibleItems() + 1) {
            autoScrollIndex = 0;
        }
        
        // Scroll to the next item
        const targetItem = items[autoScrollIndex];
        if (targetItem) {
            carousel.scrollTo({
                left: targetItem.offsetLeft - carousel.offsetLeft,
                behavior: 'smooth'
            });
            
            // Update dots
            if (dots) {
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === autoScrollIndex);
                });
            }
        }
    }, 5000); // Auto-scroll every 5 seconds
} 