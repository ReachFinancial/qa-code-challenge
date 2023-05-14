
import { TODO_ITEMS, Todo_Items } from '../../src/const';
import { test, expect } from '../../src/_fixtures/test-fixtures'

test.describe.parallel('Filters Todo Test', () => {
    const numberOfTodos: number = 3;
    test.beforeEach(async ({ todoPage }) => {
        await todoPage.waitForAppready();
        await expect(todoPage.todoElements.createTodoInput).toBeVisible();
        await todoPage.addMultipleTodos(numberOfTodos)
    })

    test('should be able to mark all items as completed by marking each item', async ({ todoPage }) => {
        await test.step('Verify All tab filter should be selected upon items added', async () => {
            await expect(todoPage.todoFilterElements.selectedTab).toHaveText("All")
        })
        await test.step('User Verifies List should not be empty', async () => {
            expect(await todoPage.todoElements.itemsAdded.count()).toBeGreaterThanOrEqual(1)
        })
        await test.step('User Verifies more than 1 item should be present in list', async () => {
            expect(await todoPage.todoElements.itemsAdded.first().textContent()).toBe(Todo_Items.task1.taskValue.toString().trim())
        })
        await test.step('User switch to Active filter tab to verify the presence of added items', async () => {
            await todoPage.todoFilterElements.activeFilterTab.click()
            expect(await todoPage.todoElements.itemsAdded.count()).toBe(numberOfTodos)
        })
        await test.step('User marks on each item to complete', async () => {
            await todoPage.todoFilterElements.allFilterTab.click()
            for (let index = 0; index < numberOfTodos; index++) {
                await todoPage.todoFilterElements.toggleCheckbox.nth(index).click()
            }
        })
        await test.step('User verifies all the marked items should be under completed filter', async () => {
            await todoPage.todoFilterElements.completedFilterTab.click();
            expect(await todoPage.todoElements.itemsAdded.count()).toBe(numberOfTodos)
            await expect(todoPage.todoElements.todoCount).toHaveText('0 items left')
            const itemsSize = await todoPage.todoElements.itemsAdded.count()
            for (let index = 0; index < itemsSize; index++) {
                expect(await todoPage.todoElements.itemsAdded.nth(index).textContent()).toBe(TODO_ITEMS[index].toString().trim())
            }
        })
    })
    test('should allow marking all as completed with the arrow next to the prompt', async ({ todoPage }) => {
        await test.step('User clicks on all items from toggle-all button', async () => {
            await todoPage.todoFilterElements.activeFilterTab.click()
            await todoPage.todoFilterElements.toggleAllButton.click()
            expect(await todoPage.todoElements.itemsAdded.count()).toBe(0)
            await expect(todoPage.todoElements.todoCount).toHaveText('0 items left')
        })
        await test.step('User verifies all  marked items should be under completed filter', async () => {
            await todoPage.todoFilterElements.completedFilterTab.click();
            expect(await todoPage.todoElements.itemsAdded.count()).toBe(numberOfTodos)
            for (let index = 0; index < await todoPage.todoElements.itemsAdded.count(); index++) {
                expect(await todoPage.todoElements.itemsAdded.nth(index).textContent()).toBe(TODO_ITEMS[index].toString().trim())
            }
        })
    })
    test('should allow clearing the completed state back to incomplete', async ({ todoPage }) => {
        await test.step('User moves all the items to Active tab from completed tab and verifies No items to be left under Completed tab filter', async () => {
            await todoPage.todoFilterElements.activeFilterTab.click()
            await todoPage.todoFilterElements.toggleAllButton.click()
            expect(await todoPage.todoElements.itemsAdded.count()).toBe(0)
            await todoPage.todoFilterElements.completedFilterTab.click();
            expect(await todoPage.todoElements.itemsAdded.count()).toBe(numberOfTodos)
            await todoPage.todoFilterElements.toggleAllButton.click()
            expect(await todoPage.todoElements.itemsAdded.count()).toBe(0)

        })
        await test.step('User verifies all items presence under Active tab filter as incompleted', async () => {
            await todoPage.todoFilterElements.activeFilterTab.click();
            expect(await todoPage.todoElements.itemsAdded.count()).toBe(numberOfTodos)
            for (let index = 0; index < await todoPage.todoElements.itemsAdded.count(); index++) {
                expect(await todoPage.todoElements.itemsAdded.nth(index).textContent()).toBe(TODO_ITEMS[index].toString().trim())
            }
        })
    })
})