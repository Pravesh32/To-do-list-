const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = "all";

// Save to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Filter tasks
function getFilteredTasks() {
    if (filter === "completed") return tasks.filter(t => t.done);
    if (filter === "pending") return tasks.filter(t => !t.done);
    return tasks;
}

// Render tasks
function renderTasks() {
    taskList.innerHTML = '';

    const filtered = getFilteredTasks();

    if (filtered.length === 0) {
        taskList.innerHTML = `<p class="empty">No tasks found 🚀</p>`;
        return;
    }

    filtered.forEach((task, index) => {
        const li = document.createElement('li');

        const leftDiv = document.createElement('div');
        leftDiv.className = 'task-left';

        // Check icon
        const checkImg = document.createElement('img');
        checkImg.src = task.done ? 'checked.png' : 'unchecked.png';
        checkImg.className = 'check-img';
        checkImg.addEventListener('click', () => {
            task.done = !task.done;
            saveTasks();
            renderTasks();
        });

        // Task text
        const textDiv = document.createElement('div');

        const taskTextEl = document.createElement('span');
        taskTextEl.className = 'task-text';
        taskTextEl.textContent = task.text;

        if (task.done) taskTextEl.classList.add('completed');

        // Edit task
        taskTextEl.addEventListener('dblclick', () => {
            const newText = prompt('Update task:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                saveTasks();
                renderTasks();
            }
        });

        // Timestamp
        const time = document.createElement('small');
        time.textContent = task.createdAt;

        textDiv.appendChild(taskTextEl);
        textDiv.appendChild(time);

        leftDiv.appendChild(checkImg);
        leftDiv.appendChild(textDiv);

        // Delete button
        const deleteImg = document.createElement('img');
        deleteImg.src = 'delete.png';
        deleteImg.className = 'delete-img';
        deleteImg.addEventListener('click', () => {
            if (confirm("Delete this task?")) {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            }
        });

        li.appendChild(leftDiv);
        li.appendChild(deleteImg);

        taskList.appendChild(li);
    });
}

// Add task
addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();

    if (text === '') {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        text,
        done: false,
        createdAt: new Date().toLocaleString()
    });

    saveTasks();
    renderTasks();
    taskInput.value = '';
});

// Enter key support
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBtn.click();
});

// Filter buttons (assumes buttons exist in HTML)
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        filter = btn.dataset.filter;

        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        renderTasks();
    });
});

// Initial render
renderTasks();