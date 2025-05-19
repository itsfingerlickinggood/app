// Import currency data
import { currencyRates } from './data.js';

// DOM Elements
let converterForm;
let amountInput;
let fromCurrencySelect;
let toCurrencySelect;
let swapButton;
let resultAmount;
let conversionRate;
let conversionHistory;

// State variables
let amount = 100;
let fromCurrency = 'USD';
let toCurrency = 'EUR';
let recentConversions = [];

/**
 * Initialize currency converter
 */
function initCurrencyConverter() {
    // Get DOM elements
    converterForm = document.querySelector('.converter-form');
    amountInput = document.getElementById('amount');
    fromCurrencySelect = document.getElementById('from-currency');
    toCurrencySelect = document.getElementById('to-currency');
    swapButton = document.querySelector('.swap-btn');
    resultAmount = document.querySelector('.result-amount');
    conversionRate = document.querySelector('.conversion-rate');
    conversionHistory = document.querySelector('.conversion-history');
    
    if (!converterForm || !amountInput) {
        console.error('Currency converter elements not found');
        return;
    }
    
    // Load saved conversions
    loadSavedConversions();
    
    // Set initial values
    amountInput.value = amount;
    fromCurrencySelect.value = fromCurrency;
    toCurrencySelect.value = toCurrency;
    
    // Calculate initial conversion
    calculateConversion();
    
    // Render conversion history
    renderConversionHistory();
    
    // Set up event listeners
    setupEventListeners();
}

/**
 * Set up event listeners for currency converter
 */
function setupEventListeners() {
    // Amount input change
    amountInput.addEventListener('input', () => {
        amount = parseFloat(amountInput.value) || 0;
        calculateConversion();
    });
    
    // From currency change
    fromCurrencySelect.addEventListener('change', () => {
        fromCurrency = fromCurrencySelect.value;
        calculateConversion();
    });
    
    // To currency change
    toCurrencySelect.addEventListener('change', () => {
        toCurrency = toCurrencySelect.value;
        calculateConversion();
    });
    
    // Swap currencies
    swapButton.addEventListener('click', swapCurrencies);
}

/**
 * Calculate currency conversion
 */
function calculateConversion() {
    // Get rates for from and to currencies
    const fromRate = currencyRates[fromCurrency] || 1;
    const toRate = currencyRates[toCurrency] || 1;
    
    // Calculate conversion rate (relative to USD as base)
    const rate = toRate / fromRate;
    
    // Calculate result
    const result = amount * rate;
    
    // Update UI
    resultAmount.textContent = `${result.toFixed(2)} ${toCurrency}`;
    conversionRate.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
    
    // Add to recent conversions
    addToRecentConversions(amount, fromCurrency, result, toCurrency);
}

/**
 * Swap from and to currencies
 */
function swapCurrencies() {
    // Animation for swap button
    swapButton.classList.add('rotate');
    setTimeout(() => {
        swapButton.classList.remove('rotate');
    }, 500);
    
    // Swap currencies
    const temp = fromCurrency;
    fromCurrency = toCurrency;
    toCurrency = temp;
    
    // Update select elements
    fromCurrencySelect.value = fromCurrency;
    toCurrencySelect.value = toCurrency;
    
    // Recalculate conversion
    calculateConversion();
}

/**
 * Add conversion to recent conversions
 * @param {number} fromAmount - Amount converted from
 * @param {string} fromCurr - Currency converted from
 * @param {number} toAmount - Amount converted to
 * @param {string} toCurr - Currency converted to
 */
function addToRecentConversions(fromAmount, fromCurr, toAmount, toCurr) {
    // Create new conversion object
    const conversion = {
        id: Date.now(),
        fromAmount,
        fromCurrency: fromCurr,
        toAmount,
        toCurrency: toCurr,
        timestamp: new Date()
    };
    
    // Add to beginning of array
    recentConversions.unshift(conversion);
    
    // Limit to 5 recent conversions
    if (recentConversions.length > 5) {
        recentConversions.pop();
    }
    
    // Save to localStorage
    saveConversions();
    
    // Update UI
    renderConversionHistory();
}

/**
 * Render conversion history
 */
function renderConversionHistory() {
    // Clear existing history
    conversionHistory.innerHTML = '';
    
    // If no history
    if (recentConversions.length === 0) {
        conversionHistory.innerHTML = `
            <li class="empty-history">
                <p>No recent conversions</p>
            </li>
        `;
        return;
    }
    
    // Render each conversion
    recentConversions.forEach(conversion => {
        const listItem = document.createElement('li');
        listItem.className = 'conversion-item';
        
        // Format date
        const date = new Date(conversion.timestamp);
        const formattedDate = date.toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        listItem.innerHTML = `
            <div class="conversion-details">
                <span class="from-amount">${conversion.fromAmount.toFixed(2)} ${conversion.fromCurrency}</span>
                <i class="fas fa-arrow-right"></i>
                <span class="to-amount">${conversion.toAmount.toFixed(2)} ${conversion.toCurrency}</span>
            </div>
            <div class="conversion-time">${formattedDate}</div>
            <button class="repeat-conversion-btn" data-id="${conversion.id}">
                <i class="fas fa-redo"></i>
            </button>
        `;
        
        // Add to history
        conversionHistory.appendChild(listItem);
        
        // Add event listener to repeat button
        const repeatBtn = listItem.querySelector('.repeat-conversion-btn');
        repeatBtn.addEventListener('click', () => {
            repeatConversion(conversion);
        });
    });
}

/**
 * Repeat a previous conversion
 * @param {Object} conversion - Conversion object
 */
function repeatConversion(conversion) {
    // Set conversion values
    amount = conversion.fromAmount;
    fromCurrency = conversion.fromCurrency;
    toCurrency = conversion.toCurrency;
    
    // Update UI
    amountInput.value = amount;
    fromCurrencySelect.value = fromCurrency;
    toCurrencySelect.value = toCurrency;
    
    // Recalculate conversion
    calculateConversion();
    
    // Add animation to result
    resultAmount.classList.add('highlight');
    setTimeout(() => {
        resultAmount.classList.remove('highlight');
    }, 1500);
}

/**
 * Save conversions to localStorage
 */
function saveConversions() {
    localStorage.setItem('recentConversions', JSON.stringify(recentConversions));
}

/**
 * Load saved conversions from localStorage
 */
function loadSavedConversions() {
    const saved = localStorage.getItem('recentConversions');
    
    if (saved) {
        try {
            recentConversions = JSON.parse(saved);
        } catch (e) {
            console.error('Error parsing conversions:', e);
            recentConversions = [];
        }
    } else {
        recentConversions = [];
    }
}

/**
 * Convert a specific amount from one currency to another
 * @param {number} amt - Amount to convert
 * @param {string} from - Currency to convert from
 * @param {string} to - Currency to convert to
 * @returns {number} Converted amount
 */
function convertCurrency(amt, from, to) {
    // Get rates for from and to currencies
    const fromRate = currencyRates[from] || 1;
    const toRate = currencyRates[to] || 1;
    
    // Calculate conversion rate (relative to USD as base)
    const rate = toRate / fromRate;
    
    // Return converted amount
    return amt * rate;
}

// Export functions for use in other modules
export { 
    initCurrencyConverter, 
    convertCurrency,
    swapCurrencies,
    calculateConversion
}; 