import { Locator } from "@playwright/test";

import { expect } from "../_fixtures/test-fixtures";

import { BasePage } from "../base.po";

export class EditTodo extends BasePage {
    readonly editElements = {
        createTodoInput: this.page.locator('')
    }
}