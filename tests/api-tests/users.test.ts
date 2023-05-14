
import { test, expect } from '../../src/_fixtures/test-fixtures'
import { Users } from '../../src/api-helper/users.api'

test.describe.only('Users API Tests', () => {
    let responseGetAllUsers

    test('should get all users in the system', async () => {
        responseGetAllUsers = await Users.getAllUsers();
        expect(responseGetAllUsers.statusCode).toEqual(200)
    })
})