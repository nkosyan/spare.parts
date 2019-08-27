import { loginUserApi } from '../apis/users';

export const loginUser = async data => {
    try {
        return await loginUserApi(data);
    } catch (error) {
        console.log('Cannot login user: error = ', error);
    }
};
