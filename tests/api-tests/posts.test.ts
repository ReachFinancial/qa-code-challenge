import { test, expect } from '../../src/_fixtures/test-fixtures'
import { Posts } from '../../src/api-helper/posts.api'

test.describe('Posts API Tests', () => {
    let responseGetAllPosts, responseData;
    let emptyArray: string[] = [];
    test.beforeEach(async () => {
        await test.step('Get All Posts Response', async () => {
            responseGetAllPosts = await Posts.getAllPosts();
        })
    })

    test.only('should get all posts in the system', async () => {

        await test.step('Verify Response Status Code ==> Get All Posts Response', async () => {
            expect(await responseGetAllPosts.statusCode).toEqual(200)
        })

        await test.step('Verify Response Count ==> Get All Posts Count Response', async () => {
            expect(await responseGetAllPosts.body.length).toBe(100)
        })
    })
    test.only('should be able to check how many posts per user', async () => {

        await test.step('Verify Response Status Code ==> Get All Posts Response', async () => {
            expect(await responseGetAllPosts.statusCode).toEqual(200)
        })

        await test.step('Verify Response Count ==> Get All Posts Count Response', async () => {
            expect(await responseGetAllPosts.body.length).toBe(100)
        })
    })
})