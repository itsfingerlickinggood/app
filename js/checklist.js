// Import checklist data
import { checklistItems } from './data.js';

// DOM Elements
let checklistContainer;
let checklistItemsContainer;
let addItemForm;
let newItemInput;
let itemCategorySelect;
let addItemBtn;
let categoryButtons;
let progressBar;
let progressText;

// State variables
let items = [];
let currentCategory = 'essential';
let progressPercent = 0;

/**
 * Initialize packing checklist
 */
function initChecklist() {
    // Get DOM elements
    checklistContainer = document.querySelector('.packing-checklist');
    checklistItemsContainer = document.querySelector('.checklist-items');
    addItemForm = document.querySelector('.add-item-form');
    newItemInput = document.getElementById('new-item-input');
    itemCategorySelect = document.getElementById('item-category');
    addItemBtn = document.getElementById('add-item-btn');
    categoryButtons = document.querySelectorAll('.category-btn');
    progressBar = document.querySelector('.progress-bar');
    progressText = document.querySelector('.progress-text');
    
    if (!checklistContainer || !checklistItemsContainer) {
        console.error('Checklist container elements not found');
        return;
    }
    
    // Load checklist from localStorage or use default
    loadChecklist();
    
    // Render initial checklist
    renderChecklist();
    
    // Set up event listeners
    setupEventListeners();
}

/**
 * Set up event listeners for checklist
 */
function setupEventListeners() {
    // Category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update current category
            currentCategory = button.dataset.category;
            
            // Render filtered checklist
            renderChecklist();
        });
    });
    
    // Add new item form
    addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewItem();
    });
    
    // Add item button
    addItemBtn.addEventListener('click', addNewItem);
}

/**
 * Render checklist items
 */
function renderChecklist() {
    // Clear existing items
    checklistItemsContainer.innerHTML = '';
    
    // Filter items by current category
    const filteredItems = items.filter(item => item.category === currentCategory);
    
    // If no items in current category
    if (filteredItems.length === 0) {
        checklistItemsContainer.innerHTML = `
            <div class="empty-checklist">
                <i class="fas fa-list-ul"></i>
                <p>No items in this category</p>
            </div>
        `;
        return;
    }
    
    // Render each item
    filteredItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'checklist-item';
        
        // Add checked class if item is checked
        if (item.checked) {
            itemElement.classList.add('checked');
        }
        
        itemElement.innerHTML = `
            <div class="item-checkbox">
                <input type="checkbox" id="item-${item.id}" ${item.checked ? 'checked' : ''}>
                <label for="item-${item.id}"></label>
            </div>
            <div class="item-content">
                <span class="item-name">${item.name}</span>
            </div>
            <div class="item-actions">
                <button class="delete-item-btn" data-id="${item.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        
        // Add to container
        checklistItemsContainer.appendChild(itemElement);
        
        // Add event listener to checkbox
        const checkbox = itemElement.querySelector(`#item-${item.id}`);
        checkbox.addEventListener('change', () => {
            toggleItemChecked(item.id);
        });
        
        // Add event listener to delete button
        const deleteBtn = itemElement.querySelector('.delete-item-btn');
        deleteBtn.addEventListener('click', () => {
            deleteItem(item.id);
        });
    });
}

/**
 * Add new item to checklist
 */
function addNewItem() {
    const itemName = newItemInput.value.trim();
    const category = itemCategorySelect.value;
    
    // Validate input
    if (!itemName) {
        // Shake input to indicate error
        newItemInput.classList.add('shake');
        setTimeout(() => {
            newItemInput.classList.remove('shake');
        }, 500);
        return;
    }
    
    // Generate unique ID
    const id = `item-${Date.now()}`;
    
    // Create new item
    const newItem = {
        id,
        name: itemName,
        category,
        checked: false
    };
    
    // Add to items array
    items.push(newItem);
    
    // Save to localStorage
    saveChecklist();
    
    // Clear input
    newItemInput.value = '';
    
    // Set category select to match current category
    itemCategorySelect.value = currentCategory;
    
    // Render checklist if new item is in current category
    if (category === currentCategory) {
        renderChecklist();
    }
    
    // Update progress
    updateProgress();
    
    // Add a quick confirmation
    const addedMessage = document.createElement('div');
    addedMessage.className = 'item-added-message';
    addedMessage.textContent = 'Item added';
    addedMessage.style.position = 'fixed';
    addedMessage.style.bottom = '20px';
    addedMessage.style.left = '50%';
    addedMessage.style.transform = 'translateX(-50%)';
    addedMessage.style.backgroundColor = 'var(--success)';
    addedMessage.style.color = 'var(--white)';
    addedMessage.style.padding = '8px 16px';
    addedMessage.style.borderRadius = '4px';
    addedMessage.style.zIndex = '100';
    addedMessage.style.opacity = '0';
    addedMessage.style.transition = 'opacity 0.3s ease';
    
    document.body.appendChild(addedMessage);
    
    // Show and hide message
    setTimeout(() => {
        addedMessage.style.opacity = '1';
        setTimeout(() => {
            addedMessage.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(addedMessage);
            }, 300);
        }, 2000);
    }, 0);
}

/**
 * Toggle item checked state
 * @param {string} id - Item ID
 */
function toggleItemChecked(id) {
    // Find item
    const item = items.find(item => item.id === id);
    
    if (item) {
        // Toggle checked state
        item.checked = !item.checked;
        
        // Save to localStorage
        saveChecklist();
        
        // Update progress
        updateProgress();
        
        // Get checkbox element
        const checkbox = document.querySelector(`#item-${id}`);
        const itemElement = checkbox.closest('.checklist-item');
        
        // Add/remove checked class to parent element
        if (item.checked) {
            itemElement.classList.add('checked');
        } else {
            itemElement.classList.remove('checked');
        }
    }
}

/**
 * Delete item from checklist
 * @param {string} id - Item ID
 */
function deleteItem(id) {
    // Find item index
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        // Get item element for animation
        const itemElement = document.querySelector(`.checklist-item:has(#item-${id})`);
        
        // Add remove animation
        if (itemElement) {
            itemElement.style.transition = 'all 0.3s ease';
            itemElement.style.opacity = '0';
            itemElement.style.transform = 'translateX(30px)';
            
            setTimeout(() => {
                // Remove from items array
                items.splice(itemIndex, 1);
                
                // Save to localStorage
                saveChecklist();
                
                // Update progress
                updateProgress();
                
                // Re-render checklist
                renderChecklist();
            }, 300);
        } else {
            // No animation if element not found
            items.splice(itemIndex, 1);
            saveChecklist();
            updateProgress();
            renderChecklist();
        }
    }
}

/**
 * Update progress bar and text
 */
function updateProgress() {
    const totalItems = items.length;
    const checkedItems = items.filter(item => item.checked).length;
    
    if (totalItems === 0) {
        progressPercent = 0;
    } else {
        progressPercent = Math.round((checkedItems / totalItems) * 100);
    }
    
    // Update progress bar
    progressBar.style.width = `${progressPercent}%`;
    
    // Update progress text
    progressText.textContent = `${progressPercent}% packed`;
    
    // Change color based on progress
    if (progressPercent < 30) {
        progressBar.style.backgroundColor = 'var(--primary)';
    } else if (progressPercent < 70) {
        progressBar.style.backgroundColor = 'var(--warning)';
    } else {
        progressBar.style.backgroundColor = 'var(--success)';
    }
}

/**
 * Save checklist to localStorage
 */
function saveChecklist() {
    localStorage.setItem('packingChecklist', JSON.stringify(items));
}

/**
 * Load checklist from localStorage
 */
function loadChecklist() {
    const saved = localStorage.getItem('packingChecklist');
    
    if (saved) {
        try {
            items = JSON.parse(saved);
        } catch (e) {
            console.error('Error parsing checklist:', e);
            items = [...checklistItems];
        }
    } else {
        // Use default items from data.js
        items = [...checklistItems];
    }
    
    // Update progress after loading
    updateProgress();
}

/**
 * Reset checklist to default items
 */
function resetChecklist() {
    // Reset to default items
    items = [...checklistItems];
    
    // Save to localStorage
    saveChecklist();
    
    // Update progress
    updateProgress();
    
    // Re-render checklist
    renderChecklist();
}

// Export functions for use in other modules
export { initChecklist, resetChecklist }; 