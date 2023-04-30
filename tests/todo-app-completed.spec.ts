import { test } from '@playwright/test';
import { TodoAppPage } from '../src/pages/todo-app-page';

let todoAppPage;

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  todoAppPage = new TodoAppPage(page);
});

test.describe('Todos Completed', () => {
  test('should be able to successfully mark all todo as completed', async () => {
    // Arrange  - a list of todo items
    //Act       - insert all the items into the list
    await todoAppPage.addAllTodoItems();

    // Assert   - check that all items are checked 'completed'
    await todoAppPage.checkCompletedTasks(true, true);
  });

  test('should be able to successfully convert back completed tasks to incomplete', async () => {
    // Arrange - insert items as todo items in the list
    await todoAppPage.addAllTodoItems();

    // Arrange - set all todo items to be completed
    await todoAppPage.TodosCompleted();

    // Act - change filter to active and toggle all at same time
    await todoAppPage.filterActiveLocator.click();
    await todoAppPage.todoToggleAllLocator.click();

    // Assert - all items are not completed
    await todoAppPage.checkCompletedTasks(false);
  });

  test('should be able to successfully mark all completed with arrow next to the prompt', async () => {
    // Arrange - items into the todo list
    await todoAppPage.addAllTodoItems();

    // Act - toggle all items to completed
    await todoAppPage.todoToggleAllLocator.click();
    
    // Assert - all items are completed
    await todoAppPage.checkCompletedTasks(true);
  });
});