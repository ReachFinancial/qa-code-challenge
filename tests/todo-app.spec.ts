import { test, expect, type Page, Locator } from '@playwright/test';
import { checkNumberOfTodosInLocalStorage, createTodos } from '../helper/todo-app';

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
});

const TODO_ITEMS = [
  'complete code challenge for reach',
  'ensure coverage for all items is automated'
];
const totalCount = TODO_ITEMS.length;

test.describe('Create New Todo', () => {
  test.beforeEach(async ({ page }) => {
    await createTodos(page, TODO_ITEMS);
  });

  test('should be able to create new items on the page', async ({ page }) => {
    await expect(page.getByTestId('todo-title')).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[1]
    ], { ignoreCase: false });

    await checkNumberOfTodosInLocalStorage(page, totalCount);
  });

  test('should clear text input field when an item is added', async ({ page }) => {
    await expect(page.locator('input.new-todo')).toBeEmpty();
    await checkNumberOfTodosInLocalStorage(page, totalCount);
  });

  test('should trim entered text', async ({ page }) => {
    const toDoTitles = page.getByTestId('todo-title');
    const newItem = '   Submit Code Challenge!     ';

    await createTodos(page, [newItem]);
    await expect(toDoTitles.nth(totalCount)).toContainText(newItem.trim(), { ignoreCase: false });
  });

  test('should append new items to the bottom of the list', async ({ page }) => {
    const toDoTitles = page.getByTestId('todo-title');
    const newItem = 'submit code challenge';

    for (let i = 0; i < totalCount; i++) {
      await expect(toDoTitles.nth(i)).toHaveText(TODO_ITEMS[i]);
    }

    await createTodos(page, [newItem]);
    await expect(toDoTitles.nth(totalCount)).toHaveText(newItem);
    await expect(page.getByTestId('todo-count')).toHaveText(`${totalCount + 1} items left`);
  });
});
