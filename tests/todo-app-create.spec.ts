import { test, expect } from '@playwright/test';
import { TodoAppPage } from '../src/pages/todo-app-page';

let todoAppPage;

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  todoAppPage = new TodoAppPage(page);
});

test.describe('Create New Todo', () => {
  test('should be able to create new items on the page', async ({ page }) => {
    // Arrange
    await todoAppPage.addItem(0);

    // Assert
    await expect(page.getByTestId('todo-title')).toHaveText([todoAppPage.TODO_ITEMS[0]]);

    // Act - Create 2nd todo.
    await todoAppPage.addItem(1);

    // Assert - Make sure the list now has two todo items.
    await expect(page.getByTestId('todo-title')).toHaveText([
      todoAppPage.TODO_ITEMS[0],
      todoAppPage.TODO_ITEMS[1]
    ]);

    // Assert
    await todoAppPage.checkNumberOfTodosInLocalStorage(page, 2);
  });

  test('should be able to clear input text when an item is added', async () => {
    // Arrange
    await todoAppPage.addItem(0);

    // Act
    await todoAppPage.newTodoLocator.dblclick();
    const inputValueAfterTodoAdded = await todoAppPage.newTodoLocator.inputValue();

    // Assert
    await expect(inputValueAfterTodoAdded).toBe('');
  });

  test('should trim entered text', async () => {
    // Arrange
    const newEditedString = '      Lotto649Winner     ';
    const lengthOfEditedString = newEditedString.length;

    // Act
    await todoAppPage.newTodoLocator.fill(newEditedString);
    await todoAppPage.newTodoLocator.press('Enter');
    
    // Assert
    await expect(todoAppPage.todoItemTitleLocator.textContent.length).toBeLessThan(lengthOfEditedString);
  });


  test('should append new items to the bottom of the list', async () => {
    // Arrange/Act
    await todoAppPage.addItem(2);
    
    // Arrange/Act
    await todoAppPage.addItem(1);
    
    // Assert - Ensure new todo is at the bottom of the list
    await expect(todoAppPage.todoItemTitleLocator.nth(1)).toHaveText(todoAppPage.TODO_ITEMS[1]);
  });
});