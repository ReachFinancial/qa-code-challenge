import { test, expect, type Page, Locator } from '@playwright/test';
import { checkNumberOfCompletedTodosInLocalStorage, checkNumberOfTodosInLocalStorage, checkTodosInLocalStorage, createTodos } from '../helper/todo-app';

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
});

const TODO_ITEMS = [
  'complete code challenge for reach',
  'ensure coverage for all items is automated',
  'discuss solutions'
];
const totalCount = TODO_ITEMS.length;

test.describe('Create New Todo', () => {
  test.beforeEach(async ({ page }) => {
    await createTodos(page, TODO_ITEMS);
  });

  test('should be able to create new items on the page', async ({ page }) => {
    await expect(page.getByTestId('todo-title')).toHaveText([...TODO_ITEMS], { ignoreCase: false });
    await checkNumberOfTodosInLocalStorage(page, totalCount);
  });

  test('should be able to clear input text when an item is added', async ({ page }) => {
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
    await expect(page.getByTestId('todo-count')).toContainText(`${totalCount + 1} items left`);
  });
});

test.describe('Marking as completed', () => {
  test.beforeEach(async ({ page }) => {
    await createTodos(page, TODO_ITEMS);
    await checkNumberOfTodosInLocalStorage(page, totalCount);
  });

  test.afterEach(async ({ page }) => {
    await checkNumberOfTodosInLocalStorage(page, totalCount);
  });

  test('should be able to mark all items as completed', async ({ page }) => {
    await page.locator('input.toggle-all').check();

    await expect(page.getByTestId('todo-item')).toHaveClass(Array.from(new Array(totalCount), () => 'completed'));
    await expect(page.getByTestId('todo-count')).toContainText('0 items left');
    await expect(page.locator('button.clear-completed')).toContainText('Clear completed', { ignoreCase: false });
    await checkNumberOfCompletedTodosInLocalStorage(page, totalCount);
  });

  test('should allow clearing the completed state back to incomplete', async ({ page }) => {
    const toggleAll = page.locator('input.toggle-all');
    await toggleAll.check();
    await toggleAll.uncheck();

    await expect(page.getByTestId('todo-item')).toHaveClass(Array.from(new Array(totalCount), () => ''));
    await expect(page.getByTestId('todo-count')).toContainText(`${totalCount} items left`);
    await expect(page.locator('footer.footer')).not.toHaveText('Clear completed', { ignoreCase: false });
  });

  test('should allow marking all as completed with the arrow next to the prompt', async ({ page }) => {
    const toggles = page.locator('input.toggle');
    const togglesCount = await toggles.count();

    expect(togglesCount).toEqual(totalCount);

    for (let i = 0; i < togglesCount; i++) {
      let itemsLeft = togglesCount - i - 1;

      await toggles.nth(i).check();
      await expect(toggles.nth(i)).toBeChecked();
      await expect(page.getByTestId('todo-count')).toHaveText(itemsLeft == 1 ? `${itemsLeft} item left` : `${itemsLeft} items left`);
    }

    await expect(page.locator('input.toggle-all')).toBeChecked();
  });
});

test.describe('Editing existing todos', () => {
  test.beforeEach(async ({ page }) => {
    await createTodos(page, TODO_ITEMS);
    await checkNumberOfTodosInLocalStorage(page, totalCount);
  });

  test('should be able to edit a record', async ({ page }) => {
    const todoItems = page.getByTestId('todo-item');
    const itemToEdit = todoItems.nth(2);
    const newItemTitle = 'discuss the approach and solutions';
    TODO_ITEMS[2] = newItemTitle;

    await itemToEdit.dblclick();
    await itemToEdit.getByRole('textbox', { name: 'Edit' }).fill(newItemTitle);
    await itemToEdit.getByRole('textbox', { name: 'Edit' }).dispatchEvent('blur');

    await expect(todoItems).toHaveText(TODO_ITEMS);
    await checkTodosInLocalStorage(page, newItemTitle);
  });

  test('should trim entered text', async ({ page }) => {
    const todoItems = page.getByTestId('todo-item');
    const itemToEdit = todoItems.nth(1);
    const newItemTitle = '     Ensure coverage for all items is automated!   ';
    TODO_ITEMS[1] = newItemTitle.trim();

    await itemToEdit.dblclick();
    await itemToEdit.getByRole('textbox', { name: 'Edit' }).fill(newItemTitle);
    await itemToEdit.getByRole('textbox', { name: 'Edit' }).dispatchEvent('blur');

    await expect(todoItems).toHaveText(TODO_ITEMS, { ignoreCase: false });
    await checkTodosInLocalStorage(page, newItemTitle.trim());
  });

  test('should remove the item if the text is cleared', async ({ page }) => {
    const todoItems = page.getByTestId('todo-item');
    const itemToEdit = todoItems.nth(0);

    await itemToEdit.dblclick();
    await itemToEdit.getByRole('textbox', { name: 'Edit' }).fill('');
    await itemToEdit.getByRole('textbox', { name: 'Edit' }).dispatchEvent('blur');

    await expect(todoItems).toHaveText(TODO_ITEMS.slice(1), { ignoreCase: false });
    await checkNumberOfTodosInLocalStorage(page, totalCount - 1);
    await expect(page.getByTestId('todo-count')).toHaveText(totalCount - 1 == 1 ? `${totalCount - 1} item left` : `${totalCount - 1} items left`);
  });

  test('should cancel edits on escape', async ({ page }) => {
    const todoItems = page.getByTestId('todo-item');

    await todoItems.nth(1).dblclick();
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('this should not be saved');
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Escape');

    await expect(todoItems).toHaveText(TODO_ITEMS);
  });
});