import { test, expect } from '@playwright/test';
import { TodoAppPage } from '../src/pages/todo-app-page';

let todoAppPage;

test.beforeEach(async ({ page }) => {
	await page.goto('https://demo.playwright.dev/todomvc');
	todoAppPage = new TodoAppPage(page);
});

test.describe('other Functions', () => {
  test('should disable buttons when editing an item', async () => {
		// Arrange
		await todoAppPage.addItem(0);

    // Act
    await todoAppPage.todoItemTitleLocator.dblclick();

    // Assert
    await expect(todoAppPage.todoItemDeleteButtonLocator).not.toBeVisible();
    await expect(todoAppPage.todoToggleLocator).not.toBeVisible();
  });


  test('should filter the list on completion by the active or complete filters', async () => {
    // Arrange
    await todoAppPage.addItem(0);

		// Act
    await todoAppPage.filterActiveLocator.click();

    // Assert
    await expect(todoAppPage.todoItemTitleLocator).toBeVisible();

    // Act
    await todoAppPage.filterCompletedLocator.click();

    // Assert
    await expect(todoAppPage.todoItemTitleLocator).not.toBeVisible();

    // Act
    await todoAppPage.filterAllLocator.click();
    await todoAppPage.todoToggleLocator.click();
    await todoAppPage.filterActiveLocator.click();

    // Assert
    await expect(todoAppPage.todoItemTitleLocator).not.toBeVisible();

    // Act
    await todoAppPage.filterCompletedLocator.click();

    // Assert
    await expect(todoAppPage.todoItemTitleLocator).toBeVisible();
  });

  test('should persist its data on browser refresh', async ({ page }) => {
		// Arrange
		await todoAppPage.addItem(0);
		
    // Act
    await todoAppPage.page.reload();

    // Assert
    await todoAppPage.checkNumberOfTodosInLocalStorage(page, 1);
    await expect(todoAppPage.todoItemTitleLocator).toHaveText(todoAppPage.TODO_ITEMS[0]);
  });
});