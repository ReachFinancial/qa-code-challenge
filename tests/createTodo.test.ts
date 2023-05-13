
import { Todo_Items, TODO_ITEMS } from '../src/const';
import { test, expect } from '../src/_fixtures/test-fixtures'


test.describe.parallel('Create Todo Tests', () => {

    test.beforeEach(async ({ todo }) => {
        await todo.waitForAppready();
        await expect(todo.todoElements.createTodoInput).toBeVisible();
    })
    test('User Verifies the list is empty if no item is there', async ({ todo }) => {

        expect(await todo.todoElements.itemsAdded.count()).toBe(0)
    })
    test('User Enters One Item To Empty List And verifies The same', async ({ todo }) => {
        await test.step('User enters one item only', async () => {
            await todo.createTodo(TODO_ITEMS[0])
        })
        await test.step('User verifies the entered todo is added', async () => {
            expect(await todo.todoElements.itemsAdded.count()).toBe(1)
            expect(await todo.todoElements.itemsAdded.first().textContent()).toBe(Todo_Items.task1.taskValue.toString().trim())
        })
    })
    test('User Enters Multiple Items & Verifies the Same ', async ({ todo }) => {

        await test.step('User enters the multiple  items', async () => {
            const numberOfTodos = 3;
            for (let index = 0; index < numberOfTodos; index++) {
                await todo.createTodo(TODO_ITEMS[index])
            }
        })
        await test.step('User Verifies All The Entered Todos Are Added In List', async () => {
            const itemsSize = await todo.todoElements.itemsAdded.count()
            expect(itemsSize).toBe(3)
            for (let index = 0; index < itemsSize; index++) {
                expect(await todo.todoElements.itemsAdded.nth(index).textContent()).toBe(TODO_ITEMS[index].toString().trim())
            }
        })
    })

    test('App Should Not Allow User To Enter Existing ToDo ==> (Sample of Negative Test)', async ({ todo }) => {
        await test.step('User enters the multiple  todos', async () => {
            const numberOfTodos = 2;
            for (let index = 0; index < numberOfTodos; index++) {
                await todo.createTodo(["Stay Fit"])
                expect(await todo.todoElements.itemsAdded.count()).not.toBe(2)
                test.fail()
            }
        })
    })
})
