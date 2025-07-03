class AuthService {
    static TOKEN_KEY = 'token';
    static USER_ROLE = 'userRole';
    static USER_NAME = 'userName';

    static login(token, userData) {
        localStorage.setItem(this.TOKEN_KEY, token);
        
        // Nome do usuário
        localStorage.setItem(this.USER_NAME, userData.NOME_USUARIO || '');
        
        // Papel/função do usuário
        // Se userData.NOME_PAPEL existir, use-o; caso contrário, tente usar uma propriedade relacionada
        const role = userData.NOME_PAPEL || userData.PAPEL || userData.papel || 'Admin';
        localStorage.setItem(this.USER_ROLE, role);
        
        console.log('Nome salvo:', userData.NOME_USUARIO);
        console.log('Papel salvo:', role);
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