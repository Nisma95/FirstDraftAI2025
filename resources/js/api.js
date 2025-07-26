import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000", // Laravel runs on this
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Required for authentication
});

export const addIndustry = async (industryData) => {
    try {
        const response = await axios.post("/api/industries", industryData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("✅ Industry Added Successfully:", response.data);
        return response.data; // Ensure it returns the expected structure
    } catch (error) {
        console.error("❌ Error Adding Industry:", error.response?.data || error);
        throw error; // Ensure proper error handling
    }
};


export default API;

// Path: resources/js/api.js
// Compare this snippet from resources/js/Pages/Plan/App/components/Industries.jsx:
