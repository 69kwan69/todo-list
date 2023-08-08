export default class List {
    constructor(name, tasks = []) {
        this.name = name;
        this.tasks = tasks;
    }

    addTask(newTask) {
        if (this.contains(newTask.name)) return;
        this.tasks.push(newTask);
    }

    checkTask(taskName) {
        const index = this.findTaskIndex(taskName);
        if (this.tasks[index].isFinished()) this.tasks[index].uncheck();
        else this.tasks[index].check();
    }

    deleteTask(taskName) {
        const index = this.findTaskIndex(taskName);
        this.tasks.splice(index, 1);
    }

    findTaskIndex(taskName) {
        return this.tasks.findIndex(task => task.name === taskName);
    }

    contains(taskName) {
        return this.tasks.find(task => task.name === taskName);
    }
}