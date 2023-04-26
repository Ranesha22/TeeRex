import { environment } from "src/environments/environment";


export class Global {
    public static BASE_URL = environment.baseUrl;

    public static GET_PTODUCT_LIST = 'https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json';
}