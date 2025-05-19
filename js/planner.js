// Import trip plan data
import { tripPlans, destinations } from './data.js';

// DOM Elements
let countdownContainer;
let daysElement;
let hoursElement;
let minutesElement;
let dailyPlannerContainer;
let daySelector;
let timeline;
let addEventButton;

// State variables
let tripPlan = { ...tripPlans };
let currentDay = 2; // Default to day 2 as shown in the HTML
let countdownInterval;

/**
 * Initialize trip planner
 */
function initPlanner() {
    // Get DOM elements
    countdownContainer = document.querySelector('.countdown-timer');
    daysElement = document.querySelector('.countdown-item:nth-child(1) .count');
    hoursElement = document.querySelector('.countdown-item:nth-child(2) .count');
    minutesElement = document.querySelector('.countdown-item:nth-child(3) .count');
    dailyPlannerContainer = document.querySelector('.daily-planner');
    daySelector = document.querySelector('.day-selector');
    timeline = document.querySelector('.timeline');
    addEventButton = document.querySelector('.add-event-btn');
    
    if (!countdownContainer || !dailyPlannerContainer) {
        console.error('Trip planner elements not found');
        return;
    }
    
    // Start countdown timer
    startCountdown();
    
    // Load trip from localStorage or use default
    loadTrip();
    
    // Render initial timeline
    renderTimeline(currentDay);
    
    // Set up event listeners
    setupEventListeners();
}

/**
 * Set up event listeners for trip planner
 */
function setupEventListeners() {
    // Day selector buttons
    const dayButtons = daySelector.querySelectorAll('.day-btn');
    dayButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            dayButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get day number from button content
            if (button.textContent.includes('Day')) {
                currentDay = parseInt(button.textContent.match(/\d+/)[0]);
                renderTimeline(currentDay);
            } else if (button.textContent.includes('Add')) {
                // Add new day
                addNewDay();
            }
        });
    });
    
    // Add event button
    addEventButton.addEventListener('click', () => {
        showAddEventModal();
    });
}

/**
 * Start countdown timer
 */
function startCountdown() {
    // Update countdown immediately
    updateCountdown();
    
    // Set interval to update countdown every minute
    countdownInterval = setInterval(updateCountdown, 60000);
}

/**
 * Update countdown timer
 */
function updateCountdown() {
    const now = new Date();
    const departure = new Date(tripPlan.departureDate);
    
    // Calculate time difference in milliseconds
    const diff = departure - now;
    
    // If departure date is in the past, show 0s
    if (diff <= 0) {
        daysElement.textContent = '0';
        hoursElement.textContent = '0';
        minutesElement.textContent = '0';
        return;
    }
    
    // Calculate days, hours, minutes
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    // Update UI
    daysElement.textContent = days;
    hoursElement.textContent = hours;
    minutesElement.textContent = minutes;
    
    // Add animation to changing elements
    if (parseInt(daysElement.dataset.last) !== days) {
        animateCountdownChange(daysElement, days);
    }
    
    if (parseInt(hoursElement.dataset.last) !== hours) {
        animateCountdownChange(hoursElement, hours);
    }
    
    if (parseInt(minutesElement.dataset.last) !== minutes) {
        animateCountdownChange(minutesElement, minutes);
    }
}

/**
 * Animate countdown number change
 * @param {HTMLElement} element - DOM element to animate
 * @param {number} newValue - New value to display
 */
function animateCountdownChange(element, newValue) {
    // Add animation class
    element.classList.add('animate');
    
    // Update last value
    element.dataset.last = newValue;
    
    // Remove animation class after animation completes
    setTimeout(() => {
        element.classList.remove('animate');
    }, 500);
}

/**
 * Render timeline for selected day
 * @param {number} day - Day number
 */
function renderTimeline(day) {
    // Clear timeline
    timeline.innerHTML = '';
    
    // Find day in trip plan
    const dayPlan = tripPlan.days.find(d => d.day === day);
    
    // If day not found or no events
    if (!dayPlan || dayPlan.events.length === 0) {
        timeline.innerHTML = `
            <div class="empty-timeline">
                <i class="fas fa-calendar-alt"></i>
                <p>No events planned for Day ${day}</p>
            </div>
        `;
        return;
    }
    
    // Sort events by time
    const sortedEvents = [...dayPlan.events].sort((a, b) => {
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });
    
    // Render each event
    sortedEvents.forEach((event, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        // Format time
        const [hours, minutes] = event.time.split(':').map(Number);
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        timelineItem.innerHTML = `
            <div class="timeline-time">${formattedTime}</div>
            <div class="timeline-content">
                <h4>${event.title}</h4>
                <p>${event.description}</p>
                <div class="timeline-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
                <div class="timeline-duration">
                    <i class="fas fa-clock"></i>
                    <span>${event.duration} min</span>
                </div>
            </div>
            <div class="timeline-actions">
                <button class="edit-event-btn" data-id="${event.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-event-btn" data-id="${event.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        
        // Add to timeline
        timeline.appendChild(timelineItem);
        
        // Add connecting line except for last item
        if (index < sortedEvents.length - 1) {
            const connector = document.createElement('div');
            connector.className = 'timeline-connector';
            timeline.appendChild(connector);
        }
        
        // Add event listeners
        const editBtn = timelineItem.querySelector('.edit-event-btn');
        editBtn.addEventListener('click', () => {
            editEvent(event, day);
        });
        
        const deleteBtn = timelineItem.querySelector('.delete-event-btn');
        deleteBtn.addEventListener('click', () => {
            deleteEvent(event.id, day);
        });
    });
}

/**
 * Add new day to trip plan
 */
function addNewDay() {
    // Get highest day number
    const maxDay = Math.max(...tripPlan.days.map(d => d.day));
    
    // Create new day
    const newDay = {
        day: maxDay + 1,
        date: calculateDate(maxDay + 1),
        events: []
    };
    
    // Add new day to trip plan
    tripPlan.days.push(newDay);
    
    // Save trip plan
    saveTrip();
    
    // Create and add new day button
    const dayBtn = document.createElement('button');
    dayBtn.className = 'day-btn';
    dayBtn.textContent = `Day ${newDay.day}`;
    
    // Insert before the + Add button
    const addBtn = daySelector.querySelector('.day-btn:last-child');
    daySelector.insertBefore(dayBtn, addBtn);
    
    // Add event listener
    dayBtn.addEventListener('click', () => {
        // Remove active class from all buttons
        daySelector.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('active'));
        
        // Add active class to this button
        dayBtn.classList.add('active');
        
        // Update current day and render timeline
        currentDay = newDay.day;
        renderTimeline(currentDay);
    });
    
    // Trigger click on new day button
    dayBtn.click();
    
    // Add animation
    dayBtn.style.animation = 'popIn 0.5s ease';
}

/**
 * Calculate date for a day number
 * @param {number} day - Day number
 * @returns {string} Date string in ISO format
 */
function calculateDate(day) {
    const departureDate = new Date(tripPlan.departureDate);
    const date = new Date(departureDate);
    date.setDate(date.getDate() + (day - 1));
    return date.toISOString().split('T')[0];
}

/**
 * Show modal to add new event
 */
function showAddEventModal() {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal event-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <div class="modal-body">
                <h3>Add New Event</h3>
                <form id="add-event-form">
                    <div class="form-group">
                        <label for="event-time">Time</label>
                        <input type="time" id="event-time" required>
                    </div>
                    <div class="form-group">
                        <label for="event-title">Title</label>
                        <input type="text" id="event-title" placeholder="Event title" required>
                    </div>
                    <div class="form-group">
                        <label for="event-description">Description</label>
                        <textarea id="event-description" placeholder="Event description"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="event-location">Location</label>
                        <input type="text" id="event-location" placeholder="Event location">
                    </div>
                    <div class="form-group">
                        <label for="event-duration">Duration (minutes)</label>
                        <input type="number" id="event-duration" value="60" min="15" step="15">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="cancel-btn">Cancel</button>
                        <button type="submit" class="save-btn">Save Event</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Close button event
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        closeModal(modal);
    });
    
    // Cancel button event
    const cancelBtn = modal.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
        closeModal(modal);
    });
    
    // Form submit event
    const form = modal.querySelector('#add-event-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const time = document.getElementById('event-time').value;
        const title = document.getElementById('event-title').value;
        const description = document.getElementById('event-description').value;
        const location = document.getElementById('event-location').value;
        const duration = parseInt(document.getElementById('event-duration').value);
        
        // Create new event
        const newEvent = {
            id: `event-${Date.now()}`,
            time,
            title,
            description,
            location,
            duration
        };
        
        // Add event to current day
        addEvent(newEvent, currentDay);
        
        // Close modal
        closeModal(modal);
    });
}

/**
 * Edit existing event
 * @param {Object} event - Event object
 * @param {number} day - Day number
 */
function editEvent(event, day) {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal event-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <div class="modal-body">
                <h3>Edit Event</h3>
                <form id="edit-event-form">
                    <div class="form-group">
                        <label for="event-time">Time</label>
                        <input type="time" id="event-time" value="${event.time}" required>
                    </div>
                    <div class="form-group">
                        <label for="event-title">Title</label>
                        <input type="text" id="event-title" value="${event.title}" placeholder="Event title" required>
                    </div>
                    <div class="form-group">
                        <label for="event-description">Description</label>
                        <textarea id="event-description" placeholder="Event description">${event.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="event-location">Location</label>
                        <input type="text" id="event-location" value="${event.location}" placeholder="Event location">
                    </div>
                    <div class="form-group">
                        <label for="event-duration">Duration (minutes)</label>
                        <input type="number" id="event-duration" value="${event.duration}" min="15" step="15">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="cancel-btn">Cancel</button>
                        <button type="submit" class="save-btn">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Close button event
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        closeModal(modal);
    });
    
    // Cancel button event
    const cancelBtn = modal.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', () => {
        closeModal(modal);
    });
    
    // Form submit event
    const form = modal.querySelector('#edit-event-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const time = document.getElementById('event-time').value;
        const title = document.getElementById('event-title').value;
        const description = document.getElementById('event-description').value;
        const location = document.getElementById('event-location').value;
        const duration = parseInt(document.getElementById('event-duration').value);
        
        // Update event
        updateEvent(event.id, { time, title, description, location, duration }, day);
        
        // Close modal
        closeModal(modal);
    });
}

/**
 * Close modal
 * @param {HTMLElement} modal - Modal element
 */
function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
}

/**
 * Add event to day
 * @param {Object} event - Event object
 * @param {number} day - Day number
 */
function addEvent(event, day) {
    // Find day in trip plan
    const dayPlan = tripPlan.days.find(d => d.day === day);
    
    if (dayPlan) {
        // Add event to day
        dayPlan.events.push(event);
        
        // Save trip plan
        saveTrip();
        
        // Render timeline
        renderTimeline(day);
    }
}

/**
 * Update event
 * @param {string} eventId - Event ID
 * @param {Object} updatedEvent - Updated event data
 * @param {number} day - Day number
 */
function updateEvent(eventId, updatedEvent, day) {
    // Find day in trip plan
    const dayPlan = tripPlan.days.find(d => d.day === day);
    
    if (dayPlan) {
        // Find event index
        const eventIndex = dayPlan.events.findIndex(e => e.id === eventId);
        
        if (eventIndex !== -1) {
            // Update event
            dayPlan.events[eventIndex] = {
                ...dayPlan.events[eventIndex],
                ...updatedEvent
            };
            
            // Save trip plan
            saveTrip();
            
            // Render timeline
            renderTimeline(day);
        }
    }
}

/**
 * Delete event
 * @param {string} eventId - Event ID
 * @param {number} day - Day number
 */
function deleteEvent(eventId, day) {
    // Find day in trip plan
    const dayPlan = tripPlan.days.find(d => d.day === day);
    
    if (dayPlan) {
        // Find event index
        const eventIndex = dayPlan.events.findIndex(e => e.id === eventId);
        
        if (eventIndex !== -1) {
            // Remove event
            dayPlan.events.splice(eventIndex, 1);
            
            // Save trip plan
            saveTrip();
            
            // Render timeline
            renderTimeline(day);
        }
    }
}

/**
 * Save trip plan to localStorage
 */
function saveTrip() {
    localStorage.setItem('tripPlan', JSON.stringify(tripPlan));
}

/**
 * Load trip plan from localStorage
 */
function loadTrip() {
    const saved = localStorage.getItem('tripPlan');
    
    if (saved) {
        try {
            tripPlan = JSON.parse(saved);
        } catch (e) {
            console.error('Error parsing trip plan:', e);
            tripPlan = { ...tripPlans };
        }
    } else {
        tripPlan = { ...tripPlans };
    }
}

/**
 * Clean up resources (e.g., clear intervals)
 */
function cleanup() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
}

// Export functions for use in other modules
export { initPlanner, cleanup }; 