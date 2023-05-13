import { Locator } from "@playwright/test";

import { expect } from "../_fixtures/test-fixtures";

import { BasePage } from "../base.po";

export class TodoPage extends BasePage {
    readonly todoElements = {
        createTodoInput: this.page.locator('.new-todo'),
        todoList: this.page.locator('ul.todo-list li label')
    }
}