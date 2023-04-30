import { test } from '@playwright/test';
import { TodoAppPage } from '../src/pages/todo-app-page';

let todoAppPage;

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  todoAppPage = new TodoAppPage(page);
});

test.describe('Todos Completed', () => {
  test('should be able to successfully mark all todo as completed', async () => {
    // Arrange/Act
    await todoAppPage.addAllTodoItems();

    // Assert
    await todoAppPage.checkCompletedTasks(true, true);
  });

  test('should be able to successfully convert back completed tasks to incomplete', async () => {
    // Arrange
    await todoAppPage.addAllTodoItems();
    await todoAppPage.TodosCompleted();

    // Act
    await todoAppPage.filterActiveLocator.click();
    await todoAppPage.todoToggleAllLocator.click();

    // Assert
    await todoAppPage.checkCompletedTasks(false, false);
  });

  test('should be able to successfully mark all completed with arrow next to the prompt', async () => {
    // Arrange
    await todoAppPage.addAllTodoItems();

    // Act
    await todoAppPage.todoToggleAllLocator.click();
    
    // Assert
    await todoAppPage.checkCompletedTasks(true, false);
  });
});