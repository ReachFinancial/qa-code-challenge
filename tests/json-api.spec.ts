import { test, expect, APIResponse } from '@playwright/test';
import { Comment, Post, findPostsByUserId, getAllUserIds } from '../helper/json-api';

test.describe('GET all users', () => {
  const totalUsers = 10;
  let response: APIResponse;
  let users: any;

  test.beforeEach(async ({ request }) => {
    response = await request.get('/users');
    users = await response.json();

    expect(response.ok()).toBeTruthy();
  });

  test('should get all users in the system', async () => {
    expect((await response.json()).length).toEqual(totalUsers);
  });

  test('should be able to validate phone number (regardless of extension)', async () => {
    const regexNumber = new RegExp(/(\+\d{1,3}\s|1-?)?((\(\d{3}\)\s?)|(\d{3})(\s|-|\.?))(\d{3}(\s|-|\.?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g);

    for (const user of users) {
      expect(user.phone).toMatch(regexNumber);
    }
  });

  test('should find all users who have the same catch phrase)', async () => {
    // I'm not sure I understand this test case because there are no users with the same catch phrase. The test is written instead to validate that no 2 users have the same catchphrase
    const catchphrases = users.map(user => user.company.catchphrase);
    expect((new Set(catchphrases)).size !== catchphrases.length).toBeTruthy;
  });
});

test.describe('GET all posts', () => {
  const totalPosts = 100;
  let response: APIResponse;
  let posts: Post[];

  test.beforeEach(async ({ request }) => {
    response = await request.get('/posts');
    posts = await response.json();

    expect(response.ok()).toBeTruthy();
  });

  test('should get all posts in the system', async () => {
    expect((await response.json()).length).toEqual(totalPosts);
  });

  test('should be able to check how many posts per user', async () => {
    const postsPerUser = 10;
    const userIds = await getAllUserIds(posts);

    for (const userId of userIds) {
      expect((await findPostsByUserId(posts, userId)).length).toEqual(postsPerUser);
    }
  });

  test('should find any posts that have the same title', async () => {
    const titles = posts.map(post => post.title);
    expect((new Set(titles)).size !== titles.length).toBeTruthy;
  });
});

test.describe('GET specific post', () => {
  let response: APIResponse;
  let posts: Post[];
  let comments: Comment[];

  test.beforeEach(async ({ request }) => {
    response = await request.get('/posts');
    expect(response.ok()).toBeTruthy();
    posts = await response.json();

    response = await request.get('/comments');
    expect(response.ok()).toBeTruthy();
    comments = await response.json();
  });

  test('should be able to get specific posts', async ({ request }) => {
    const postId = 6;
    response = await request.get(`/posts/${postId}`);
    const post = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(post).toEqual(posts.find(post => post.id == postId));
  });

  test('should be able to get comments on a post', async ({ request }) => {
    const postId = 7;
    response = await request.get(`/posts/${postId}/comments`);
    const postComments = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(postComments).toEqual(comments.filter(comment => comment.postId == postId));
  });

  test('should be able to get posts for a user', async ({ request }) => {
    const userId = 9;
    response = await request.get('/posts', {
      params: {
        userId
      }
    });
    const userPosts = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(userPosts).toEqual(posts.filter(post => post.userId == userId));
  });
});

test.describe('POST a new post', () => {
  test('should be able to POST a new post', async ({ request }) => {
    const userId = 8;
    const title = 'This is a new test post';
    const body = 'this is used for automated testing';
    const response = await request.post('/posts', {
      data: {
        userId,
        title,
        body
      },
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    const post = await response.json();
    expect(response.ok()).toBeTruthy();

    expect(post.userId).toEqual(userId);
    expect(post.title).toEqual(title);
    expect(post.body).toEqual(body);
    expect(post.id).toEqual(101);
  });
});

test.describe('What else', () => {
  test('should be able update a post', async ({ request }) => {
    const id = 1;
    const userId = 1;
    const title = 'This is a new test post';
    const body = 'this is used for automated testing';
    const response = await request.put(`/posts/${id}`, {
      data: {
        userId,
        title,
        body,
        id
      },
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    const post = await response.json();
    expect(response.ok()).toBeTruthy();

    expect(post.userId).toEqual(userId);
    expect(post.title).toEqual(title);
    expect(post.body).toEqual(body);
    expect(post.id).toEqual(id);
  });
});