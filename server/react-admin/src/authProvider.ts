import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000/api';

export const authProvider = {
    login: async ({ username, password }: { username: string; password: string }) => {
        const response = await fetch(`${API_URL}/auths/login`, {
            method: 'POST',
            body: JSON.stringify({ email: username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });

        if (!response.ok) throw new Error(response.statusText);
        
        const data = await response.json();
        const { accessToken, refreshToken } = data;

        if (!accessToken || !refreshToken) {
            throw new Error('Invalid login response: Missing tokens');
        }

        localStorage.setItem('accessToken', accessToken);
        
        // Save the refreshToken to both for maximum compatibility on localhost
        localStorage.setItem('refreshToken', refreshToken); 
        Cookies.set('refreshToken', refreshToken, { 
            expires: 7, 
            secure: false, 
            sameSite: 'lax',
            path: '/' 
        });

        return Promise.resolve(); // 👈 CRITICAL: Must return a resolved promise
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        Cookies.remove('refreshToken');
        return Promise.resolve();
    },

    checkAuth: () => {
        // Just check if the token exists. React Admin handles the rest.
        return localStorage.getItem('accessToken') ? Promise.resolve() : Promise.reject();
    },

    checkError: (error: any) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('accessToken');
            return Promise.reject();
        }
        return Promise.resolve();
    },

    getPermissions: () => Promise.resolve(),
    
    // FIX: Fallback identity since you have no User object
    getIdentity: () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return Promise.reject();
        
        try {
            // Optional: Decode JWT to get email/id if your token has it
            const payload = JSON.parse(atob(token.split('.')[1]));
            return Promise.resolve({ 
                id: payload.sub || 'user', 
                fullName: payload.email || 'Admin User' 
            });
        } catch (e) {
            return Promise.resolve({ id: 'user', fullName: 'Logged In' });
        }
    }
};