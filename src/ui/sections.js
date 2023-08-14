import TodoListManager from "../features/todoListManager";
import { divNewList, listTabComponent, taskItemComponent } from "./components";
import { initialLoadContent } from "./load";

export function headerSection(logoURL, userAvatarURL) {
    return `
            <header>
                <div class="logo">
                    <img src="${logoURL}" alt="Logo">
                    <h1 class="logo__text">To-do List</h1>
                </div>

                <div class="account">
                    <img src="${userAvatarURL}" alt="User's Avatar" class="account__avatar">
                    <p class="account__name">Login</p>
                </div>
            </header>
            `
}

export function sideBarSection(...listTabs) {
    const ulGroupDefault = document.createElement('ul');
    ulGroupDefault.classList.add('group', 'default');
    ulGroupDefault.addEventListener('click', e => {
        if (e.target.id !== 'Today' && e.target.id !== 'This-week') return;

        initialLoadContent('Personal');
        const main = document.querySelector('main');

        const listName = main.querySelector('.list-name');

        const btn = main.querySelector('.btn.new-task');
        btn.remove();

        const ul = main.querySelector('.task-list');
        ul.innerHTML = '';
        ul.removeAttribute('data-list-name');

        let tasks;
        if (e.target.id === 'Today') {
            listName.textContent = 'Today';
            tasks = TodoListManager.getTodayTasks();

        } else if (e.target.id === 'This-week') {
            listName.textContent = 'This Week';
            tasks = TodoListManager.getWeekTasks();
        }

        tasks.forEach(list => {
            list.tasks.forEach(task => {
                ul.append(taskItemComponent(
                    task.name,
                    task.details,
                    task.dueDate,
                    task.priority,
                    task.isChecked,
                    list.listName
                ))
            })
        })

        const currentListTab = navCardSection.querySelector('.active');
        if (currentListTab) currentListTab.classList.remove('active');
        e.target.classList.add('active');
    })

    const defaultTabs = ['Today', 'This week'];
    for (const tabName of defaultTabs) {
        ulGroupDefault.append(listTabComponent(tabName, true));
    }

    const divGroupTitle = document.createElement('div');
    divGroupTitle.classList.add('group-title');

    const h2 = document.createElement('h2');
    h2.textContent = 'My Lists';

    const buttonNewList = document.createElement('button');
    buttonNewList.classList.add('btn', 'new-list');
    buttonNewList.innerHTML = '<i class="fa-solid fa-plus"></i>';
    buttonNewList.addEventListener('click', () => {
        const divNewList = ulGroupMyLists.querySelector('.new-list');
        divNewList.classList.remove('hidden');
    })

    divGroupTitle.append(h2, buttonNewList);

    const ulGroupMyLists = document.createElement('ul');
    ulGroupMyLists.classList.add('group', 'my-lists');
    ulGroupMyLists.append(divNewList());
    for (const listTab of listTabs) ulGroupMyLists.append(listTab);
    ulGroupMyLists.addEventListener('click', e => {
        if (e.target.classList.contains('delete-list')) {
            const modal = document.querySelector('.modal.delete-list');
            const listTab = e.target.closest('.tab');
            modal.dataset.listId = listTab.id;
            modal.showModal();

        } else if (e.target.classList.contains('tab')) {
            const listName = e.target.querySelector('.tab__list-name').textContent;

            const currentListName = document.querySelector('.list-name').textContent;
            if (listName === currentListName) return;

            initialLoadContent(listName);

            const currentListTab = navCardSection.querySelector('.active');
            if (currentListTab) currentListTab.classList.remove('active');
            e.target.classList.add('active');
        }
    })

    const navCardSection = document.createElement('nav');
    navCardSection.classList.add('card-section');
    navCardSection.append(
        ulGroupDefault,
        divGroupTitle,
        ulGroupMyLists
    )

    return navCardSection;
}

export function contentSection(listName) {
    const main = document.createElement('main');
    main.classList.add('card-section');

    const divContentHeader = document.createElement('div');
    divContentHeader.classList.add('content-header');

    const h2ListName = document.createElement('h2');
    h2ListName.classList.add('list-name');
    h2ListName.textContent = listName;

    const btnNewTask = document.createElement('button');
    btnNewTask.classList.add('btn', 'new-task', 'accent');
    btnNewTask.innerHTML = '<i class="fa-solid fa-plus"></i> New Task';
    btnNewTask.addEventListener('click', () => {
        const modalNewTask = document.querySelector('.modal.new-task');
        modalNewTask.showModal();
    })

    divContentHeader.append(h2ListName, btnNewTask);

    const ulTaskList = document.createElement('ul');
    ulTaskList.classList.add('task-list');
    ulTaskList.dataset.listName = listName;
    TodoListManager
        .getTasksFrom(listName)
        .forEach(task => ulTaskList
            .append(taskItemComponent(
                task.name,
                task.details,
                task.dueDate,
                task.priority,
                task.isFinished(),
                listName)));
    ulTaskList.addEventListener('click', e => {
        const task = e.target.closest('.task');

        if (e.target.classList.contains('task__checkbox')) {
            const { name, listName } = JSON.parse(task.dataset.task);

            TodoListManager.changeTaskStatus(name, listName);
            TodoListManager.updateLocalStorage();

            if (task.dataset.taskIsChecked === 'true') task.dataset.taskIsChecked = 'false';
            else task.dataset.taskIsChecked = 'true';

        } else if (e.target.classList.contains('delete-task')) {
            const modalDeleteTask = document.querySelector('.modal.delete-task');
            modalDeleteTask.dataset.taskId = task.id;
            modalDeleteTask.showModal();

        } else if (e.target.classList.contains('edit-task')) {
            const { name, details, dueDate, priority } = JSON.parse(task.dataset.task);

            const modalEditTask = document.querySelector('.modal.edit-task');
            modalEditTask.dataset.taskId = task.id;
            modalEditTask.dataset.prevTaskName = name;

            const inputName = modalEditTask.querySelector('[name="name"]');
            inputName.value = name;

            const textareaDetails = modalEditTask.querySelector('[name="details"]');
            textareaDetails.value = details;

            const inputDueDate = modalEditTask.querySelector('[name="due-date"]');
            inputDueDate.value = dueDate;

            const priorities = [...modalEditTask.querySelectorAll('[name="priority"]')];
            priorities[3].checked = false;
            priorities[parseInt(priority) - 1].checked = true;

            modalEditTask.showModal();
        }
    })

    main.append(divContentHeader, ulTaskList);

    return main;
}

export function asideSection(...dialogs) {
    const aside = document.createElement('aside');

    for (const dialog of dialogs) {
        aside.append(dialog);
    }

    return aside;
}

