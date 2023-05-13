
import { Todo_Items, TODO_ITEMS } from '../src/const';
import { test, expect } from '../src/_fixtures/test-fixtures'


test.describe.parallel('Edit Todo Tests', () => {

    test.beforeEach(async ({ todo }) => {
        await todo.waitForAppready();
        await expect(todo.todoElements.createTodoInput).toBeVisible();
        await todo.createTodo(TODO_ITEMS[0])
    })
    test('User Verifies List should not be empty', async ({ todo }) => {
        expect(await todo.todoElements.itemsAdded.count()).toBeGreaterThanOrEqual(1)
    })
    test('User Verifies the item to be edited should be present in list', async ({ todo }) => {
        expect(await todo.todoElements.itemsAdded.first().textContent()).toBe(Todo_Items.task1.taskValue.toString().trim())
    })
    test('User Edits the Added Item Present In List', async ({ todo }) => {
        await test.step('User double click on entered todo to edit', async () => {
            // const itemsSize = await todo.todoElements.itemsAdded.count()
            // for (let index = 0; index < itemsSize; index++) {
            //     const itemText = await todo.todoElements.itemsAdded.nth(index).textContent();
            //     if (itemText?.includes(Todo_Items.task1.taskValue.toString().trim()))
            //         await todo.todoElements.itemsAdded.nth(index).dblclick();
            //     break;
            // }
            editTodo(TODO_ITEMS[0])
            await expect(todo.todoElements.editingElement).toBeVisible()
            expect(await todo.todoElements.editingElement.count()).toBe(1)
        })
        await test.step('User renames/edits the selected item from list', async () => {
            await todo.todoElements.renameElement.clear()
            await todo.todoElements.renameElement.type(Todo_Items.task3.taskValue.toString())
            await todo.page.keyboard.press('Enter')
        })
        await test.step('User verifies teh updated item in the list', async () => {
            expect(await todo.todoElements.itemsAdded.count()).toBe(1)
            expect(await todo.todoElements.itemsAdded.first().textContent()).toBe(Todo_Items.task3.taskValue.toString().trim())
        })
    })
})
