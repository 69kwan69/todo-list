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
    const main = document.querySelector('main');
    if (main) main.remove();

    const el = Components.contentSection(listName);
    document.body.insertAdjacentElement('beforeend', el);
}


export { initialLoadHeader, initialLoadSideBar, initialLoadContent, initialLoadAside }