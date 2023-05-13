import { Locator } from "@playwright/test";

import { expect } from "../_fixtures/test-fixtures";

import { BasePage } from "../base.po";

export class CreateTodo extends BasePage {
    readonly createElements = {
        createTodoInput: this.page.locator('.new-todo')
    }
}