import Task from './task';
import List from './list';
import Storage from './storage';
import { endOfWeek, isSameDay, isWithinInterval, startOfWeek } from 'date-fns';

export default class TodoListManager {
    static lists = TodoListManager.initializeLocalStorage();

    static getList(listName) {
        return TodoListManager.lists.find(list => list.name === listName);
    }

    static getTasksFrom(listName) {
        return TodoListManager.getList(listName).tasks;
    }

    static getTodayTasks() {
        const todayTasks = [];
        const today = new Date();
        TodoListManager.lists.forEach(list => {
            todayTasks.push({
                listName: list.name,
                tasks: list.tasks.filter(task => isSameDay(today, new Date(task.dueDate)))
            })
        })

        return todayTasks;
    }

    static getWeekTasks() {
        const weekTasks = []
        const today = new Date();
        const weekStart = startOfWeek(today);
        const weekEnd = endOfWeek(today);

        TodoListManager.lists.forEach(list => {
            weekTasks.push({
                listName: list.name,
                tasks: list.tasks.filter(task => isWithinInterval(new Date(task.dueDate), {
                    start: weekStart,
                    end: weekEnd
                }))
            })
        })

        return weekTasks;
    }


    // LocalStorage
    static initializeLocalStorage() {
        const storage = Storage.retrieveLocalStorage();

        if (storage === undefined || storage === []) {
            return [new List('Personal'), new List('Work')]
        } else {
            return storage;
        }
    }

    static updateLocalStorage() {
        Storage.storeLocalStorage(TodoListManager.lists);
    }


    // Manipulate task
    static createTask(name, details, dueDate, priority, listName) {
        const task = new Task(name, details, dueDate, priority);
        TodoListManager.addTaskToList(task, listName);
    }

    static deleteTask(taskName, listName) {
        TodoListManager.getList(listName).deleteTask(taskName);
    }

    static changeTaskStatus(taskName, listName) {
        TodoListManager.getList(listName).checkTask(taskName);
    }

    static addTaskToList(task, listName) {
        TodoListManager.getList(listName).addTask(task);
    }

    static editTask(prevName, name, details, dueDate, priority, listName) {
        TodoListManager.deleteTask(prevName, listName);
        TodoListManager.createTask(name, details, dueDate, priority, listName);
    }



    // Manipulate list
    static createList(name) {
        if (TodoListManager.getList(name)) return;
        const list = new List(name);
        TodoListManager.lists.push(list);
    }

    static renameList(prevName, newName) {
        TodoListManager.getList(prevName).name = newName;
    }

    static deleteList(name) {
        const index = TodoListManager.lists.findIndex(list => list.name === name);
        TodoListManager.lists.splice(index, 1);
    }
}