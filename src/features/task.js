export default class Task {
    constructor(name, details = '', dueDate, priority = 4) {
        this.name = name;
        this.details = details;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isChecked = false;
    }

    isFinished() {
        return this.isChecked;
    }

    check() {
        this.isChecked = true;
    }

    uncheck() {
        this.isChecked = false;
    }
}

