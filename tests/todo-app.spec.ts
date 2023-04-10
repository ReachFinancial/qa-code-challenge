import { test, expect, type Page } from '@playwright/test';
import { checkNumberOfCompletedTodosInLocalStorage, checkNumberOfTodosInLocalStorage, checkTodosInLocalStorage, createTodo } from '../src/todo-app'

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
});

const TODO_ITEMS = [
  'buy milk',
    'buy eggs',
    'buy cheese'
];

test.describe('Create New Todo', () => {
  test('should be able to create new items on the page', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Make sure the list only has one todo item.
    await expect(page.getByTestId('todo-title')).toHaveText([
      TODO_ITEMS[0]
    ]);

    // Create 2nd todo.
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Make sure the list now has two todo items.
    await expect(page.getByTestId('todo-title')).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[1]
    ]);

    await checkNumberOfTodosInLocalStorage(page, 2);
  });

  test('should clear input text when an item is added', async ({ page }) => {
    // Create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create one todo item
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Check input is empty
    await expect(newTodo).toBeEmpty();
    await checkNumberOfTodosInLocalStorage(page, 1);
  });

  test('should trim entered text', async ({ page }) => {
    await createTodo(page);
    await checkNumberOfTodosInLocalStorage(page, 3);
    const todoItems = page.getByTestId('todo-item');
    await todoItems.nth(1).dblclick();
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('    fix the car    ');
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Enter');

    await expect(todoItems).toHaveText([
      TODO_ITEMS[0],
      'fix the car',
      TODO_ITEMS[2],
    ]);
    await checkTodosInLocalStorage(page, 'fix the car');
  });

  test('should append new items to the bottom of the list', async ({ page }) => {
    await createTodo(page);

    // Create a todo count locator
    const todoCount = page.getByTestId('todo-count')
  
    // Check using different methods
    await expect(page.getByText('3 items left')).toBeVisible();
    await expect(todoCount).toHaveText('3 items left');
    await expect(todoCount).toContainText('3');
    await expect(todoCount).toHaveText(/3/);
    await expect(page.getByTestId('todo-title')).toHaveText(TODO_ITEMS);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test('should not count removed item in current todo', async ({ page }) => {
    await createTodo(page);
    const todoItems = page.getByTestId('todo-item');
    const todoCount = page.getByTestId('todo-count');
    await expect(todoCount).toContainText('3');
    await todoItems.nth(1).dblclick();
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('');
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Enter');
    await expect(todoCount).toContainText('2');
  });
});


test.describe('Mark all as completed', () => {
  test.beforeEach(async ({ page }) => {
    await createTodo(page);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test('should be able to mark all items as completed', async ({ page }) => {

    // Check first item
    const firstTodo = page.getByTestId('todo-item').nth(0);
    await firstTodo.getByRole('checkbox').check();
    await expect(firstTodo).toHaveClass('completed');

    // Check second item
    const secondTodo = page.getByTestId('todo-item').nth(1);
    await expect(secondTodo).not.toHaveClass('completed');
    await secondTodo.getByRole('checkbox').check();

    // Check third item
    const thirdTodo = page.getByTestId('todo-item').nth(2);
    await expect(thirdTodo).not.toHaveClass('completed');
    await thirdTodo.getByRole('checkbox').check();

    // Should be completed class
    await expect(firstTodo).toHaveClass('completed');
    await expect(secondTodo).toHaveClass('completed');
    await expect(thirdTodo).toHaveClass('completed');
  });

  test('should allow to clear the completed state back to incomplete', async ({ page }) => {
    const toggleAll = page.getByLabel('Mark all as complete');
    
    // Check and then uncheck
    await toggleAll.check();
    await toggleAll.uncheck();

    // No completed classes
    await expect(page.getByTestId('todo-item')).toHaveClass(['', '', '']);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test('should allow marking all as completed with arrow next to the prompt', async ({ page }) => {
    
    // Mark complete all todos
    await page.getByLabel('Mark all as complete').check();

    // Ensure all todos have completed class
    await expect(page.getByTestId('todo-item')).toHaveClass(['completed', 'completed', 'completed']);
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test('should be able to reset the complete state of all items', async ({ page }) => {
    const toggleAll = page.getByLabel('Mark all as complete');
    
    // Check and then uncheck
    await toggleAll.check();
    await toggleAll.uncheck();

    // No completed classes
    await expect(page.getByTestId('todo-item')).toHaveClass(['', '', '']);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test('Clear completed button should be hidden when no items are completed', async ({ page }) => {
    await page.locator('.todo-list li .toggle').first().check();
    await page.getByRole('button', { name: 'Clear completed' }).click();
    await expect(page.getByRole('button', { name: 'Clear completed' })).toBeHidden();
  });
});


test.describe('Edit existing todos', () => {
  test.beforeEach(async ({ page }) => {
    await createTodo(page);
    await checkNumberOfTodosInLocalStorage(page, 3);
    });  
  test('should be able to edit a record', async ({ page }) => {
    const todoItems = page.getByTestId('todo-item');
    const secondTodo = todoItems.nth(1);
    await secondTodo.dblclick();
    await expect(secondTodo.getByRole('textbox', { name: 'Edit' })).toHaveValue(TODO_ITEMS[1]);
    await secondTodo.getByRole('textbox', { name: 'Edit' }).fill('fix the car');
    await secondTodo.getByRole('textbox', { name: 'Edit' }).press('Enter');
    await expect(todoItems).toHaveText([
      TODO_ITEMS[0],
      'fix the car',
      TODO_ITEMS[2]
    ]);
    await checkTodosInLocalStorage(page, 'fix the car');
  });

  test('should trim entered text', async ({ page }) => {
    const todoItems = page.getByTestId('todo-item');
    await todoItems.nth(1).dblclick();
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('    fix the car    ');
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Enter');
    await expect(todoItems).toHaveText([
      TODO_ITEMS[0],
      'fix the car',
      TODO_ITEMS[2],
    ]);
    await checkTodosInLocalStorage(page, 'fix the car');
  });

  test('should remove the item if text is cleared', async ({ page }) => {
    const todoItems = page.getByTestId('todo-item');
    await todoItems.nth(1).dblclick();
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('');
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Enter');

    await expect(todoItems).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[2],
    ]);
  });

  test('should cancel edits on escape', async ({ page }) => {
    const todoItems = page.getByTestId('todo-item');
    await todoItems.nth(1).dblclick();
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).fill('fix the car');
    await todoItems.nth(1).getByRole('textbox', { name: 'Edit' }).press('Escape');
    await expect(todoItems).toHaveText(TODO_ITEMS);
  });

  test('complete all checkbox should update state when items are marked and un-marked complete', async ({ page }) => {
    const toggleAll = page.getByLabel('Mark all as complete');
    await toggleAll.check();
    await expect(toggleAll).toBeChecked();
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);

    // Uncheck first todo
    const firstTodo = page.getByTestId('todo-item').nth(0);
    await firstTodo.getByRole('checkbox').uncheck();

    // Ensure toggleAll is not checked
    await expect(toggleAll).not.toBeChecked();

    await firstTodo.getByRole('checkbox').check();
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);

    // Ensure toggleAll is checked now
    await expect(toggleAll).toBeChecked();
    await checkNumberOfTodosInLocalStorage(page, 3);
  });
});


test.describe('Other functions', () => {
   test('should disable buttons when editing', async ({ page }) => {
        await createTodo(page);
        await checkNumberOfTodosInLocalStorage(page, 3);
        const todoItem = page.getByTestId('todo-item').nth(1);
        await todoItem.dblclick();
        await expect(todoItem.getByRole('checkbox')).not.toBeVisible();
        await expect(todoItem.locator('label', {
          hasText: TODO_ITEMS[1],
        })).not.toBeVisible();
        await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test('should filter list on completion by active or complete links', async ({ page }) => {
    await createTodo(page);
    await checkTodosInLocalStorage(page, TODO_ITEMS[0]);
    await expect(page.getByRole('link', { name: 'All' })).toHaveClass('selected');
    
    //Create locators for active and completed links
    const activeLink = page.getByRole('link', { name: 'Active' });
    const completedLink = page.getByRole('link', { name: 'Completed' });
    await activeLink.click();
    await expect(activeLink).toHaveClass('selected');
    await completedLink.click();
    await expect(completedLink).toHaveClass('selected');
  });

  test('should persist its data on browser reload', async ({ page }) => {
    // Create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    for (const item of TODO_ITEMS.slice(0, 2)) {
      await newTodo.fill(item);
      await newTodo.press('Enter');
    }

    const todoItems = page.getByTestId('todo-item');
    const firstTodoCheck = todoItems.nth(0).getByRole('checkbox');
    await firstTodoCheck.check();
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await expect(firstTodoCheck).toBeChecked();
    await expect(todoItems).toHaveClass(['completed', '']);

    // Ensure there is 1 completed item
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
    await page.reload();
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await expect(firstTodoCheck).toBeChecked();
    await expect(todoItems).toHaveClass(['completed', '']);
  }); 

  test('should be able to display all items', async ({ page }) => {
    await createTodo(page);
    await checkTodosInLocalStorage(page, TODO_ITEMS[0]);
    const todoItem = page.getByTestId('todo-item');

    // Mark 1 item completed
    await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
    await checkNumberOfCompletedTodosInLocalStorage(page, 1);
    await page.getByRole('link', { name: 'Active' }).click();
    await expect(todoItem).toHaveCount(2);
    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(todoItem).toHaveCount(1);
    await page.getByRole('link', { name: 'All' }).click();
    await expect(todoItem).toHaveCount(3);
    await expect(page.getByTestId('todo-item')).toHaveCount(3);
  });

  test('should not remove active items when clear completed is clicked', async ({ page }) => {
    await createTodo(page);
    const todoItems = page.getByTestId('todo-item');
    await todoItems.nth(1).getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Clear completed' }).click();
    await expect(todoItems).toHaveCount(2);
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });
});
