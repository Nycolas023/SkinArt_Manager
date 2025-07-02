class AuthService {
    static TOKEN_KEY = 'token';
    static USER_ROLE = 'userRole';
    static USER_NAME = 'userName';

    static login(token, userData) {
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_ROLE, userData.papel);
        localStorage.setItem(this.USER_NAME, userData.nome);
    }

    static logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_ROLE);
        localStorage.removeItem(this.USER_NAME);
    }

    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static getUserRole() {
        return localStorage.getItem(this.USER_ROLE);
    }

    static getUserName() {
        return localStorage.getItem(this.USER_NAME);
    }

    static isAuthenticated() {
        return !!this.getToken();
    }
}

export default AuthService;