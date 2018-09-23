import { getString, setString } from 'tns-core-modules/application-settings'

const userKey = 'user';

export default class BackendService {
    isLoggedIn() {
        return !!getString(userKey);
    }

    get user() {
        const value = getString(userKey);
        return value ? JSON.parse(value) : null;
    }

    set user(newUser) {
        setString(userKey, JSON.stringify(newUser));
    }
}