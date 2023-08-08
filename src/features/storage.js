import List from "./list";
import Task from "./task";

export default class Storage {
    static key = 'todoList';

    static storeLocalStorage(data) {
        localStorage.setItem(Storage.key, JSON.stringify(data));
    }

    static retrieveLocalStorage() {
        const rawData = JSON.parse(localStorage.getItem(Storage.key));

        if (!rawData) return;

        const lists = rawData.map(rawList => {
            rawList.tasks = rawList.tasks.map(task => Object.assign(new Task(), task));
            return Object.assign(new List(), rawList);
        })

        return lists;
    }
}