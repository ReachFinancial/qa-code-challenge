import { API_END_POINTS } from "./const.api";

const typicodeApiURL = 'https://jsonplaceholder.typicode.com';

export class config {

    static getBaseURL() {
        return typicodeApiURL;
    }
}