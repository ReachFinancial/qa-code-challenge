import { test, expect } from '@playwright/test';
import { TodoAppPage } from '../src/pages/todo-app-page';

let todoAppPage;

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  todoAppPage = new TodoAppPage(page);
});

test.describe('editing existing todos', () => {
  test('should be able to edit a record', async () => {
    // Arrange - string to use when editing todo item that is inserted
    const newEditedString = 'Lotto649Winner';

    // Act - insert first item from TODO_ITEMS and replace it with above string
    await todoAppPage.addItemThenEditTodoItemWithPrompt(newEditedString, 'Enter');

    // Assert - ensure that the string in the 
    //          todoitem is the one that was used during edit stage
    await expect(todoAppPage.todoItemTitleLocator).toHaveText(newEditedString);
  });

  test('should trim entered text', async () => {
    // Arrange  - padded string to use during edit stage 
    //            and length of that string for assertion
    const newEditedString = '      Lotto649Winner     ';
    const lengthOfEditedString = newEditedString.length;

    // Act - add first item from TODO_ITEM list and edit the string
    //       to string set in the 'Arrange' step
    await todoAppPage.addItemThenEditTodoItemWithPrompt(newEditedString, 'Enter');
    
    // Assert - assert that the string is trimmed as it replaces original text
    //          and assert that the length is less then original padded string
    await expect(todoAppPage.todoItemTitleLocator.textContent.length).toBeLessThan(lengthOfEditedString);
  });

  test('should remove item if text is cleared', async () => {
    // Arrange - empty string
    const newEditedString = '';

    // Act - add item from TODO_ITEM list and replace it with string from
    //       Arrange step
    await todoAppPage.addItemThenEditTodoItemWithPrompt(newEditedString, 'Enter');

    // Assert - when item is edited to empty it is removed and there shouldnt be
    //          any items in todo list
    await expect(todoAppPage.todoItemTitleLocator).toHaveCount(0);
  });

  test('should cancel edits on escape', async () => {
    // Arrange - string to use during edit
    const newEditedString = 'newText';

    // Act - insert item from TODO_ITEM list and replace it with string from 
    //       Arrange step
    await todoAppPage.addItemThenEditTodoItemWithPrompt(newEditedString, 'Escape');

    // Assert - should contain original texted insert from TODO_ITEM list
    await expect(todoAppPage.todoItemTitleLocator).toHaveText(todoAppPage.TODO_ITEMS[0]);
  });
});