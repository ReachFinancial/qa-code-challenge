import { test, expect } from '@playwright/test';
import { TodoAppPage } from '../src/pages/todo-app-page';

let todoAppPage;

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  todoAppPage = new TodoAppPage(page);
});

test.describe('editing existing todos', () => {
  test('should be able to edit a record', async () => {
    // Arrange
    const newEditedString = 'Lotto649Winner';

    // Act
    await todoAppPage.addItemThenEditTodoItemWithPrompt(newEditedString, 'Enter');

    // Assert
    await expect(todoAppPage.todoItemTitleLocator).toHaveText(newEditedString);
  });

  test('should trim entered text', async () => {
    // Arrange
    const newEditedString = '      Lotto649Winner     ';
    const lengthOfEditedString = newEditedString.length;

    // Act
    await todoAppPage.addItemThenEditTodoItemWithPrompt(newEditedString, 'Enter');
    
    // Assert
    await expect(todoAppPage.todoItemTitleLocator.textContent.length).toBeLessThan(lengthOfEditedString);
  });

  test('should remove item if text is cleared', async () => {
    // Arrange
    const newEditedString = '';

    // Act
    await todoAppPage.addItemThenEditTodoItemWithPrompt(newEditedString, 'Enter');

    // Assert
    await expect(todoAppPage.todoItemTitleLocator).toHaveCount(0);
  });

  test('should cancel edits on escape', async () => {
    // Arrange
    const newEditedString = 'newText';

    // Act
    await todoAppPage.addItemThenEditTodoItemWithPrompt(newEditedString, 'Escape');

    // Assert
    await expect(todoAppPage.todoItemTitleLocator).toHaveText(todoAppPage.TODO_ITEMS[0]);
  });
});