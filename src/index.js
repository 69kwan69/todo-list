import './style/reset.css';
import './style/style.css';

import logoURL from './images/logo.png'
import userAvatarURL from './images/user.png'

import { initialLoadContent, initialLoadSideBar, initialLoadHeader, initialLoadAside } from './ui/load';

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


// console.dir(document.querySelectorAll('.tab__list-name'));

// const modal = confirmDeleteTaskModal();
// document.body.append(asideSection(modal));
// modal.showModal();