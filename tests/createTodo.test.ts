
import { TODO_ITEMS } from '../src/const';
import { test, expect } from '../src/_fixtures/test-fixtures'


test.describe.parallel('Create a Todo tests', () => {

    test.beforeEach(async ({ todo }) => {
        await todo.waitForAppready();
        await expect(todo.todoElements.createTodoInput).toBeVisible();
    })

    test('User creates One Todo and verifies the same', async ({ todo }) => {
        await test.step('User enters the first todo task', async () => {
            await todo.todoElements.createTodoInput.clear();
            await todo.todoElements.createTodoInput.type(TODO_ITEMS.task1.taskValue)
            await todo.page.keyboard.press("Enter")
        })
        await test.step('User verifies the created task is added in list', async () => {
            expect(await todo.todoElements.todoList.count()).toBe(1)
            expect(await todo.todoElements.todoList.first().textContent()).toBe(TODO_ITEMS.task1.taskValue)
            await todo.page.waitForTimeout(4000)
        })
    })
    test('User craetes multiple Todos and verifies the same ', async ({ todo }) => {
        await test.step('User enters the second  todo', async () => {
            await todo.todoElements.createTodoInput.clear();
            await todo.todoElements.createTodoInput.type(TODO_ITEMS.task1.taskValue)
            await todo.page.keyboard.press("Enter")
            await todo.todoElements.createTodoInput.type(TODO_ITEMS.task2.taskValue)
            await todo.page.keyboard.press("Enter")
            await todo.todoElements.createTodoInput.type(TODO_ITEMS.task3.taskValue)
            await todo.page.keyboard.press("Enter")
        })
        await test.step('User verifies the second created task is added in list', async () => {
            expect(await todo.todoElements.todoList.count()).toBe(3)
            expect(await todo.todoElements.todoList.nth(0).textContent()).toBe(TODO_ITEMS.task1.taskValue)
            expect(await todo.todoElements.todoList.nth(1).textContent()).toBe(TODO_ITEMS.task2.taskValue)
            expect(await todo.todoElements.todoList.nth(2).textContent()).toBe(TODO_ITEMS.task3.taskValue)
            await todo.page.waitForTimeout(4000)
        })
    })
})
