import './style/reset.css';
import './style/style.css';

import logoURL from './images/logo.png'
import userAvatarURL from './images/user.png'

import { initialLoadContent, initialLoadSideBar, initialLoadHeader, initialLoadAside } from './ui/load';
import TodoListManager from './features/todoListManager';

function load() {
    initialLoadHeader(logoURL, userAvatarURL);
    initialLoadAside();
    initialLoadSideBar();
    initialLoadContent('Personal');
}

function showLocalStorage(listName) {
    const data = JSON.parse(localStorage.getItem('todoList'))
    const index = data.findIndex(list => list.name === listName);
    console.dir(data);
}

// showLocalStorage('Personal');
load();

console.log(document.querySelectorAll('.list-name'));
console.log(TodoListManager.getRemainingTasks('Personal'));
console.log(document.querySelector('.list-name'));