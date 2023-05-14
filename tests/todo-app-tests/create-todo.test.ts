
import { Todo_Items, TODO_ITEMS } from '../../src/const';
import { test, expect } from '../../src/_fixtures/test-fixtures'

test.describe.parallel('Create Todo Tests', () => {

    test.beforeEach(async ({ todoPage }) => {
        await todoPage.waitForAppready();
        await expect(todoPage.todoElements.createTodoInput).toBeVisible();
    })
   
    test('User Enters One Item To Empty List And verifies The same', async ({ todoPage }) => {
        await test.step('User Verifies the list is empty if no item is there', async () => {
            expect(await todoPage.todoElements.itemsAdded.count()).toBe(0)
        })
        await test.step('User enters one item only', async () => {
            await todoPage.addTodoInList(TODO_ITEMS[0])
            await expect(todoPage.todoElements.todoCount).toHaveText('1 item left')
        })
        await test.step('User verifies it should trim entered text', async () => {
            expect(await todoPage.todoElements.itemsAdded.count()).toBe(1)
            expect(await todoPage.todoElements.itemsAdded.first().textContent.length).toBeLessThan(Todo_Items.task1.taskValue.toString().length)
            expect(await todoPage.todoElements.itemsAdded.first().textContent()).toBe(Todo_Items.task1.taskValue.toString().trim())
        })
    })
    test('should append new items to the bottom of the list', async ({ todoPage }) => {
        await test.step('User enters the multiple  items', async () => {
            const numberOfTodos: number = 3;
            await todoPage.addMultipleTodos(numberOfTodos);
            if (numberOfTodos == 1) {
                await expect(todoPage.todoElements.todoCount).toHaveText(numberOfTodos + ' item left')
            } else {
                await expect(todoPage.todoElements.todoCount).toHaveText(numberOfTodos + ' items left')
            }
        })
        await test.step('User Verifies All The Entered Todos Are Added In List', async () => {
            const itemsSize = await todoPage.todoElements.itemsAdded.count()
            expect(itemsSize).toBe(3)
            for (let index = 0; index < itemsSize; index++) {
                expect(await todoPage.todoElements.itemsAdded.nth(index).textContent()).toBe(TODO_ITEMS[index].toString().trim())
            }
        })
    })

    test('App Should Not Allow User To Enter Existing ToDo ==> (Sample of Negative Test)', async ({ todoPage }) => {
        await test.step('User enters the multiple  todos', async () => {
            const numberOfTodos = 2;
            for (let index = 0; index < numberOfTodos; index++) {
                await todoPage.addTodoInList(["Stay Fit"])
                expect(await todoPage.todoElements.itemsAdded.count()).not.toBe(2)
                test.fail()
            }
        })
    })
})
