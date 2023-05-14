
import { Todo_Items, TODO_ITEMS } from '../src/const';
import { test, expect } from '../src/_fixtures/test-fixtures'


test.describe.parallel.only('Edit Todo Tests', () => {

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
        await test.step('User double click on item to edit', async () => {
            await todo.editTodo(TODO_ITEMS[0])
            await expect(todo.todoElements.editingElement).toBeVisible()
            expect(await todo.todoElements.editingElement.count()).toBe(1)
        })
        await test.step('User renames/edits the selected item from list', async () => {
            await todo.todoElements.renameElement.clear()
            await todo.todoElements.renameElement.type(Todo_Items.task3.taskValue.toString())
            await todo.page.keyboard.press('Enter')
        })
        await test.step('User verifies the updated item in the list', async () => {
            expect(await todo.todoElements.itemsAdded.count()).toBeGreaterThanOrEqual(1)
            expect(await todo.todoElements.itemsAdded.first().textContent()).toBe(Todo_Items.task3.taskValue.toString().trim())
        })
    })
    test('Removing Of Item On Clearing The Text Upon Editing', async ({ todo }) => {
        await test.step('User double click on item to edit', async () => {
            await todo.editTodo(TODO_ITEMS[0])
            await expect(todo.todoElements.editingElement).toBeVisible()
            expect(await todo.todoElements.editingElement.count()).toBe(1)
        })
        await test.step('User clears the selected item text from list', async () => {
            await todo.todoElements.renameElement.clear()
            await todo.page.keyboard.press('Enter')
        })
        await test.step('User verifies the removed item from  the list', async () => {
            expect(await todo.todoElements.itemsAdded.count()).toBe(0)
        })
    })
    
    test('Canceling The Editing Item', async ({ todo }) => {
        await test.step('User double click on entered todo to edit', async () => {
            await todo.editTodo(TODO_ITEMS[0])
            await expect(todo.todoElements.editingElement).toBeVisible()
            expect(await todo.todoElements.editingElement.count()).toBe(1)
        })
        await test.step('User presses ESC to cancel edit', async () => {
            await todo.page.keyboard.press('Escape')
            await expect(todo.todoElements.editingElement).not.toBeVisible()
            expect(await todo.todoElements.editingElement.count()).toBe(0)
        })
        await test.step('User verifies non-edite item should remains in list', async () => {
            expect(await todo.todoElements.itemsAdded.count()).toBeGreaterThanOrEqual(1)
            expect(await todo.todoElements.itemsAdded.first().textContent()).toBe(Todo_Items.task1.taskValue.toString().trim())
        })
    })
})


