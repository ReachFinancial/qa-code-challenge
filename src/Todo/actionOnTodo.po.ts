import { Locator } from "@playwright/test";

import { expect } from "../_fixtures/test-fixtures";

import { BasePage } from "../base.po";

export class ActionsOnTodo extends BasePage {
    readonly actionsElements = {
        createTodoInput: this.page.locator('')
    }
}