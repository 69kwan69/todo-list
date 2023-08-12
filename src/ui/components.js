import TodoListManager from "../features/todoListManager";
import { initialLoadContent } from "./load";


// Main sections for initial load
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

    // return `
    //         <nav class='card-section'>
    //             <ul class="default group">
    //                 <li class='tab today active'>Today</li>
    //                 <li class='tab week'>This week</li>
    //             </ul>

    //             <div class='group-title'>
    //                 <h2>My List</h2>
    //                 <button class='btn new-list'><i class="fa-solid fa-plus"></i></button>
    //             </div>

    //             <ul class="my-lists group">
    //                 ${listHTML}
    //             </ul>
    //         </nav>
    //         `
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

    // return `
    //         <main class='card-section'>
    //             <div class='content-header'>
    //                 <h2 class='list-name'>${listName}</h2>
    //                 <button class='btn new-task accent'><i class="fa-solid fa-plus"></i> New Task</button>
    //             </div>
    //             <ul class="task-list" data-list-name="Personal"></ul>
    //         </main>
    //         `;
}

export function asideSection(...dialogs) {
    const aside = document.createElement('aside');

    for (const dialog of dialogs) {
        aside.append(dialog);
    }

    return aside;
    // return `
    // <aside>
    //     ${dialogHTML}
    // </aside>
    // `
}


// Some small component for creating and manipulating
export function taskItemComponent(name, details, dueDate, priority, isChecked, listName) {
    const task = document.createElement('li');
    task.id = `task-${removeWhiteSpace(name)}`;
    task.classList.add('task');
    task.dataset.taskPriority = priority;
    task.dataset.taskIsChecked = isChecked;
    task.dataset.task = JSON.stringify({ name, details, dueDate, priority, listName });


    const taskPriority = document.createElement('div');
    taskPriority.classList.add('task__priority');
    // taskPriority.dataset.priority = priority;


    const taskCheckbox = document.createElement('input');
    taskCheckbox.classList.add('task__checkbox');
    taskCheckbox.id = removeWhiteSpace(name);
    taskCheckbox.type = 'checkbox';
    taskCheckbox.checked = isChecked;


    const taskText = document.createElement('label');
    taskText.classList.add('task__text');
    taskText.setAttribute('for', removeWhiteSpace(name));


    const h3Name = document.createElement('h3');
    h3Name.classList.add('name');
    h3Name.textContent = name;

    const spanListName = document.createElement('span');
    spanListName.classList.add('from-list-name');
    spanListName.textContent = ` (${listName})`;

    h3Name.append(spanListName);

    const pDetails = document.createElement('p');
    pDetails.classList.add('details');
    pDetails.textContent = details;

    taskText.append(h3Name, pDetails)


    const taskDueDate = document.createElement('p');
    taskDueDate.classList.add('task__due-date')
    taskDueDate.textContent = dueDate;


    const taskBtns = document.createElement('div');
    taskBtns.classList.add('task__btns');

    const btnEditTask = document.createElement('button');
    btnEditTask.classList.add('btn', 'edit-task');
    btnEditTask.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

    const btnDeleteTask = document.createElement('button');
    btnDeleteTask.classList.add('btn', 'delete-task');
    btnDeleteTask.innerHTML = '<i class="fa-solid fa-xmark"></i>'

    taskBtns.append(btnEditTask, btnDeleteTask)


    task.append(
        taskPriority,
        taskCheckbox,
        taskText,
        taskDueDate,
        taskBtns
    )

    return task;
}

export function listTabComponent(listName, isDefault = false) {
    const tab = document.createElement('li');
    tab.classList.add('tab', 'default');
    tab.id = removeWhiteSpace(listName);

    const pListName = document.createElement('p');
    pListName.classList.add('tab__list-name');
    pListName.textContent = listName;

    tab.append(pListName);

    if (!isDefault) {
        const btnDeleteList = document.createElement('button');
        btnDeleteList.classList.add('btn', 'delete-list');
        btnDeleteList.innerHTML = '<i class="fa-solid fa-xmark"></i>'

        tab.classList.remove('default');
        tab.append(btnDeleteList);
    }

    return tab;
}

export function modalNewTask() {
    const h2 = document.createElement('h2');
    h2.textContent = 'Create new task';

    const br = document.createElement('br');

    const labelName = document.createElement('label');
    const inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.name = 'name';
    inputName.placeholder = "Go shopping";
    inputName.required = true;
    labelName.append('Name:', br, inputName);

    const labelDetails = document.createElement('label');
    const textareaDetails = document.createElement('textarea');
    textareaDetails.name = 'details';
    textareaDetails.placeholder = 'Buy milk';
    textareaDetails.cols = 20;
    textareaDetails.rows = 2;
    labelDetails.append('Details:', br, textareaDetails);

    const labelDueDate = document.createElement('label');
    labelDueDate.classList.add('due-date');
    const inputDueDate = document.createElement('input');
    inputDueDate.type = 'date';
    inputDueDate.name = 'due-date';
    inputDueDate.valueAsDate = new Date();
    labelDueDate.append('Due Date:', inputDueDate);

    const divWrapper = document.createElement('div');
    divWrapper.classList.add('wrapper');

    for (let value = 1; value <= 4; value++) {
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'priority';
        input.value = value;
        if (value === 4) input.checked = true;

        const label = document.createElement('label');
        label.append(input, value);

        divWrapper.append(label);
    }

    const fieldset = document.createElement('fieldset');
    fieldset.append('Priority', divWrapper);

    const buttonConfirm = document.createElement('button');
    buttonConfirm.classList.add('btn', 'confirm', 'accent');
    buttonConfirm.textContent = 'Create';

    const buttonCancel = document.createElement('button');
    buttonCancel.classList.add('btn', 'cancel');
    buttonCancel.textContent = 'Cancel';
    buttonCancel.type = 'button';
    buttonCancel.addEventListener('click', () => modal.close());

    const divBtns = document.createElement('div');
    divBtns.classList.add('btns');
    divBtns.append(buttonConfirm, buttonCancel);

    const form = document.createElement('form');
    form.method = 'dialog';
    form.append(h2, labelName, labelDetails, labelDueDate, fieldset, divBtns);
    form.addEventListener('submit', e => {
        e.preventDefault();
        if (handleTask(e)) modal.close();
    });

    const modal = document.createElement('dialog');
    modal.classList.add('modal', 'new-task');
    modal.append(form);

    return modal;

    // return `
    //         <dialog class="modal new-task">
    //             <form method="dialog">
    //                 <h2>Create new task</h2>

    //                 <label>Name: <br><input type="text" name="name" placeholder="Go shopping" required></label>

    //                 <label>Details: <br><textarea name="details" placeholder="Buy milk" cols="20" rows="2"></textarea></label>

    //                 <label class="due-date">Due Date:<input type="date" name="due-date"></label>

    //                 <fieldset>Priority:
    //                     <div class="wrapper">
    //                         <label><input type="radio" name="priority" value="1"> 1</label>
    //                         <label><input type="radio" name="priority" value="2"> 2</label>
    //                         <label><input type="radio" name="priority" value="3"> 3</label>
    //                         <label><input type="radio" name="priority" value="4" checked> 4</label>
    //                     </div>
    //                 </fieldset>

    //                 <div class="btns">
    //                     <button class="btn confirm.create-task accent">Create</button>
    //                     <button class="btn cancel" type="button">Cancel</button>
    //                 </div>
    //             </form>
    //         </dialog>
    //         `
}

export function modalEditTask() {
    const tempModal = modalNewTask();
    const tempForm = tempModal.querySelector('form');

    const modal = document.createElement('dialog');
    modal.classList.add('modal', 'edit-task');

    const form = tempForm.cloneNode(true);
    form.addEventListener('submit', e => {
        e.preventDefault();
        const prevTaskName = modal.dataset.prevTaskName;
        const prevTaskEl = document.querySelector(`#${modal.dataset.taskId}`);

        if (handleTask(e, prevTaskName, prevTaskEl)) modal.close();
    });

    modal.append(form);

    const h2 = modal.querySelector('h2');
    h2.textContent = 'Edit task';

    const btnConfirm = modal.querySelector('.btn.confirm');
    btnConfirm.textContent = 'Edit';

    const buttonCancel = modal.querySelector('.btn.cancel');
    buttonCancel.addEventListener('click', () => modal.close());

    return modal;
}

export function modalDeleteTask() {
    const h2 = document.createElement('h2');
    h2.textContent = 'Delete task?';

    const buttonDeleteTask = document.createElement('button');
    buttonDeleteTask.classList.add('btn', 'confirm', 'accent');
    buttonDeleteTask.textContent = 'Delete';
    buttonDeleteTask.addEventListener('click', () => {
        const task = document.querySelector(`#${modal.dataset.taskId}`);
        const { name, listName } = JSON.parse(task.dataset.task);

        TodoListManager.deleteTask(name, listName);
        TodoListManager.updateLocalStorage();

        task.remove();
        modal.close();
    })

    const buttonCancel = document.createElement('button');
    buttonCancel.classList.add('btn', 'cancel');
    buttonCancel.textContent = 'Cancel';
    buttonCancel.addEventListener('click', () => modal.close());

    const divBtns = document.createElement('div');
    divBtns.classList.add('btns');
    divBtns.append(buttonDeleteTask, buttonCancel);

    const div = document.createElement('div');
    div.append(h2, divBtns);

    const modal = document.createElement('dialog');
    modal.classList.add('modal', 'delete-task');
    modal.append(div);

    return modal;

    // return `<dialog class='modal delete-task'>
    //             <div>
    //                 <h2>Delete task?</h2>
    //                 <div class="btns">
    //                     <button class="btn delete-task accent">Delete</button>
    //                     <button class="btn cancel" type="button">Cancel</button>
    //                 </div>
    //             <div>
    //         </dialog>
    //         `
}

export function divNewList() {
    const inputListName = document.createElement('input');
    inputListName.type = 'text';
    inputListName.name = 'list-name';
    inputListName.placeholder = 'Studying';
    inputListName.required = true;

    const divBtns = document.createElement('div');
    divBtns.classList.add('btns');

    const btnConfirm = document.createElement('button');
    btnConfirm.classList.add('btn', 'confirm', 'accent');
    btnConfirm.textContent = 'Create';

    const btnCancel = document.createElement('button');
    btnCancel.classList.add('btn', 'cancel');
    btnCancel.type = 'button';
    btnCancel.textContent = 'Cancel';
    btnCancel.addEventListener('click', () => {
        formCreateList.reset();
        divNewList.classList.add('hidden');
    });

    divBtns.append(btnConfirm, btnCancel);

    const formCreateList = document.createElement('form');
    formCreateList.method = 'dialog';
    formCreateList.append(inputListName, divBtns);
    formCreateList.addEventListener('submit', e => {
        e.preventDefault();

        const listName = inputListName.value;
        if (handleCreateList(listName)) {
            formCreateList.reset();
            divNewList.classList.add('hidden')
        }
    })

    const divNewList = document.createElement('div');
    divNewList.classList.add('new-list', 'hidden');
    divNewList.append(formCreateList);

    return divNewList;
}

export function modalDeleteList() {
    const modal = modalDeleteTask().cloneNode(true);

    modal.classList.remove('delete-task');
    modal.classList.add('delete-list');

    const h2 = modal.querySelector('h2');
    h2.textContent = 'Delete list';

    const p = document.createElement('p');
    p.textContent = 'Do you want to delete this list and all its tasks?';

    modal.querySelector('div').insertBefore(p, h2.nextSibling);

    const btnConfirm = modal.querySelector('.btn.confirm');
    btnConfirm.addEventListener('click', () => {
        const listTab = document.querySelector(`#${modal.dataset.listId}`);
        const listName = listTab.querySelector('p').textContent;

        TodoListManager.deleteList(listName);
        TodoListManager.updateLocalStorage();

        if (listName === document.querySelector('.list-name').textContent) initialLoadContent('Personal');
        listTab.remove();
        modal.close();
    });

    const btnCancel = modal.querySelector('.btn.cancel');
    btnCancel.addEventListener('click', () => modal.close());

    return modal;
}


// Utility functions
function normalToKebab(text) {
    return text
        .toLowerCase()
        .replaceAll(' ', '-');
}

function removeWhiteSpace(text) {
    return text.replaceAll(' ', '-');
}

function handleTask(e, prevName, prevTaskEl) {
    const name = e.currentTarget.querySelector('[name=name]').value;
    const details = e.currentTarget.querySelector('[name=details]').value;
    const dueDate = e.currentTarget.querySelector('[name=due-date]').value;
    const radioBtns = [...e.currentTarget.querySelectorAll('[name=priority]')];
    const priority = radioBtns.find(button => button.checked === true).value;
    const listName = JSON.parse(prevTaskEl.dataset.task).listName;
    // const listName = cool.list

    if (name !== prevName) {
        const taskExisted = TodoListManager
            .getTasksFrom(listName)
            .find(task => task.name === name);

        if (taskExisted) {
            alert("Try different task's name!")
            return false;
        }

        if (prevName) {
            TodoListManager.deleteTask(prevName, listName);
            prevTaskEl.remove();
        }
    } else {
        TodoListManager.deleteTask(prevName, listName);
        prevTaskEl.remove();
    }

    TodoListManager.createTask(name, details, dueDate, priority, listName);
    TodoListManager.updateLocalStorage();

    const taskList = document.body.querySelector('.task-list');
    taskList.append(taskItemComponent(name, details, dueDate, priority, false, listName));

    return true;
}

function handleCreateList(listName) {
    const isExisted = TodoListManager.getList(listName);
    if (isExisted) {
        alert("Try different list's name");
        return false;
    }

    TodoListManager.createList(listName);
    TodoListManager.updateLocalStorage();

    const groupMyLists = document.querySelector('.group.my-lists');
    groupMyLists.append(listTabComponent(listName));

    return true;
}