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

  constructor(page: Page) {
    this.page = page;
		//filters
		this.filterActiveLocator = page.locator('a[href="#/active"]');
    this.filterAllLocator = page.locator('a[href="#/"]');
    this.filterCompletedLocator = page.locator('a[href="#/completed"]');
		this.clearCompleted = page.locator('button[class="clear-completed"]');
		//inputs
    this.newTodoLocator = page.locator('input[class="new-todo"]');
    this.todoItemCheckboxLocator = page.getByTestId('todo-item');
    this.todoItemDeleteButtonLocator = page.locator('button[class="destroy"]');
    this.todoItemEditLocator = page.locator('input[class="edit"]');
    this.todoItemTitleLocator = page.locator('label[data-testid="todo-title"]');
    this.todoToggleLocator = page.locator('input[class="toggle"]');
    this.todoToggleAllLocator = page.locator('input[id="toggle-all"]');
  }

	// list of todo items for testing purposes
	TODO_ITEMS = [
		'complete code challenge for reach',
		'ensure coverage for all items is automated',
		'finish my tiramisu'
	];
	
	/**
	 *  go to website page
	 */
  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc');
  }

	/**
	 * 
	 * @param page page parameter tied to playwright
	 * @param expected number to assert with of todo items
	 * @returns if check is successful or not
	 */
  async checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
		return await page.waitForFunction(e => {
			return JSON.parse(localStorage['react-todos']).length === e;
			}, expected);
  }

	/**
	 * 
	 * @param page page parameter tied to playwright
	 * @param expected number to assert with of todo items
	 * @returns if check is successful or not
	 */
	async checkNumberOfCompletedTodosInLocalStorage(page: Page, expected: number) {
		return await page.waitForFunction(e => {
			return JSON.parse(localStorage['react-todos']).filter((todo: any) => todo.completed).length === e;
			}, expected);
	}

	/**
	 * 
	 * @param page page page parameter tied to playwright
	 * @param title title of todo item
	 * @returns if check is successful or not
	 */
	async checkTodosInLocalStorage(page: Page, title: string) {
		return await page.waitForFunction(t => {
				return JSON.parse(localStorage['react-todos']).map((todo: any) => todo.title).includes(t);
		}, title);
	}

	/**
	 * add single item from todo list
	 * @param index  index of value from TODO_ITEM list to insert into todo item
	 */
	async addItem(index:number) {
		await this.newTodoLocator.fill(this.TODO_ITEMS[index]);
    await this.newTodoLocator.press('Enter');
	}

	/**
	 * add all todo items
	 */
	async addAllTodoItems() {

		for(const i in this.TODO_ITEMS){
			await this.newTodoLocator.fill(this.TODO_ITEMS[i]);
			await this.newTodoLocator.press('Enter');
		}
	}

	// complete all todos at a single time
	/**
	 * 
	 * @returns all items to be completed via toggle all
	 */
	async TodosCompleted () {
		return await this.todoToggleAllLocator.click()
	}

	/**
	 * edit todo item
	 * @param newString string to fill into the todoItem during edit mode
	 * @param endingButtonAction button prompt at end eg, Enter, Escape
	 */
	async editTodoItem(newString: string, endingButtonAction: string) {
		await this.todoItemTitleLocator.press('Control+A');
    await this.todoItemTitleLocator.press('Delete');
    await this.todoItemEditLocator.fill(newString);
    await this.todoItemTitleLocator.press(endingButtonAction);
	}

	// check completed tasks depending on what is needed
	// not complete means run the code that checks that nothing is completed
	// otherwise run to check if completed and/or if toggle needs to be checked
	/**
	 * check completed tasks depending on what is needed
	 * not complete means run the code that checks that nothing is completed
	 * otherwise run to check if completed and/or if toggle needs to be checked
	 * @param notCompleted check if we should for completed or not completed todo items
	 * @param toggle  if we should toggle the items before checking for completion 
	 */
	async checkCompletedTasks(notCompleted: boolean, toggle = false) {
		if(notCompleted){
			if(toggle){
				for (let i = 0; i < this.TODO_ITEMS.length; i++) {
					await this.todoToggleLocator.nth(i).click();
					await expect(this.todoItemCheckboxLocator.nth(i)).toHaveClass('completed');
				};
			}
			else {
				for (let i = 0; i < this.TODO_ITEMS.length; i++) {
					await expect(this.todoItemCheckboxLocator.nth(i)).toHaveClass('completed');
				};
			}
		}
		else{
			for (let i = 0; i < this.TODO_ITEMS.length; i++) {
				await expect(this.todoItemCheckboxLocator.nth(i)).not.toHaveClass('completed');
			};
		}
	}

	/**
	 * 
	 * @param newEditedString the string to use when editing the todo item selected
	 * @param prompt the prompt to do when completing edit, eg, enter, escape
	 */
	async addItemThenEditTodoItemWithPrompt(newEditedString: string, prompt: string) {
		await this.addItem(0);
    await this.todoItemTitleLocator.dblclick();
    await this.editTodoItem(newEditedString, prompt);
	}
}