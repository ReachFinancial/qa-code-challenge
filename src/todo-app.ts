import { Page } from "playwright";



export async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
return await page.waitForFunction(e => {
    return JSON.parse(localStorage['react-todos']).length === e;
}, expected);
}

export async function checkNumberOfCompletedTodosInLocalStorage(page: Page, expected: number) {
return await page.waitForFunction(e => {
    return JSON.parse(localStorage['react-todos']).filter((todo: any) => todo.completed).length === e;
}, expected);
}

export async function checkTodosInLocalStorage(page: Page, title: string) {
return await page.waitForFunction(t => {
    return JSON.parse(localStorage['react-todos']).map((todo: any) => todo.title).includes(t);
}, title);
}

export async function createTodo(page: Page) {
    const TODO_ITEMS = [
        'buy milk',
        'buy eggs',
        'buy cheese'
      ];
    const newTodo = page.getByPlaceholder('What needs to be done?');
    for (const item of TODO_ITEMS) {
      await newTodo.fill(item);
      await newTodo.press('Enter');
    }
  }