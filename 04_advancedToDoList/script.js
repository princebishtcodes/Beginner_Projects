
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.querySelector('#task-input');
    const addTaskBtn = document.querySelector('#add-task-btn');
    const taskList = document.querySelector('#task-list');
    const emptyImg = document.querySelector(".empty-img");
    const toDosContainer = document.querySelector('.todos-container');

    function toggleEmptyState() {
        if (taskList.children.length === 0) {
            emptyImg.style.display = "block";
        }
        else {
            emptyImg.style.display = "none";
        }
    }

    function saveTasktoLocalStorage() {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTaskstoLocalStorage() {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({ text, completed }) => addTask(text, completed));
        toggleEmptyState();
    }

    function addTask(text, completed) {
        const taskText = text || taskInput.value.trim();
        if (!taskText) return;

        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class = "checkbox" ${completed ? 'checked' : ''}/>
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="edit-btn"><i class ="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;


        const editBtn = li.querySelector('.edit-btn');
        const checkBox = li.querySelector('.checkbox');

        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }

        checkBox.addEventListener('change', () => {
            const isChecked = checkBox.checked;
            li.classList.toggle('completed', isChecked);
            editBtn.style.opacity = isChecked ? '0.5' : '1';
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
        })

        editBtn.addEventListener('click', () => {
            if (!checkBox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                saveTasktoLocalStorage();
                toggleEmptyState();
            }
        })

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            saveTasktoLocalStorage();
            toggleEmptyState();
        })

        taskList.appendChild(li);
        saveTasktoLocalStorage();
        taskInput.value = "";
        toggleEmptyState();
    }

    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault()
        addTask()
    });
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addTask();
        }
    })

    loadTaskstoLocalStorage();
})