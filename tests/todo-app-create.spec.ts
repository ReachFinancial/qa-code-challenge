import { test, expect } from '@playwright/test';
import { TodoAppPage } from '../src/pages/todo-app-page';

let todoAppPage;

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  todoAppPage = new TodoAppPage(page);
});

test.describe('Create New Todo', () => {
  test('should be able to create new items on the page', async ({ page }) => {
    // Arrange - add an item to the todo list
    await todoAppPage.addItem(0);

    // Assert - item has been added
    await expect(page.getByTestId('todo-title')).toHaveText([todoAppPage.TODO_ITEMS[0]]);

    // Act - Create 2nd todo.
    await todoAppPage.addItem(1);

    // Assert - Make sure the list now has two todo items.
    await expect(page.getByTestId('todo-title')).toHaveText([
      todoAppPage.TODO_ITEMS[0],
      todoAppPage.TODO_ITEMS[1]
    ]);

    // Assert - that there is two todos in local storage
    await todoAppPage.checkNumberOfTodosInLocalStorage(page, 2);
  });

  test('should be able to clear input text when an item is added', async () => {
    // Arrange - insert item to todo list
    await todoAppPage.addItem(0);

    // Act - double click the todo item and check the input value of it
    await todoAppPage.newTodoLocator.dblclick();
    const inputValueAfterTodoAdded = await todoAppPage.newTodoLocator.inputValue();

    // Assert - ensure the text field after inserting a todo is empty
    await expect(inputValueAfterTodoAdded).toBe('');
  });

  test('should trim entered text', async () => {
    // Arrange - string that is padded on both left and right empty spaces, and length of that string
    const newString = '      Lotto649Winner     ';
    const lengthOfEditedString = newString.length;

    // Act - insert padded string into todo item
    await todoAppPage.newTodoLocator.fill(newString);
    await todoAppPage.newTodoLocator.press('Enter');
    
    // Assert - ensure the item has been trimmed by checking
    //          todo item length of string is less then original
    //          added string
    await expect(todoAppPage.todoItemTitleLocator.textContent.length).toBeLessThan(lengthOfEditedString);
  });

  test('should append new items to the bottom of the list', async () => {
    // Arrange  - insert item to todo list
    //Act       - act on inserting new item
    await todoAppPage.addItem(2);
    
    // Arrange  - insert item to todo list
    //Act       - act on inserting new item
    await todoAppPage.addItem(1);
    
    // Assert - Ensure new todo is at the bottom of the list
    await expect(todoAppPage.todoItemTitleLocator.nth(1)).toHaveText(todoAppPage.TODO_ITEMS[1]);
  });
});