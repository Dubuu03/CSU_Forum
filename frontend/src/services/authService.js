const LOGIN_ENDPOINT = "https://takay.csucarig.edu.ph/auth/login";

export class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthenticationError";
    }
}


const authService = {
    /**
     * Logs in the user using the provided credentials.
     * @param {Object} credentials - { id, password }
     * @returns {Promise<Object>} - API response containing the access token.
     * @throws {AuthenticationError} - If login fails.
     */
    async login({ id, password }) {
        const res = await fetch(LOGIN_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ UserID: id, Password: password }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new AuthenticationError(errorData.error || "Invalid credentials");
        }

        const data = await res.json();
        return data; // { access_token, token_type, expires_in }
    },

    /**
     * Logs out the user by removing the access token from storage.
     */
    logout() {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
    },

    /**
     * Checks if the user is authenticated.
     * @returns {boolean} - True if authenticated, false otherwise.
     */
    isAuthenticated() {
        return !!localStorage.getItem("accessToken");
    },
};

export default authService;
