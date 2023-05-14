import { test, expect } from '../../src/_fixtures/test-fixtures'
import { TODO_ITEMS } from '../../src/const';


test.describe.parallel('Misc Functions Tests', () => {
    const numberOfTodos: number = 3
    test.beforeEach(async ({ todoPage }) => {
        await todoPage.waitForAppready();
        await expect(todoPage.todoElements.createTodoInput).toBeVisible();

    })

    test('should disable buttons when editing an item', async ({ todoPage }) => {
        await test.step('Add and edit todo item ', async () => {
            await todoPage.addTodoInList(TODO_ITEMS[0])
            await todoPage.editTodo(TODO_ITEMS[0])
            expect(await todoPage.todoElements.itemsAdded.count()).toBe(1)
        })

        await test.step('verify destroy button is disabled on editing an item ', async () => {
            await expect(todoPage.todoFilterElements.destroyButton).not.toBeVisible();
        })
        await test.step('verify toggle button is disabled on editing an item ', async () => {
            await expect(todoPage.todoFilterElements.toggleCheckbox).not.toBeVisible();
        })
    })

    test('should filter the list on completion by the active or complete filters', async ({ todoPage }) => {
        await test.step('Add multiple items and complete first item  ', async () => {
            await todoPage.addMultipleTodos(numberOfTodos)
            await todoPage.todoFilterElements.toggleCheckbox.nth(0).click()
        })
        await test.step('verify number of items in All filter ', async () => {
            await todoPage.todoFilterElements.allFilterTab.click()
            expect(await todoPage.todoElements.itemsAdded.count()).toBe(3)
        })
        await test.step('verify number of items in completed filter ', async () => {
            await todoPage.todoFilterElements.completedFilterTab.click()
            expect(await todoPage.todoElements.itemsAdded.count()).toBe(1)
            expect(await todoPage.todoFilterElements.completedItems).toHaveClass('completed')
        })
        await test.step('verify number of items in active filter ', async () => {
            await todoPage.todoFilterElements.activeFilterTab.click()
            expect(await todoPage.todoElements.itemsAdded.count()).toBe(2)
        })
    })
})