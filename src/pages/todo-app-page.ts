import { Locator, Page, expect } from '@playwright/test';

export class TodoAppPage {
    readonly page: Page;
    // filter Locators
    readonly filterActiveLocator: Locator;
    readonly filterAllLocator: Locator;
    readonly filterCompletedLocator: Locator;
		readonly clearCompleted: Locator;
    //inputs
    readonly newTodoLocator: Locator;
    readonly todoItemCheckboxLocator: Locator;
    readonly todoItemDeleteButtonLocator: Locator;
    readonly todoItemEditLocator: Locator;
    readonly todoItemTitleLocator: Locator;
    readonly todoToggleLocator: Locator;
    readonly todoToggleAllLocator: Locator;
    // earse the ones below
    // readonly getStartedLink: Locator;
    // readonly gettingStartedHeader: Locator;
    // readonly pomLink: Locator;
    // readonly tocList: Locator;

  constructor(page: Page) {
    this.page = page;
		//filters
		this.filterActiveLocator = page.locator('a[href="#/active"]');
    this.filterAllLocator = page.locator('a[href="#/"]');
    this.filterCompletedLocator = page.locator('a[href="#/completed"]');
		this.clearCompleted = page.locator('button[class="clear-completed"]');
		//inputs
    this.newTodoLocator = page.locator('input[class="new-todo"]');
    this.todoItemCheckboxLocator = page.locator('li[data-testid="todo-item"]');
    this.todoItemDeleteButtonLocator = page.locator('button[class="destroy"]');
    this.todoItemEditLocator = page.locator('input[class="edit"]');
    this.todoItemTitleLocator = page.locator('label[data-testid="todo-title"]');
    this.todoToggleLocator = page.locator('input[class="toggle"]');
    this.todoToggleAllLocator = page.locator('input[id="toggle-all"]');

    // this.getStartedLink = page.locator('a', { hasText: 'Get started' });
    // this.gettingStartedHeader = page.locator('h1', { hasText: 'Installation' });
    // this.pomLink = page.locator('li', { hasText: 'Guides' }).locator('a', { hasText: 'Page Object Model' });
    // this.tocList = page.locator('empty');
  }

	TODO_ITEMS = [
		'complete code challenge for reach',
		'ensure coverage for all items is automated',
		'finish my tiramisu'
	];
	
  async checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
		return await page.waitForFunction(e => {
			return JSON.parse(localStorage['react-todos']).length === e;
			}, expected);
  }

	async checkNumberOfCompletedTodosInLocalStorage(page: Page, expected: number) {
		return await page.waitForFunction(e => {
			return JSON.parse(localStorage['react-todos']).filter((todo: any) => todo.completed).length === e;
			}, expected);
	}

	async checkTodosInLocalStorage(page: Page, title: string) {
		return await page.waitForFunction(t => {
				return JSON.parse(localStorage['react-todos']).map((todo: any) => todo.title).includes(t);
		}, title);
	}

	// add all todo items
	async addAllTodoItems() {
		this.TODO_ITEMS.forEach(async (item, index) => {
			await this.newTodoLocator.fill(item[index]);
			await this.newTodoLocator.press('Enter');
		});
	}

	// complete all todos at a single time
	async TodosCompleted () {
		return await this.todoToggleAllLocator.click()
	}

	async allTodosCompleted() {
		const countTodos = await this.todoItemCheckboxLocator.count();
		for(let i = 0; i < countTodos; i++) {
			await expect(this.todoItemCheckboxLocator.nth(i)).toBeChecked();
		}
	}
}