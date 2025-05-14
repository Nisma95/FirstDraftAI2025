import axios from "axios";
window.axios = axios;

// Set default headers
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// Global error handling
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error("Axios Response Error:", error.response.data);

            // Redirect on 401 Unauthorized
            if (error.response.status === 401) {
                window.location.href = "/login";
            }
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error:", error.message);
        }
        return Promise.reject(error);
    }
);

// Optional: Debugging in development
if (process.env.NODE_ENV === "development") {
    window.axios.defaults.timeout = 10000;
    console.info("Axios is running in development mode.");
}
