import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000/api';

/*
export const refreshAuth = async () => {
    const refreshToken = Cookies.get('refreshToken');

    if (!refreshToken) {
        return Promise.reject('No refresh token found');
    }

    try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            body: JSON.stringify({ refreshToken }), // Send the cookie value
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });

        if (response.status !== 200) {
            throw new Error('Refresh failed');
        }

        const { accessToken, refreshToken: newRefreshToken } = await response.json();

        // Update LocalStorage with the new short-lived access token
        localStorage.setItem('accessToken', accessToken);

        // Rotate the Refresh Token cookie (if your NestJS app rotates it)
        if (newRefreshToken) {
            Cookies.set('refreshToken', newRefreshToken, { sameSite: 'strict' });
        }

        return Promise.resolve();
    } catch (error) {
        // If refresh fails, clear everything and force logout
        localStorage.removeItem('accessToken');
        Cookies.remove('refreshToken');
        return Promise.reject(error);
    }
};

*/

export const refreshAuth = async () => {
    // Try both cookie and localStorage
    const refreshToken = Cookies.get('refreshToken') || localStorage.getItem('refreshToken');

    if (!refreshToken) {
        // Resolve instead of Reject to stop the immediate logout loop
        return Promise.resolve(); 
    }

    try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            body: JSON.stringify({ refreshToken }), 
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Refresh failed');

        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
            Cookies.set('refreshToken', data.refreshToken, { path: '/', secure: false });
        }
        return Promise.resolve();
    } catch (error) {
        // Only reject if we actually have a token but the server said it's invalid
        localStorage.removeItem('accessToken');
        return Promise.reject(error);
    }
};