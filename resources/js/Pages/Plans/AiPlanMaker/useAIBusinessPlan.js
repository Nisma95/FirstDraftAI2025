import React from "react";
import { useForm, router } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

export default function useAIBusinessPlan() {
    const { t } = useTranslation();
    const { data, setData } = useForm({
        answer: "",
    });

    // Navigate to create new project
    const handleCreateNewProject = () => {
        router.visit("/projects/create");
    };

    // Start the AI conversation
    const startAIConversation = async (selectedProject) => {
        const businessIdea =
            selectedProject.description ||
            selectedProject.name ||
            "New business project";

        try {
            // Make sure we're using the correct endpoint that matches your routes
            const response = await fetch("/api/ai/start-business-plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    business_idea: businessIdea,
                    project_id: selectedProject.id,
                    project_name: selectedProject.name,
                    project_description: selectedProject.description,
                }),
            });

            // Debug logging
            console.log("API Response Status:", response.status);
            console.log(
                "API Response Headers:",
                Object.fromEntries(response.headers)
            );

            // Check if response is ok
            if (!response.ok) {
                const errorText = await response.text();
                console.error("HTTP Error:", response.status, errorText);

                // More specific error messages
                if (response.status === 404) {
                    throw new Error(
                        t(
                            "api_not_found",
                            "API endpoint not found. Please check if the backend is running and routes are properly configured."
                        )
                    );
                } else if (response.status === 403) {
                    throw new Error(
                        t(
                            "api_unauthorized",
                            "Unauthorized access. Please refresh the page and try again."
                        )
                    );
                } else if (response.status === 500) {
                    throw new Error(
                        t(
                            "server_error",
                            "Internal server error. Please try again later."
                        )
                    );
                }

                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Check content type before parsing
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error(
                    "Non-JSON response received:",
                    text.substring(0, 200)
                );
                throw new Error(
                    t(
                        "server_returned_html_error",
                        "Server returned an error page instead of JSON"
                    )
                );
            }

            const result = await response.json();
            console.log("Start AI conversation result:", result);

            // Check if the response indicates success
            if (!result.success) {
                throw new Error(
                    result.message || "Failed to start AI conversation"
                );
            }

            return result;
        } catch (error) {
            console.error("Error in startAIConversation:", error);

            // If it's a network error, provide helpful message
            if (error.message.includes("Failed to fetch")) {
                throw new Error(
                    t(
                        "network_error",
                        "Network error. Please check your internet connection and that the server is running."
                    )
                );
            }

            throw error;
        }
    };

    // Submit answer and get next question
    const submitAnswer = async (
        currentQuestion,
        answers,
        selectedProject,
        questionCount,
        customAnswer = null
    ) => {
        // Use custom answer if provided (for cost breakdown questions)
        const answerToSubmit = customAnswer || data.answer;

        const newAnswer = {
            question: currentQuestion.question,
            question_type: currentQuestion.type || "text",
            answer: answerToSubmit,
            timestamp: new Date(),
            // Store additional metadata for cost breakdown questions
            ...(currentQuestion.type === "cost_breakdown" && {
                cost_breakdown_details: JSON.parse(answerToSubmit),
            }),
        };

        const updatedAnswers = [...answers, newAnswer];

        try {
            const response = await fetch("/api/ai/next-question", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    answer: answerToSubmit,
                    previous_answers: updatedAnswers,
                    business_idea:
                        selectedProject.description ||
                        selectedProject.name ||
                        "New business project",
                    question_count: questionCount,
                }),
            });

            // Check if response is ok
            if (!response.ok) {
                const errorText = await response.text();
                console.error("HTTP Error:", response.status, errorText);

                if (response.status === 404) {
                    throw new Error(
                        t("api_not_found", "API endpoint not found.")
                    );
                }

                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();
                console.log("Next question result:", result);

                // Check if the response indicates success
                if (!result.success) {
                    throw new Error(
                        result.message || "Failed to get next question"
                    );
                }

                return { result, newAnswer };
            } else {
                const htmlResponse = await response.text();
                console.error(
                    "HTML Error Response:",
                    htmlResponse.substring(0, 200)
                );

                const titleMatch = htmlResponse.match(
                    /<title>([^<]+)<\/title>/
                );
                const errorTitle = titleMatch
                    ? titleMatch[1]
                    : t("server_error", "Server error");

                throw new Error(
                    `${errorTitle} - ${t(
                        "server_returned_html_error",
                        "Server returned an error page instead of JSON"
                    )}`
                );
            }
        } catch (error) {
            console.error("Error in submitAnswer:", error);

            if (error.message.includes("Failed to fetch")) {
                throw new Error(
                    t(
                        "network_error",
                        "Network error. Please check your connection."
                    )
                );
            }

            throw error;
        }
    };

    // Generate the final business plan
    const generatePlan = async (answers, selectedProject) => {
        const businessIdea =
            selectedProject.description ||
            selectedProject.name ||
            "New business project";

        try {
            console.log("Generating plan with data:", {
                answers,
                business_idea: businessIdea,
                project_id: selectedProject.id,
                project_name: selectedProject.name,
                project_description: selectedProject.description,
            });

            const response = await fetch("/api/ai/generate-plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    answers: answers,
                    business_idea: businessIdea,
                    project_id: selectedProject.id,
                    project_name: selectedProject.name,
                    project_description: selectedProject.description,
                }),
            });

            // Check if response is ok
            if (!response.ok) {
                const errorText = await response.text();
                console.error(
                    "Generate plan HTTP Error:",
                    response.status,
                    errorText
                );

                if (response.status === 404) {
                    throw new Error(
                        t("api_not_found", "API endpoint not found.")
                    );
                }

                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();
                console.log("Generate plan result:", result);

                // Check if the response indicates success
                if (!result.success) {
                    throw new Error(
                        result.message || "Failed to generate business plan"
                    );
                }

                return result;
            } else {
                const textResponse = await response.text();
                console.error(
                    "Non-JSON response:",
                    textResponse.substring(0, 200)
                );
                throw new Error(
                    t(
                        "server_invalid_response",
                        "Server did not return a valid response"
                    )
                );
            }
        } catch (error) {
            console.error("Error in generatePlan:", error);

            if (error.message.includes("Failed to fetch")) {
                throw new Error(
                    t(
                        "network_error",
                        "Network error. Please check your connection."
                    )
                );
            }

            throw error;
        }
    };

    // Check generation status with improved handling
    const checkGenerationStatus = async (planId) => {
        let checking = true;
        let attempts = 0;
        let consecutiveErrors = 0;
        const maxAttempts = 120; // 2 minutes with 1-second intervals
        const checkInterval = 1000; // 1 second

        console.log(`Starting status check for plan ${planId}`);

        while (checking && attempts < maxAttempts) {
            attempts++;

            try {
                const response = await fetch(`/api/plans/${planId}/status`, {
                    headers: {
                        "X-CSRF-TOKEN":
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute("content") || "",
                        Accept: "application/json",
                    },
                });

                if (!response.ok) {
                    consecutiveErrors++;
                    console.error(
                        `Status check failed: ${response.status} ${response.statusText}`
                    );

                    if (consecutiveErrors >= 5) {
                        console.log(
                            "Multiple consecutive errors, will reload page"
                        );
                        window.location.reload();
                        checking = false;
                        break;
                    }

                    // Wait longer after errors
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                    continue;
                }

                consecutiveErrors = 0; // Reset error counter on success
                const contentType = response.headers.get("content-type");

                if (contentType && contentType.includes("application/json")) {
                    const result = await response.json();

                    console.log(`Status check attempt ${attempts}:`, result);

                    // Handle different status responses
                    if (result.status === "completed" || result.is_completed) {
                        console.log(
                            "Plan generation completed, reloading page"
                        );
                        window.location.reload();
                        checking = false;
                    } else if (
                        result.status === "failed" ||
                        result.has_failed
                    ) {
                        console.error("Plan generation failed:", result);
                        alert(
                            t(
                                "plan_generation_failed_alert",
                                "An error occurred while creating the business plan. Please try again."
                            )
                        );
                        checking = false;
                    } else if (
                        result.is_generating ||
                        result.status === "generating"
                    ) {
                        // Show progress if available
                        const progress =
                            result.progress || result.completion_score || 0;
                        console.log(`Generation in progress: ${progress}%`);

                        // Check again after interval
                        await new Promise((resolve) =>
                            setTimeout(resolve, checkInterval)
                        );
                    } else {
                        // Unknown status, continue checking
                        console.log(
                            `Unknown status: ${result.status}, continuing...`
                        );
                        await new Promise((resolve) =>
                            setTimeout(resolve, checkInterval)
                        );
                    }
                } else {
                    console.error("Non-JSON response from status endpoint");
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                }
            } catch (error) {
                console.error("Error checking status:", error);
                consecutiveErrors++;

                if (consecutiveErrors >= 5) {
                    console.log("Too many errors, giving up");
                    alert(
                        t(
                            "status_check_failed",
                            "Unable to check plan status. Please refresh the page to see if your plan is ready."
                        )
                    );
                    checking = false;
                } else {
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                }
            }
        }

        if (attempts >= maxAttempts) {
            console.log("Maximum attempts reached, reloading page");
            alert(
                t(
                    "generation_timeout",
                    "Plan generation is taking longer than expected. Refreshing the page to check the current status."
                )
            );
            window.location.reload();
        }
    };

    return {
        data,
        setData,
        handleCreateNewProject,
        startAIConversation,
        submitAnswer,
        generatePlan,
        checkGenerationStatus,
    };
}
