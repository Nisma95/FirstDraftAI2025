import { useState, useEffect, useRef } from "react";
import { useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

export const useLogin = () => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: true,
    });

    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains("dark")
    );
    const [isRtl, setIsRtl] = useState(document.documentElement.dir === "rtl");
    const [loginStep, setLoginStep] = useState("email");
    const [emailText, setEmailText] = useState("");
    const [passwordText, setPasswordText] = useState("");
    const [showEmailPlaceholder, setShowEmailPlaceholder] = useState(true);
    const [showPasswordPlaceholder, setShowPasswordPlaceholder] =
        useState(true);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);

    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    const { t, i18n } = useTranslation();

    // Font family based on language
    const fontFamily =
        i18n.language === "ar"
            ? "'Noto Sans Arabic', 'Tajawal', 'Cairo', sans-serif"
            : "'Inter', 'Roboto', 'Helvetica Neue', sans-serif";

    // Monitor DOM changes for theme and language
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.type === "attributes" &&
                    mutation.attributeName === "class"
                ) {
                    setIsDarkMode(
                        document.documentElement.classList.contains("dark")
                    );
                }
                if (
                    mutation.type === "attributes" &&
                    (mutation.attributeName === "dir" ||
                        mutation.attributeName === "lang")
                ) {
                    setIsRtl(document.documentElement.dir === "rtl");
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    // Reset placeholders when language changes
    useEffect(() => {
        if (loginStep === "email") {
            setShowEmailPlaceholder(true);
            setEmailText("");
        }
        if (loginStep === "password") {
            setShowPasswordPlaceholder(true);
            setPasswordText("");
        }
    }, [i18n.language, loginStep]);

    // Placeholder animations
    useEffect(() => {
        // Email placeholder animation
        if (loginStep === "email" && showEmailPlaceholder && !data.email) {
            const emailFullText =
                t("auth.emailPlaceholder") ||
                (i18n.language === "ar"
                    ? "بريدي الإلكتروني هو..."
                    : "My access email is...");
            let emailCurrentIndex = 0;

            const emailTypingInterval = setInterval(() => {
                if (emailCurrentIndex <= emailFullText.length) {
                    setEmailText(emailFullText.substring(0, emailCurrentIndex));
                    emailCurrentIndex++;
                } else {
                    clearInterval(emailTypingInterval);
                }
            }, 100);

            return () => clearInterval(emailTypingInterval);
        }

        // Password placeholder animation
        if (
            loginStep === "password" &&
            showPasswordPlaceholder &&
            !data.password
        ) {
            const passwordFullText =
                t("auth.passwordPlaceholder") ||
                (i18n.language === "ar"
                    ? "أدخل كلمة المرور..."
                    : "Enter your password...");
            let passwordCurrentIndex = 0;

            const passwordTypingInterval = setInterval(() => {
                if (passwordCurrentIndex <= passwordFullText.length) {
                    setPasswordText(
                        passwordFullText.substring(0, passwordCurrentIndex)
                    );
                    passwordCurrentIndex++;
                } else {
                    clearInterval(passwordTypingInterval);
                    // Show asterisks after typing
                    setTimeout(() => {
                        let asterisks = "";
                        const asteriskInterval = setInterval(() => {
                            if (asterisks.length < 8) {
                                asterisks += "*";
                                setPasswordText(asterisks);
                            } else {
                                clearInterval(asteriskInterval);
                            }
                        }, 100);
                    }, 800);
                }
            }, 100);

            return () => clearInterval(passwordTypingInterval);
        }
    }, [
        loginStep,
        showEmailPlaceholder,
        showPasswordPlaceholder,
        data.email,
        data.password,
        i18n.language,
        t,
    ]);

    // Focus management
    useEffect(() => {
        if (loginStep === "email" && emailInputRef.current) {
            emailInputRef.current.focus();
        } else if (loginStep === "password" && passwordInputRef.current) {
            passwordInputRef.current.focus();
        }
    }, [loginStep]);

    // Handlers
    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (data.email) {
            setLoginStep("password");
            setShowPasswordPlaceholder(true);
            setPasswordText("");
        }
    };

    const handlePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const resetToEmailStep = () => {
        setLoginStep("email");
        setLoginFailed(false);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return {
        // Form data
        data,
        setData,
        processing,
        errors,

        // UI state
        isDarkMode,
        isRtl,
        loginStep,
        emailText,
        passwordText,
        showEmailPlaceholder,
        setShowEmailPlaceholder,
        showPasswordPlaceholder,
        setShowPasswordPlaceholder,
        isPasswordVisible,
        loginFailed,

        // Refs
        emailInputRef,
        passwordInputRef,

        // Utils
        fontFamily,
        t,
        i18n,

        // Handlers
        handleEmailSubmit,
        handlePasswordVisibility,
        resetToEmailStep,
        submit,
    };
};
