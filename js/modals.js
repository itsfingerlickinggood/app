/**
 * modals.js
 * Handles all modal interactions including opening/closing, 
 * tab switching, and interactive features within each tab
 */

/**
 * Initialize all modal functionality
 */
export function initModals() {
    // Cache DOM elements
    const modal = document.querySelector('.detail-modal');
    const modalContent = document.querySelector('.modal-content');
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeButton = document.querySelector('.modal-close');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.modal-tab-content');
    
    // Set up modal open/close events
    setupModalEvents();
    
    // Set up tab switching
    setupTabSwitching();
    
    // Set up packing list functionality
    setupPackingList();
    
    // Set up currency converter
    setupCurrencyConverter();
    
    /**
     * Set up modal events (open/close)
     */
    function setupModalEvents() {
        // Close when clicking overlay
        modalOverlay.addEventListener('click', closeModal);
        
        // Close when clicking X button
        closeButton.addEventListener('click', closeModal);
        
        // Close when pressing ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Prevent clicks inside modal content from closing modal
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    /**
     * Open the modal with animation
     */
    function openModal() {
        // Add active class to show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent body scrolling
        
        // Apply entrance animations with staggered delay
        modalContent.style.opacity = '0';
        modalContent.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            modalContent.style.opacity = '1';
            modalContent.style.transform = 'translateY(0)';
        }, 50);
        
        // Focus first interactive element for accessibility
        setTimeout(() => {
            const firstFocusable = modalContent.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 300);
    }
    
    /**
     * Close the modal with animation
     */
    function closeModal() {
        // Animate out
        modalContent.style.opacity = '0';
        modalContent.style.transform = 'translateY(20px)';
        
        // Remove active class after animation
        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore body scrolling
            
            // Reset transform for next open
            modalContent.style.transform = '';
        }, 300);
    }
    
    /**
     * Set up tab switching functionality
     */
    function setupTabSwitching() {
        tabButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                
                // Update active tab button
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
                
                // Show selected tab content with animation
                tabContents.forEach(content => {
                    const isActive = content.id === `${tabId}-tab`;
                    
                    if (isActive) {
                        content.style.opacity = '0';
                        content.classList.add('active');
                        
                        // Fade in after display change applied
                        setTimeout(() => {
                            content.style.opacity = '1';
                        }, 50);
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }
    
    /**
     * Set up packing list functionality
     */
    function setupPackingList() {
        const packingList = document.querySelector('.packing-list');
        const addItemBtn = document.querySelector('.add-item-btn');
        const addItemInput = document.querySelector('.add-item-input');
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        // Add item when clicking add button
        addItemBtn.addEventListener('click', () => {
            addPackingItem();
        });
        
        // Add item when pressing Enter in input
        addItemInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                addPackingItem();
            }
        });
        
        // Event delegation for checkbox changes and item removal
        packingList.addEventListener('change', (e) => {
            if (e.target.matches('.packing-checkbox')) {
                updatePackingProgress();
            }
        });
        
        packingList.addEventListener('click', (e) => {
            if (e.target.matches('.remove-item') || e.target.closest('.remove-item')) {
                e.target.closest('.packing-item').remove();
                updatePackingProgress();
            }
        });
        
        /**
         * Add a new packing item
         */
        function addPackingItem() {
            const itemText = addItemInput.value.trim();
            
            if (itemText) {
                const itemId = `item-${Math.random().toString(36).substr(2, 9)}`;
                const itemElement = document.createElement('div');
                itemElement.className = 'packing-item';
                itemElement.innerHTML = `
                    <input type="checkbox" id="${itemId}" class="packing-checkbox">
                    <label for="${itemId}">${itemText}</label>
                    <button class="remove-item" aria-label="Remove item">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                // Add with animation
                itemElement.style.opacity = '0';
                packingList.appendChild(itemElement);
                
                // Clear input
                addItemInput.value = '';
                
                // Focus back on input
                addItemInput.focus();
                
                // Animate in
                setTimeout(() => {
                    itemElement.style.opacity = '1';
                }, 10);
                
                // Update progress
                updatePackingProgress();
            }
        }
        
        /**
         * Update packing progress bar and text
         */
        function updatePackingProgress() {
            const totalItems = packingList.querySelectorAll('.packing-checkbox').length;
            const checkedItems = packingList.querySelectorAll('.packing-checkbox:checked').length;
            
            // Update progress text
            progressText.textContent = `${checkedItems} of ${totalItems} items packed`;
            
            // Update progress bar
            const percentage = totalItems > 0 ? (checkedItems / totalItems * 100) : 0;
            progressBar.style.width = `${percentage}%`;
            
            // Change color based on completion
            if (percentage === 100) {
                progressBar.style.backgroundColor = 'var(--success-color)';
            } else if (percentage >= 50) {
                progressBar.style.backgroundColor = 'var(--secondary-color)';
            } else {
                progressBar.style.backgroundColor = 'var(--primary-color)';
            }
        }
    }
    
    /**
     * Set up currency converter functionality
     */
    function setupCurrencyConverter() {
        const amountFrom = document.getElementById('amount-from');
        const amountTo = document.getElementById('amount-to');
        const currencyFrom = document.getElementById('currency-from');
        const currencyTo = document.getElementById('currency-to');
        const rateDisplay = document.getElementById('rate');
        const swapButton = document.querySelector('.swap-currency');
        
        // Conversion when amount changes
        amountFrom.addEventListener('input', () => {
            convertCurrency();
        });
        
        // Conversion when currency changes
        currencyFrom.addEventListener('change', () => {
            convertCurrency();
        });
        
        currencyTo.addEventListener('change', () => {
            convertCurrency();
        });
        
        // Swap currencies
        swapButton.addEventListener('click', () => {
            // Animate button rotation
            swapButton.classList.add('rotate');
            
            // Swap values
            const tempCurrency = currencyFrom.value;
            currencyFrom.value = currencyTo.value;
            currencyTo.value = tempCurrency;
            
            // Swap amounts
            const tempAmount = amountFrom.value;
            amountFrom.value = amountTo.value;
            amountTo.value = tempAmount;
            
            // Convert with new values
            convertCurrency();
            
            // Remove animation class after animation completes
            setTimeout(() => {
                swapButton.classList.remove('rotate');
            }, 500);
        });
        
        /**
         * Convert currency based on current inputs
         */
        function convertCurrency() {
            const from = currencyFrom.value;
            const to = currencyTo.value;
            const amount = parseFloat(amountFrom.value) || 0;
            
            // Get exchange rate (would typically come from API)
            const rate = getExchangeRate(from, to);
            
            // Update rate display
            rateDisplay.textContent = rate.toFixed(2);
            
            // Calculate and update result
            const result = amount * rate;
            amountTo.value = result.toFixed(2);
        }
        
        /**
         * Get exchange rate between currencies
         * In a real app, this would call an API
         * @param {string} from - From currency code
         * @param {string} to - To currency code
         * @returns {number} - Exchange rate
         */
        function getExchangeRate(from, to) {
            // Mock exchange rates (in a real app, this would come from an API)
            const rates = {
                'USD': { 'USD': 1.00, 'EUR': 0.85, 'GBP': 0.75, 'JPY': 110.5, 'IDR': 14500, 'AUD': 1.35, 'PEN': 3.9, 'TZS': 2300, 'ZAR': 15, 'CAD': 1.25, 'BRL': 5.2 },
                'EUR': { 'USD': 1.18, 'EUR': 1.00, 'GBP': 0.88, 'JPY': 130, 'IDR': 17000, 'AUD': 1.59, 'PEN': 4.6, 'TZS': 2700, 'ZAR': 17.6, 'CAD': 1.47, 'BRL': 6.1 },
                'GBP': { 'USD': 1.33, 'EUR': 1.14, 'GBP': 1.00, 'JPY': 147, 'IDR': 19000, 'AUD': 1.8, 'PEN': 5.2, 'TZS': 3100, 'ZAR': 20, 'CAD': 1.67, 'BRL': 6.9 },
                'JPY': { 'USD': 0.0091, 'EUR': 0.0077, 'GBP': 0.0068, 'JPY': 1.00, 'IDR': 130, 'AUD': 0.012, 'PEN': 0.035, 'TZS': 21, 'ZAR': 0.14, 'CAD': 0.011, 'BRL': 0.047 }
            };
            
            // Return the rate if it exists, otherwise return 1
            if (rates[from] && rates[from][to]) {
                return rates[from][to];
            }
            
            return 1;
        }
    }
}

/**
 * Show a destination in the detail modal
 * @param {Object} destination - Destination object
 */
export function showDestinationModal(destination) {
    // Get modal elements
    const modal = document.querySelector('.detail-modal');
    
    // Set header content
    const modalImage = modal.querySelector('.modal-image');
    const modalTitle = modal.querySelector('.modal-title');
    
    modalImage.src = destination.imageUrl;
    modalImage.alt = destination.title;
    modalTitle.textContent = destination.title;
    
    // Populate About tab
    populateAboutTab(destination);
    
    // Populate Packing tab
    populatePackingTab(destination);
    
    // Set up Currency tab
    setupDestinationCurrency(destination);
    
    // Switch to first tab
    const firstTab = modal.querySelector('.tab-button');
    firstTab.click();
    
    // Open the modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add fade-in animation
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    }, 50);
    
    /**
     * Populate the About tab with destination details
     * @param {Object} destination - Destination object
     */
    function populateAboutTab(destination) {
        // Set description
        const description = modal.querySelector('.modal-description');
        description.textContent = destination.description;
        
        // Set metadata
        const regionEl = modal.querySelector('.value.region');
        const countryEl = modal.querySelector('.value.country');
        const seasonEl = modal.querySelector('.value.season');
        const budgetEl = modal.querySelector('.value.budget');
        
        // Display region with emoji if available
        const regionObj = {
            'asia': { name: 'Asia', emoji: '🌏' },
            'europe': { name: 'Europe', emoji: '🏰' },
            'africa': { name: 'Africa', emoji: '🦁' },
            'north-america': { name: 'North America', emoji: '🗽' },
            'south-america': { name: 'South America', emoji: '🏝️' },
            'oceania': { name: 'Oceania', emoji: '🏄' }
        };
        
        const region = regionObj[destination.region];
        regionEl.textContent = region ? `${region.emoji} ${region.name}` : destination.region;
        
        // Set other metadata or use placeholder
        countryEl.textContent = destination.country || 'Various';
        seasonEl.textContent = destination.season || 'Year-round';
        budgetEl.textContent = destination.budget || '$$$';
        
        // Populate tags
        const tagsContainer = modal.querySelector('.tags');
        tagsContainer.innerHTML = '';
        
        // Add tags based on destination attributes
        const tags = [
            destination.region,
            destination.budget === '$' ? 'Budget' : 
            destination.budget === '$$' ? 'Mid-range' : 
            destination.budget === '$$$' ? 'Premium' : 
            destination.budget === '$$$$' ? 'Luxury' : 'Various',
            destination.title.includes('Beach') || destination.description.includes('beach') ? 'Beach' : null,
            destination.title.includes('Park') || destination.description.includes('park') ? 'Nature' : null,
            destination.title.includes('City') || destination.description.includes('city') ? 'City' : null,
            destination.title.includes('Mountain') || destination.description.includes('mountain') ? 'Mountain' : null,
            destination.title.includes('Safari') || destination.description.includes('safari') ? 'Wildlife' : null,
            destination.title.includes('Temple') || destination.description.includes('temple') ? 'Cultural' : null
        ].filter(tag => tag); // Filter out null values
        
        // Create tag elements
        tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'tag';
            tagEl.textContent = tag.charAt(0).toUpperCase() + tag.slice(1); // Capitalize
            tagsContainer.appendChild(tagEl);
        });
    }
    
    /**
     * Populate the Packing tab with destination-specific items
     * @param {Object} destination - Destination object
     */
    function populatePackingTab(destination) {
        const packingList = modal.querySelector('.packing-list');
        packingList.innerHTML = '';
        
        // Add destination-specific packing items
        if (destination.packingList && destination.packingList.length) {
            destination.packingList.forEach(item => {
                const itemId = `item-${Math.random().toString(36).substr(2, 9)}`;
                const itemEl = document.createElement('div');
                itemEl.className = 'packing-item';
                itemEl.innerHTML = `
                    <input type="checkbox" id="${itemId}" class="packing-checkbox">
                    <label for="${itemId}">${item}</label>
                    <button class="remove-item" aria-label="Remove item">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                packingList.appendChild(itemEl);
            });
        }
        
        // Update progress display
        updatePackingProgress();
    }
    
    /**
     * Update packing progress for current destination
     */
    function updatePackingProgress() {
        const packingList = modal.querySelector('.packing-list');
        const totalItems = packingList.querySelectorAll('.packing-checkbox').length;
        const checkedItems = packingList.querySelectorAll('.packing-checkbox:checked').length;
        
        // Update progress text
        const progressText = modal.querySelector('.progress-text');
        progressText.textContent = `${checkedItems} of ${totalItems} items packed`;
        
        // Update progress bar
        const progressBar = modal.querySelector('.progress-fill');
        const percentage = totalItems > 0 ? (checkedItems / totalItems * 100) : 0;
        progressBar.style.width = `${percentage}%`;
        
        // Change color based on completion
        if (percentage === 100) {
            progressBar.style.backgroundColor = 'var(--success-color)';
        } else if (percentage >= 50) {
            progressBar.style.backgroundColor = 'var(--secondary-color)';
        } else {
            progressBar.style.backgroundColor = 'var(--primary-color)';
        }
    }
    
    /**
     * Set up the Currency tab with destination-specific currency
     * @param {Object} destination - Destination object
     */
    function setupDestinationCurrency(destination) {
        // Set destination currency in dropdown
        const currencyTo = document.getElementById('currency-to');
        currencyTo.innerHTML = '';
        
        // Add destination currency option with flag
        const destOption = document.createElement('option');
        destOption.value = destination.currency || 'USD';
        destOption.textContent = `${getCurrencyFlag(destination.currency || 'USD')} ${destination.currency || 'USD'}`;
        currencyTo.appendChild(destOption);
        
        // Update currency display
        document.getElementById('dest-currency').textContent = destination.currency || 'USD';
        
        // Trigger conversion calculation
        document.getElementById('amount-from').dispatchEvent(new Event('input'));
    }
    
    /**
     * Get flag emoji for currency code
     * @param {string} currency - Currency code
     * @returns {string} - Flag emoji
     */
    function getCurrencyFlag(currency) {
        // Map currency codes to flag emojis
        const currencyFlags = {
            'USD': '🇺🇸',
            'EUR': '🇪🇺',
            'GBP': '🇬🇧',
            'JPY': '🇯🇵',
            'IDR': '🇮🇩',
            'AUD': '🇦🇺',
            'PEN': '🇵🇪',
            'TZS': '🇹🇿',
            'ZAR': '🇿🇦',
            'CAD': '🇨🇦',
            'BRL': '🇧🇷'
        };
        
        return currencyFlags[currency] || '🏳️';
    }
} 