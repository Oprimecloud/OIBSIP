/* =========================================
   1. DOM ELEMENT SELECTION
   ========================================= */
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const inputError = document.getElementById('input-error');

const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');

const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');

const pendingEmpty = document.getElementById('pending-empty');
const completedEmpty = document.getElementById('completed-empty');

/* =========================================
   2. STATE MANAGEMENT (LOCAL STORAGE)
   ========================================= */
// Load tasks from localStorage or initialize an empty array if none exist
let tasks = JSON.parse(localStorage.getItem('taskmaster_data')) || [];

// Save the current tasks array to localStorage
function saveTasks() {
    localStorage.setItem('taskmaster_data', JSON.stringify(tasks));
}

/* =========================================
   3. CORE CRUD OPERATIONS
   ========================================= */

// CREATE: Add a new task
function addTask() {
    const text = taskInput.value.trim();
    
    // Validation: Prevent empty tasks
    if (text === '') {
        inputError.textContent = 'Task cannot be empty.';
        inputError.style.display = 'block';
        return;
    }
    
    // Clear error if valid
    inputError.style.display = 'none';

    // Create task object with a timestamp and unique ID
    const newTask = {
        id: Date.now().toString(),
        text: text,
        completed: false,
        timestamp: new Date().toLocaleString()
    };

    tasks.push(newTask);
    taskInput.value = ''; // Clear input field
    
    updateUI();
}

// UPDATE: Toggle completed status
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    updateUI();
}

// UPDATE: Edit task text inline
function editTask(id, currentText, taskElement) {
    // Create an input field to replace the text
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';
    
    // Find the text container and swap it
    const textContainer = taskElement.querySelector('.task-text');
    textContainer.replaceWith(input);
    input.focus();

    // Save changes when user presses Enter or clicks away (blur)
    const saveEdit = () => {
        const newText = input.value.trim();
        if (newText !== '') {
            tasks = tasks.map(task => 
                task.id === id ? { ...task, text: newText } : task
            );
        }
        updateUI(); // Re-render to show updated text
    };

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveEdit();
    });
}

// DELETE: Remove task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    updateUI();
}

/* =========================================
   4. UI RENDERING & DOM MANIPULATION
   ========================================= */

// The master function that handles updating the screen based on the data array
function updateUI() {
    saveTasks(); // Always sync to localStorage first

    // Clear current lists (keeping the empty state templates intact)
    pendingList.innerHTML = '';
    pendingList.appendChild(pendingEmpty);
    
    completedList.innerHTML = '';
    completedList.appendChild(completedEmpty);

    let pendingTasksCount = 0;
    let completedTasksCount = 0;

    tasks.forEach(task => {
        // Create the HTML for the task card
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                <span class="task-timestamp">${task.timestamp}</span>
            </div>
            <div class="task-actions">
                <button class="btn-action toggle-btn" aria-label="${task.completed ? 'Mark pending' : 'Mark completed'}">
                    ${task.completed ? '⏪' : '✅'}
                </button>
                ${!task.completed ? `<button class="btn-action edit-btn" aria-label="Edit task">✏️</button>` : ''}
                <button class="btn-action delete-btn" aria-label="Delete task">🗑️</button>
            </div>
        `;

        // Event Delegation for action buttons
        li.querySelector('.toggle-btn').addEventListener('click', () => toggleTask(task.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
        
        // Only attach edit listener if the button exists (not completed)
        if (!task.completed) {
            li.querySelector('.edit-btn').addEventListener('click', () => editTask(task.id, task.text, li));
        }

        // Append to the correct list and increment counters
        if (task.completed) {
            completedList.appendChild(li);
            completedTasksCount++;
        } else {
            pendingList.appendChild(li);
            pendingTasksCount++;
        }
    });

    // Update Counters
    pendingCount.textContent = `${pendingTasksCount} pending`;
    completedCount.textContent = `${completedTasksCount} completed`;

    // Toggle Empty State Visibility
    pendingEmpty.style.display = pendingTasksCount === 0 ? 'flex' : 'none';
    completedEmpty.style.display = completedTasksCount === 0 ? 'flex' : 'none';
}

/* =========================================
   5. EVENT LISTENERS
   ========================================= */
addTaskBtn.addEventListener('click', addTask);

// Allow pressing 'Enter' inside the input field to add a task
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Initial Render on page load
updateUI();