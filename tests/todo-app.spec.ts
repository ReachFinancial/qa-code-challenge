import { test, expect, type Page } from '@playwright/test';
import { checkNumberOfCompletedTodosInLocalStorage, checkNumberOfTodosInLocalStorage, checkTodosInLocalStorage } from '../src/todo-app'

test.beforeEach(async ({ page }) => {
  await page.goto('');
});

const TODO_ITEMS = [
  'complete code challenge for reach',
  'ensure coverage for all items is automated'
];

test.describe.skip('Create New Todo', () => {
  test('should be able to create new items on the page', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo.
    await newTodo.fill(TODO_ITEMS[0]);
await page.waitForTimeout(5000)
    await newTodo.press('Enter');
await page.waitForTimeout(5000)


    // Make sure the list only has one todo item.
    await expect(page.getByTestId('todo-title')).toHaveText([
      TODO_ITEMS[0]
    ]);
await page.waitForTimeout(5000)


    // Create 2nd todo.
    await newTodo.fill(TODO_ITEMS[1]);
await page.waitForTimeout(5000)

    await newTodo.press('Enter');

    // Make sure the list now has two todo items.
    await expect(page.getByTestId('todo-title')).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[1]
    ]);
await page.waitForTimeout(5000)


    await checkNumberOfTodosInLocalStorage(page, 2);
  });
});
