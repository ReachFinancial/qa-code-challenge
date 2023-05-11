import { test, expect } from '@playwright/test';
import { checkNumberOfCompletedTodosInLocalStorage, checkNumberOfTodosInLocalStorage, checkTodosInLocalStorage, createTodos } from '../helper/todo-app';
import { todo as TODO_ITEMS } from '../fixtures/todo.json';
import { TODO } from '../locators/todo';

test.beforeEach(async ({ page }) => {
  await page.goto('/todomvc');
});

const totalCount = TODO_ITEMS.length;

test.describe('Create New Todo', () => {
  test.beforeEach(async ({ page }) => {
    await createTodos(page, TODO_ITEMS);
  });

  test('should be able to create new items on the page', async ({ page }) => {
    await expect(page.getByTestId(TODO.title)).toHaveText([...TODO_ITEMS], { ignoreCase: false });
    await checkNumberOfTodosInLocalStorage(page, totalCount);
  });

  test('should be able to clear input text when an item is added', async ({ page }) => {
    await expect(page.locator(TODO.newInput)).toBeEmpty();
    await checkNumberOfTodosInLocalStorage(page, totalCount);
  });

  test('should trim entered text', async ({ page }) => {
    const toDoTitles = page.getByTestId(TODO.title);
    const newItem = '   Submit Code Challenge!     ';

    await createTodos(page, [newItem]);
    await expect(toDoTitles.nth(totalCount)).toContainText(newItem.trim(), { ignoreCase: false });
  });

  test('should append new items to the bottom of the list', async ({ page }) => {
    const toDoTitles = page.getByTestId(TODO.title);
    const newItem = 'submit code challenge';

    for (let i = 0; i < totalCount; i++) {
      await expect(toDoTitles.nth(i)).toHaveText(TODO_ITEMS[i]);
    }

    await createTodos(page, [newItem]);
    await expect(toDoTitles.nth(totalCount)).toHaveText(newItem);
    await expect(page.getByTestId(TODO.count)).toContainText(`${totalCount + 1} items left`);
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
    await page.locator(TODO.toggleAll).check();

    await expect(page.getByTestId(TODO.item)).toHaveClass(Array.from(new Array(totalCount), () => 'completed'));
    await expect(page.getByTestId(TODO.count)).toContainText('0 items left');
    await expect(page.locator(TODO.clearCompleted)).toContainText('Clear completed', { ignoreCase: false });
    await checkNumberOfCompletedTodosInLocalStorage(page, totalCount);
  });

  test('should allow clearing the completed state back to incomplete', async ({ page }) => {
    const toggleAll = page.locator(TODO.toggleAll);
    await toggleAll.check();
    await toggleAll.uncheck();

    await expect(page.getByTestId(TODO.item)).toHaveClass(Array.from(new Array(totalCount), () => ''));
    await expect(page.getByTestId(TODO.count)).toContainText(`${totalCount} items left`);
    await expect(page.locator(TODO.footer)).not.toHaveText('Clear completed', { ignoreCase: false });
  });

  test('should allow marking all as completed with the arrow next to the prompt', async ({ page }) => {
    const toggles = page.locator(TODO.toggle);
    const togglesCount = await toggles.count();

    expect(togglesCount).toEqual(totalCount);

    for (let i = 0; i < togglesCount; i++) {
      let itemsLeft = togglesCount - i - 1;

      await toggles.nth(i).check();
      await expect(toggles.nth(i)).toBeChecked();
      await expect(page.getByTestId(TODO.count)).toHaveText(itemsLeft == 1 ? `${itemsLeft} item left` : `${itemsLeft} items left`);
    }

    await expect(page.locator(TODO.toggleAll)).toBeChecked();
  });
});

test.describe('Editing existing todos', () => {
  test.beforeEach(async ({ page }) => {
    await createTodos(page, TODO_ITEMS);
    await checkNumberOfTodosInLocalStorage(page, totalCount);
  });

  test('should be able to edit a record', async ({ page }) => {
    const todoItems = page.getByTestId(TODO.item);
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
    const todoItems = page.getByTestId(TODO.item);
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
    const todoItems = page.getByTestId(TODO.item);
    const itemToEdit = todoItems.nth(0);

    await itemToEdit.dblclick();
    await itemToEdit.getByRole('textbox', { name: 'Edit' }).fill('');
    await itemToEdit.getByRole('textbox', { name: 'Edit' }).dispatchEvent('blur');

    await expect(todoItems).toHaveText(TODO_ITEMS.slice(1), { ignoreCase: false });
    await checkNumberOfTodosInLocalStorage(page, totalCount - 1);
    await expect(page.getByTestId(TODO.count)).toHaveText(totalCount - 1 == 1 ? `${totalCount - 1} item left` : `${totalCount - 1} items left`);
  });

  test('should cancel edits on escape', async ({ page }) => {
    const todoItems = page.getByTestId(TODO.item);
    const itemToEdit = todoItems.nth(1);

    await itemToEdit.dblclick();
    await itemToEdit.getByRole('textbox', { name: 'Edit' }).fill('this should not be saved');
    await itemToEdit.getByRole('textbox', { name: 'Edit' }).press('Escape');

    await expect(todoItems).toHaveText(TODO_ITEMS);
  });
});

test.describe('Other functions', () => {
  test.beforeEach(async ({ page }) => {
    await createTodos(page, TODO_ITEMS);
    await checkNumberOfTodosInLocalStorage(page, totalCount);
  });

  test('should disable buttons when editing an item', async ({ page }) => {
    const todoItems = page.getByTestId(TODO.item);
    const itemToEdit = todoItems.nth(0);

    await itemToEdit.dblclick();
    await expect(itemToEdit.locator('button.destroy')).not.toBeVisible();
    await expect(itemToEdit.locator(TODO.toggle)).not.toBeVisible();
  });

  test('should filter the list on completion by the active or complete filters', async ({ page }) => {
    const todoItems = page.getByTestId(TODO.item);
    const toggles = page.locator(TODO.toggle);
    const activeFilter = page.locator(TODO.active);
    const completedFilter = page.locator(TODO.completed);
    const index = 1;
    const checkActive = async (items: string[]) => {
      await activeFilter.click();
      expect(page.url()).toContain('active');
      await expect(activeFilter).toHaveClass('selected');
      await expect(todoItems).toHaveText(items, { ignoreCase: false });
    };
    const checkCompleted = async (items: string[]) => {
      await completedFilter.click();
      expect(page.url()).toContain('completed');
      await expect(completedFilter).toHaveClass('selected');
      await expect(todoItems).toHaveText(items, { ignoreCase: false });
    };

    await toggles.nth(index).check();
    await expect(page.getByTestId(TODO.count)).toHaveText(totalCount - 1 == 1 ? `${totalCount - 1} item left` : `${totalCount - 1} items left`);

    const completedItem = TODO_ITEMS.splice(index, 1);

    await checkActive(TODO_ITEMS);
    await checkCompleted(completedItem);

    // reload page
    await page.reload();
    await checkActive(TODO_ITEMS);
    await checkCompleted(completedItem);
  });
});