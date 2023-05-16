import { BasePage } from "../base.po";
import { TODO_ITEMS } from "../const";

export class TodoPage extends BasePage {
    readonly todoElements =
        {
            createTodoInput: this.page.locator('.new-todo'),
            todoCount: this.page.locator('.todo-count'),
            itemsAdded: this.page.locator('ul.todo-list li label'),
            editingElement: this.page.locator('.editing'),
            renameElement: this.page.locator('ul.todo-list li.editing input.edit')
        }
    readonly todoFilterElements =
        {
            allFilterTab: this.page.locator('ul.filters li a:has-text("All")'),
            activeFilterTab: this.page.locator('ul.filters li a:has-text("Active")'),
            completedFilterTab: this.page.locator('ul.filters li a:has-text("Completed")'),
            completedItems: this.page.getByTestId('todo-item'),
            toggleCheckbox: this.page.locator('.toggle'),
            toggleAllButton: this.page.locator('.toggle-all'),
            clearCompletedButton: this.page.locator('.clear-completed'),
            destroyButton: this.page.locator('.destroy'),
            selectedTab: this.page.locator('.selected')
        }


    async addTodoInList(todoInput: string[]): Promise<void> {
        for (const todo of todoInput) {
            await this.todoElements.createTodoInput.clear();
            await this.todoElements.createTodoInput.type(todo)
            await this.page.keyboard.press("Enter")
        }
    }

    async editTodo(todoInput: string[]): Promise<void> {
        const itemsSize = await this.todoElements.itemsAdded.count()
        for (let index = 0; index < itemsSize; index++) {
            const itemText = await this.todoElements.itemsAdded.nth(index).textContent();
            if (itemText?.includes(todoInput.toString().trim()))
                await this.todoElements.itemsAdded.nth(index).dblclick();
            break;
        }
    }

    async addMultipleTodos(numberOfTodos: number): Promise<void> {
        for (let index = 0; index < numberOfTodos; index++) {
            await this.addTodoInList(TODO_ITEMS[index])
        }
    }
}


