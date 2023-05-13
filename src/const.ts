import { EditTodo } from "./Todo/editTodo.po"

export interface TaskAction {
    name: string
}

export const TASK_ACTION = {
    all: <TaskAction>{
        name: 'All'
    },
    active: <TaskAction>{
        name: 'Active'
    },
    completed: <TaskAction>{
        name: 'Completed'
    }

}
export interface TodoItems {
    taskValue: string
}
export const TODO_ITEMS =

{
    task1: <TodoItems>{
        taskValue: ' Stay Positive '
    },
    task2: <TodoItems>{
        taskValue: ' Work Hard '
    },
    task3: <TodoItems>{
        taskValue: ' Make It Happen '
    }

}
