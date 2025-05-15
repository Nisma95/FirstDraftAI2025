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
            const response = await fetch("/api/ai/start-business-plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    business_idea: businessIdea,
                    project_id: selectedProject.id,
                    project_name: selectedProject.name,
                    project_description: selectedProject.description,
                }),
            });

            // Check if response is ok
            if (!response.ok) {
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

            return await response.json();
        } catch (error) {
            console.error("Error in startAIConversation:", error);
            throw error;
        }
    };

    // Submit answer and get next question
    const submitAnswer = async (
        currentQuestion,
        answers,
        selectedProject,
        questionCount
    ) => {
        const newAnswer = {
            question: currentQuestion.question,
            question_type: currentQuestion.type,
            answer: data.answer,
            timestamp: new Date(),
        };

        const updatedAnswers = [...answers, newAnswer];

        try {
            const response = await fetch("/api/ai/next-question", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    answer: data.answer,
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();
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
            const response = await fetch("/api/ai/generate-plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
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
            throw error;
        }
    };

    // Check generation status with improved handling
    const checkGenerationStatus = async (planId) => {
        let checking = true;
        let attempts = 0;
        let consecutiveErrors = 0;

        while (checking && attempts < 60) {
            // Increased max attempts
            attempts++;

            try {
                const response = await fetch(`/api/plans/${planId}/status`);

                if (!response.ok) {
                    consecutiveErrors++;
                    console.error(
                        `Status check failed: ${response.status} ${response.statusText}`
                    );

                    if (consecutiveErrors >= 3) {
                        console.log(
                            "Multiple consecutive errors, checking page reload"
                        );
                        window.location.reload();
                        checking = false;
                        break;
                    }

                    // Wait longer after errors
                    await new Promise((resolve) => setTimeout(resolve, 10000));
                    continue;
                }

                consecutiveErrors = 0; // Reset error counter on success
                const contentType = response.headers.get("content-type");

                if (contentType && contentType.includes("application/json")) {
                    const result = await response.json();

                    console.log(
                        `Status check attempt ${attempts}:`,
                        result.status
                    );

                    if (result.status === "completed") {
                        console.log(
                            "Plan generation completed, reloading page"
                        );
                        window.location.reload();
                        checking = false;
                    } else if (result.status === "failed") {
                        alert(
                            t(
                                "plan_generation_failed_alert",
                                "An error occurred while creating the business plan. Please try again."
                            )
                        );
                        checking = false;
                    } else {
                        // Show progress if available
                        if (result.current_section) {
                            console.log(
                                `Currently generating: ${result.current_section}`
                            );
                        }

                        // Check again in 3 seconds for better responsiveness
                        await new Promise((resolve) =>
                            setTimeout(resolve, 3000)
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
                    checking = false;
                } else {
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                }
            }
        }

        if (attempts >= 60) {
            console.log("Maximum attempts reached, reloading page");
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
