export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export async function findPostsByUserId(posts: Post[], userId: number) {
  return posts.filter(post => post.userId == userId);
}

export async function getAllUserIds(posts: Post[]) {
  return new Set(posts.map(post => post.userId));
}