import CONFIG from "../config";

export class AuthenticationError extends Error {
    constructor(message, status) {
        super(message);
        this.name = "AuthenticationError";
        this.status = status;
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
        try {
            const res = await fetch(CONFIG.LOGIN_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ UserID: id, Password: password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                switch (res.status) {
                    case 401:
                        throw new AuthenticationError("Invalid credentials. Please try again.", 401);
                    case 403:
                        throw new AuthenticationError("Currently offline. Please try again later.", 403);
                    default:
                        throw new AuthenticationError(errorData.error || "Login failed.", res.status);
                }
            }

            return await res.json(); // { access_token, token_type, expires_in }
        } catch (error) {
            throw error instanceof AuthenticationError ? error : new AuthenticationError("An unexpected error occurred. Please try again later.");
        }
    },

    /**
     * Logs out the user by removing the access token from storage.
     */
    async logout() {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            window.location.href = "/login";
            return;
        }

        try {
            await fetch(CONFIG.LOGOUT_ENDPOINT, {
                method: "POST",
                headers: { Authorization: `Bearer ${accessToken}` },
            });
        } catch (error) {
            console.error("Logout request failed", error);
        }

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
