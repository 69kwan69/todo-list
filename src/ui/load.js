import * as Components from './components';
import TodoListManager from "../features/todoListManager";


function initialLoadHeader(logoURL, userAvatarURL) {
    const html = Components.headerSection(logoURL, userAvatarURL);
    document.body.insertAdjacentHTML('beforeend', html);
}

function initialLoadAside() {
    const el = Components.asideSection(
        Components.modalNewTask(),
        Components.modalDeleteTask(),
        Components.modalEditTask(),
        Components.modalDeleteList());
    document.body.insertAdjacentElement('beforeend', el);
}

function initialLoadSideBar() {
    const listTabs = []
    TodoListManager.lists.forEach((list, index) => {
        if (index < 2) listTabs.push(Components.listTabComponent(list.name, true));
        else listTabs.push(Components.listTabComponent(list.name))
    })
    const el = Components.sideBarSection(...listTabs);
    document.body.insertAdjacentElement('beforeend', el);
}

function initialLoadContent(listName) {
    // Insert HTML template
    const taskList = document.createElement('ul');
    taskList.classList.add('task-list');
    taskList.dataset.listName = listName;

    TodoListManager
        .getTasksFrom(listName)
        .forEach(task => taskList.append(Components.taskItemComponent(task.name, task.details, task.dueDate, task.priority, task.isFinished())));

    const html = Components.contentSection(listName);
    document.body.insertAdjacentHTML('beforeend', html);

    const contentHeader = document.querySelector('.content-header');
    contentHeader.insertAdjacentElement('afterend', taskList);

    // Insert DOM here
    const newTaskBtn = document.querySelector('.btn.new-task');
    newTaskBtn.addEventListener('click', () => {
        const modalNewTask = document.querySelector('.modal.new-task');
        modalNewTask.showModal();
    })

    taskList.addEventListener('click', e => {
        const task = e.target.closest('.task');

        if (e.target.classList.contains('task__checkbox')) {
            const taskName = task.querySelector('.name').textContent;
            const listName = e.currentTarget.dataset.listName;

            TodoListManager.changeTaskStatus(taskName, listName);
            TodoListManager.updateLocalStorage();

        } else if (e.target.classList.contains('delete-task')) {
            const modalDeleteTask = document.querySelector('.modal.delete-task');
            modalDeleteTask.dataset.taskId = task.id;
            modalDeleteTask.showModal();

        } else if (e.target.classList.contains('edit-task')) {
            const taskName = task.querySelector('.name').textContent;
            const taskDetails = task.querySelector('.details').textContent;
            const taskDueDate = '2023-08-02';
            const taskPriority = task.querySelector('[data-priority]').dataset.priority;

            const modalEditTask = document.querySelector('.modal.edit-task');
            modalEditTask.dataset.taskId = task.id;
            modalEditTask.dataset.prevTaskName = taskName;

            const inputName = modalEditTask.querySelector('[name="name"]');
            inputName.value = taskName;

            const textareaDetails = modalEditTask.querySelector('[name="details"]');
            textareaDetails.value = taskDetails;

            const inputDueDate = modalEditTask.querySelector('[name="due-date"]');
            inputDueDate.value = taskDueDate;

            const priorities = [...modalEditTask.querySelectorAll('[name="priority"]')];
            priorities[3].checked = false;
            priorities[parseInt(taskPriority) - 1].checked = true;

            modalEditTask.showModal();
        }
    })
}


export { initialLoadHeader, initialLoadSideBar, initialLoadContent, initialLoadAside }