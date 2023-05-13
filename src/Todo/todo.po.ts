import { Locator } from "@playwright/test";

import { expect } from "../_fixtures/test-fixtures";

import { BasePage } from "../base.po";
import { TodoItems, TODO_ITEMS } from "../const";

export class TodoPage extends BasePage {
    readonly todoElements = {
        createTodoInput: this.page.locator('.new-todo'),
        itemsAdded: this.page.locator('ul.todo-list li label'),
        editingElement: this.page.locator('.editing'),
        renameElement: this.page.locator('ul.todo-list li.editing input.edit')
    }

    async createTodo(todoInput: string[]): Promise<void> {
        for (const todo of todoInput) {
            await this.todoElements.createTodoInput.clear();
            await this.todoElements.createTodoInput.type(todo)
            await this.page.keyboard.press("Enter")
        }
    }
    
    async editTodo(todoInput: string[]): Promise<void> {
        const itemsSize = await this.todoElements.itemsAdded.count()
        for (let index = 0; index < itemsSize; index++) {
            const itemText = await this.todoElements.itemsAdded.nth(index).textContent();
            if (itemText?.includes(todoInput.toString().trim()))
                await this.todoElements.itemsAdded.nth(index).dblclick();
            break;
        }
    
   }
}


