import { test, expect, type Page } from '@playwright/test';
import { TodoAppPage } from '../src/pages/todo-app-page'

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
});

test.describe('Create New Todo', () => {
  test('should be able to create new items on the page', async ({ page }) => {
    // Arrange
    const todoAppPage = new TodoAppPage(page);
    
    // Act - Create 1st todo.
    await todoAppPage.addItem(0);

    // Assert - Make sure the list only has one todo item.
    await expect(page.getByTestId('todo-title')).toHaveText([
      todoAppPage.TODO_ITEMS[0]
    ]);

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

  test('should trim entered text', async ({ page }) => {

    // Arrange
    const todoAppPage = new TodoAppPage(page);
    const newEditedString = '      Lotto649Winner     ';
    const lengthOfEditedString = newEditedString.length;

    // Act
    // Create a new todo
    await todoAppPage.newTodoLocator.fill(newEditedString);
    await todoAppPage.newTodoLocator.press('Enter');
    
    // Assert
    // Ensure input field is empty.
    await expect(todoAppPage.todoItemTitleLocator.textContent.length).toBeLessThan(lengthOfEditedString);
  });


  test('should append new items to the bottom of the list', async ({ page }) => {
    // Arrange
    const todoAppPage = new TodoAppPage(page);
    
    // Act - Create 1st todo.
    await todoAppPage.addItem(2);
    
    // Act - Create 2nd todo.
    await todoAppPage.addItem(1);
    
    // Assert - Ensure new todo is at the bottom of the list
    await expect(todoAppPage.todoItemTitleLocator.nth(1)).toHaveText(todoAppPage.TODO_ITEMS[1]);
  });
});

test.describe('Todos Completed', () => {
  test('should be able to successfully mark all todo as completed', async ({ page }) => {
    // Arrange
    const todoAppPage = new TodoAppPage(page);
    
    // Act - Add All Items todo
    await todoAppPage.addAllTodoItems();

    // Assert
    await todoAppPage.checkCompletedTasks(true, true);
  });

  test('should be able to successfully convert back completed tasks to incomplete', async ({ page }) => {
    // Arrange
    const todoAppPage = new TodoAppPage(page);
    
    // Act - Add All Items todo
    await todoAppPage.addAllTodoItems();
    await todoAppPage.TodosCompleted();
    await todoAppPage.filterActiveLocator.click();
    await todoAppPage.todoToggleAllLocator.click();

    // Assert
    await todoAppPage.checkCompletedTasks(false, false);
  });

  test('should be able to successfully mark all completed with arrow next to the prompt', async ({ page }) => {
    // Arrange
    const todoAppPage = new TodoAppPage(page);
    
    // Act - Add All Items todo
    await todoAppPage.addAllTodoItems();

    // Act
    await todoAppPage.todoToggleAllLocator.click();
    
    // Assert
    await todoAppPage.checkCompletedTasks(true, false);
  });
});

test.describe('editing existing todos', () => {
  test('should be able to edit a record', async ({ page }) => {
    // Arrange
    const todoAppPage = new TodoAppPage(page);
    const newEditedString = 'Lotto649Winner';
    // Act - Add All Items todo
    await todoAppPage.addItem(0);
    await todoAppPage.todoItemTitleLocator.dblclick();

    await todoAppPage.editTodoItem(newEditedString, 'Enter');

    // Assert
    await expect(todoAppPage.todoItemTitleLocator).toHaveText(newEditedString);
  });

  test('should trim entered text', async ({ page }) => {
    // Arrange
    const todoAppPage = new TodoAppPage(page);
    const newEditedString = '      Lotto649Winner     ';
    const lengthOfEditedString = newEditedString.length;

    // Act - Add All Items todo
    await todoAppPage.addItem(0);
    await todoAppPage.todoItemTitleLocator.dblclick();

    await todoAppPage.editTodoItem(newEditedString, 'Enter');
    // Assert
    await expect(todoAppPage.todoItemTitleLocator.textContent.length).toBeLessThan(lengthOfEditedString);
  });

  test('should remove item if text is cleared', async ({ page }) => {
    // Arrange
    const todoAppPage = new TodoAppPage(page);
    const newEditedString = '';

    // Act - Add All Items todo
    await todoAppPage.addItem(0);
    await todoAppPage.todoItemTitleLocator.dblclick();

    await todoAppPage.editTodoItem(newEditedString, 'Enter');

    // Assert
    await expect(await todoAppPage.todoItemTitleLocator).toHaveCount(0);
  });

  test('should cancel edits on escape', async ({ page }) => {
    // Arrange
    const todoAppPage = new TodoAppPage(page);
    const newEditedString = 'newText';

    // Act - Add All Items todo
    await todoAppPage.addItem(0);
    await todoAppPage.todoItemTitleLocator.dblclick();

    await todoAppPage.editTodoItem(newEditedString, 'Escape');

    // Assert
    await expect(todoAppPage.todoItemTitleLocator).toHaveText(todoAppPage.TODO_ITEMS[0]);
  });
});

test.describe('other Functions', () => {
  test('should disable buttons when editing an item', async ({ page }) => {
    // Arrange
    const todoAppPage = new TodoAppPage(page);

    // Act - Add All Items todo
    await todoAppPage.addItem(0);
    await todoAppPage.todoItemTitleLocator.dblclick();

    // Assert
    await expect(todoAppPage.todoItemDeleteButtonLocator).not.toBeVisible();
    await expect(todoAppPage.todoToggleLocator).not.toBeVisible();
  });


  test('should filter the list on completion by the active or complete filters', async ({ page }) => {
    // Arrange
    const todoAppPage = new TodoAppPage(page);
    
    // Act - Add All Items todo
    await todoAppPage.addItem(0);
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
    const todoAppPage = new TodoAppPage(page);

    // Act - Add All Items todo
    await todoAppPage.addItem(0);
    await todoAppPage.page.reload();

    // Assert
    await todoAppPage.checkNumberOfTodosInLocalStorage(page, 1);
    await expect(todoAppPage.todoItemTitleLocator).toHaveText(todoAppPage.TODO_ITEMS[0]);
  });
});

