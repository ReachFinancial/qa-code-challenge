import { Post } from "../posts.api";

export class PostHelper {

    static getPostPayload(): Post {
        return {
            title: "foo",
            body: "bar",
            userId: 1,
        }
    }


}