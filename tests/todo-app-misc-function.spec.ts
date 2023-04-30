import { test, expect } from '@playwright/test';
import { TodoAppPage } from '../src/pages/todo-app-page';

let todoAppPage;

test.beforeEach(async ({ page }) => {
	await page.goto('https://demo.playwright.dev/todomvc');
	todoAppPage = new TodoAppPage(page);
});

test.describe('other Functions', () => {
  test('should disable buttons when editing an item', async () => {
		// Arrange - insert item to work with
		await todoAppPage.addItem(0);

    // Act - double click on inserted item
    await todoAppPage.todoItemTitleLocator.dblclick();

    // Assert - ensure no buttons are available during edit stage
    await expect(todoAppPage.todoItemDeleteButtonLocator).not.toBeVisible();
    await expect(todoAppPage.todoToggleLocator).not.toBeVisible();
  });


  test('should filter the list on completion by the active or complete filters', async () => {
    // Arrange - insert item to work with
    await todoAppPage.addItem(0);

		// Act - switch to active filter view
    await todoAppPage.filterActiveLocator.click();

    // Assert - ensure item is visible
    await expect(todoAppPage.todoItemTitleLocator).toBeVisible();

    // Act - switch to completed filter view
    await todoAppPage.filterCompletedLocator.click();

    // Assert - ensure no items are completed
    await expect(todoAppPage.todoItemTitleLocator).not.toBeVisible();

    // Act - switch to all filtered view complete items then switch back
		//       to active filter view
    await todoAppPage.filterAllLocator.click();
    await todoAppPage.todoToggleLocator.click();
    await todoAppPage.filterActiveLocator.click();

    // Assert - no todo items should be visible
    await expect(todoAppPage.todoItemTitleLocator).not.toBeVisible();

    // Act - switch to completed view
    await todoAppPage.filterCompletedLocator.click();

    // Assert - ensure item is visible in completed filter view
    await expect(todoAppPage.todoItemTitleLocator).toBeVisible();
  });

  test('should persist its data on browser refresh', async ({ page }) => {
		// Arrange - insert item to work with
		await todoAppPage.addItem(0);
		
    // Act - reload the page
    await todoAppPage.page.reload();

    // Assert - ensure items persist on refresh
    await todoAppPage.checkNumberOfTodosInLocalStorage(page, 1);
    await expect(todoAppPage.todoItemTitleLocator).toHaveText(todoAppPage.TODO_ITEMS[0]);
  });
});