import { test as base, expect } from '@playwright/test'

import { BasePage } from '../base.po';
import { CreateTodo } from '../Todo/createTodo.po';
import { EditTodo } from '../Todo/editTodo.po';
import { ActionsOnTodo } from '../Todo/actionOnTodo.po';
import { TodoPage } from '../Todo/todo.po';


export const test = base.extend<
    {
        base?: BasePage;
        createTodo: CreateTodo;
        editTodo: EditTodo;
        actionTodo: ActionsOnTodo;
        todo: TodoPage;
    },
    WorkerOptions
>({
    base: async ({ page }, use) => {
        await page.goto('', { waitUntil: 'domcontentloaded' });
        await use(new BasePage(page));
    },
    createTodo: async ({ page }, use) => {
        await page.goto('', { waitUntil: 'domcontentloaded' });
        await use(new CreateTodo(page));
    },
    editTodo: async ({ page }, use) => {
        await page.goto('', { waitUntil: 'domcontentloaded' });
        await use(new EditTodo(page));
    },
    actionTodo: async ({ page }, use) => {
        await page.goto('', { waitUntil: 'domcontentloaded' });
        await use(new ActionsOnTodo(page));
    },
    todo: async ({ page }, use) => {
        await page.goto('', { waitUntil: 'domcontentloaded' });
        await use(new TodoPage(page));
    },

});

export { expect } from '@playwright/test'