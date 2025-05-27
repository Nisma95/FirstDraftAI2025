import { useState, useEffect, useRef } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowRight, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import TopTools from "@/Components/TopTools";
import InputError from "@/Components/InputError";
import StarBackground from "@/Components/StarBackground";

// Import the shared media CSS file
import "../../../css/auth/auth-media.css";

export default function Login({ status, canResetPassword }) {
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

    // Determine font family based on current language
    const fontFamily =
        i18n.language === "ar"
            ? "'Noto Sans Arabic', 'Tajawal', 'Cairo', sans-serif"
            : "'Inter', 'Roboto', 'Helvetica Neue', sans-serif";

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

        observer.observe(document.documentElement, {
            attributes: true,
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    // Animation for the email and password placeholders
    useEffect(() => {
        // Animation for email field
        if (loginStep === "email" && showEmailPlaceholder && !data.email) {
            const emailFullText = "My access email is...";
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

        // Animation for password field
        if (
            loginStep === "password" &&
            showPasswordPlaceholder &&
            !data.password
        ) {
            const passwordFullText = "Enter your password...";
            let passwordCurrentIndex = 0;

            // First phase: type out the text
            const passwordTypingInterval = setInterval(() => {
                if (passwordCurrentIndex <= passwordFullText.length) {
                    setPasswordText(
                        passwordFullText.substring(0, passwordCurrentIndex)
                    );
                    passwordCurrentIndex++;
                } else {
                    clearInterval(passwordTypingInterval);

                    // After typing finishes, wait and then show asterisks
                    setTimeout(() => {
                        // Second phase: transition to asterisks
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
    ]);

    useEffect(() => {
        if (loginStep === "email" && emailInputRef.current) {
            emailInputRef.current.focus();
        } else if (loginStep === "password" && passwordInputRef.current) {
            passwordInputRef.current.focus();
        }
    }, [loginStep]);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (data.email) {
            setLoginStep("password");
            // Reset password animation when switching to password step
            setShowPasswordPlaceholder(true);
            setPasswordText("");
        }
    };

    const handlePasswordVisibility = () => {
        setIsPasswordVisible((prevState) => !prevState);
    };

    const resetToEmailStep = () => {
        setLoginStep("email");
        setLoginFailed(false);
    };

    const submit = (e) => {
        e.preventDefault();

        // Simple direct approach to handle login
        // Always submit the form to the server and let the backend handle validation
        post(route("login"));

        // The error message will not be shown when submitting
        // It would only appear if the server returned an error response
    };

    // Background image URL
    const businessImageUrl = "/images/loginPix.jpeg";

    return (
        <div
            className="relative flex h-screen w-screen items-center justify-center p-4"
            style={{ fontFamily }}
        >
            <StarBackground />
            <Head title={t("auth.signIn")} />

            {/* Main container with background image */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl relative"
                style={{
                    minHeight: "500px",
                }}
            >
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${businessImageUrl})`,
                    }}
                ></div>

                {/* Soft gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10"></div>

                <div className="relative h-full w-full">
                    {/* Centered login card */}
                    <div className="flex justify-center items-center min-h-[500px] p-8">
                        <motion.div className="w-full max-w-md">
                            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl text-white mb-6">
                                {/* Controls bar - TopTools inside the card */}
                                <div
                                    className="flex justify-center items-center gap-4 p-4 my-10"
                                    dir="ltr"
                                >
                                    <TopTools hideAuthIcon={true} />
                                </div>

                                {/* Header */}
                                <div className="p-6 text-center">
                                    <h1 className="text-2xl font-bold fdGradientColorzTX mb-1">
                                        {t("auth.signIn")}
                                    </h1>
                                    <p className="text-sm text-gray-200">
                                        {t("auth.loginDesc")}
                                    </p>
                                </div>

                                {/* Status message */}
                                {status && (
                                    <div className="mx-5 mb-4 rounded-lg bg-green-100 p-3 text-sm font-medium text-green-700 dark:bg-green-900/50 dark:text-green-200">
                                        {status}
                                    </div>
                                )}

                                <div className="p-5 pb-8">
                                    <AnimatePresence mode="wait">
                                        {loginStep === "email" ? (
                                            <motion.form
                                                key="emailForm"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                                onSubmit={handleEmailSubmit}
                                            >
                                                <div className="relative">
                                                    <div
                                                        className={`${
                                                            data.email
                                                                ? "hidden"
                                                                : "block"
                                                        } absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none`}
                                                    >
                                                        {emailText}
                                                    </div>
                                                    <input
                                                        ref={emailInputRef}
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        value={data.email}
                                                        className="w-full rounded-xl border-0 p-4 pr-12 text-gray-900 bg-gray-100/90 shadow-inner focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700/70 dark:text-white"
                                                        placeholder=""
                                                        autoComplete="username"
                                                        onChange={(e) => {
                                                            setData(
                                                                "email",
                                                                e.target.value
                                                            );
                                                            setShowEmailPlaceholder(
                                                                false
                                                            );
                                                        }}
                                                        style={{ fontFamily }}
                                                    />
                                                    <button
                                                        type="submit"
                                                        className={`absolute ${
                                                            isRtl
                                                                ? "left-3"
                                                                : "right-3"
                                                        } top-1/2 transform -translate-y-1/2 rounded-full p-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors ${
                                                            !data.email
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                        }`}
                                                        disabled={!data.email}
                                                    >
                                                        <ArrowRight size={18} />
                                                    </button>
                                                </div>
                                                <InputError
                                                    message={errors.email}
                                                    className="mt-2"
                                                />
                                            </motion.form>
                                        ) : loginStep === "password" ? (
                                            <motion.form
                                                key="passwordForm"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                                onSubmit={submit}
                                            >
                                                <div>
                                                    <div className="text-sm mb-2 text-gray-300">
                                                        <span>
                                                            Logging in as{" "}
                                                        </span>
                                                        <span className="font-semibold text-white">
                                                            {data.email}
                                                        </span>
                                                    </div>
                                                    <div className="relative">
                                                        <div
                                                            className={`${
                                                                data.password
                                                                    ? "hidden"
                                                                    : "block"
                                                            } absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none`}
                                                        >
                                                            {passwordText}
                                                        </div>
                                                        <input
                                                            ref={
                                                                passwordInputRef
                                                            }
                                                            id="password"
                                                            type={
                                                                isPasswordVisible
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            name="password"
                                                            value={
                                                                data.password
                                                            }
                                                            className="w-full rounded-xl border-0 p-4 pr-12 text-gray-900 bg-gray-100/90 shadow-inner focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700/70 dark:text-white"
                                                            placeholder=""
                                                            autoComplete="current-password"
                                                            onChange={(e) => {
                                                                setData(
                                                                    "password",
                                                                    e.target
                                                                        .value
                                                                );
                                                                setShowPasswordPlaceholder(
                                                                    false
                                                                );
                                                            }}
                                                            style={{
                                                                fontFamily,
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className={`absolute top-1/2 transform -translate-y-1/2 ${
                                                                isRtl
                                                                    ? "left-12"
                                                                    : "right-12"
                                                            } ${
                                                                isPasswordVisible
                                                                    ? "text-indigo-500"
                                                                    : "text-gray-500"
                                                            } hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors`}
                                                            onClick={
                                                                handlePasswordVisibility
                                                            }
                                                            aria-label={
                                                                isPasswordVisible
                                                                    ? "Hide password"
                                                                    : "Show password"
                                                            }
                                                        >
                                                            {isPasswordVisible ? (
                                                                <Eye
                                                                    size={18}
                                                                    className="fill-current"
                                                                />
                                                            ) : (
                                                                <Eye
                                                                    size={18}
                                                                />
                                                            )}
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className={`absolute ${
                                                                isRtl
                                                                    ? "left-3"
                                                                    : "right-3"
                                                            } top-1/2 transform -translate-y-1/2 rounded-full p-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors ${
                                                                !data.password ||
                                                                processing
                                                                    ? "opacity-50 cursor-not-allowed"
                                                                    : ""
                                                            }`}
                                                            disabled={
                                                                !data.password ||
                                                                processing
                                                            }
                                                        >
                                                            <ArrowRight
                                                                size={18}
                                                            />
                                                        </button>
                                                    </div>
                                                    <InputError
                                                        message={
                                                            errors.password
                                                        }
                                                        className="mt-2"
                                                    />

                                                    <div className="mt-4 flex justify-between items-center">
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                resetToEmailStep
                                                            }
                                                            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                                                        >
                                                            ← Change email
                                                        </button>

                                                        {canResetPassword && (
                                                            <Link
                                                                href={route(
                                                                    "password.request"
                                                                )}
                                                                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                                                            >
                                                                {t(
                                                                    "auth.forgotPassword"
                                                                )}
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.form>
                                        ) : null}
                                    </AnimatePresence>

                                    {/* Failed login message */}
                                    <AnimatePresence>
                                        {loginFailed && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.3 }}
                                                className="mt-6 p-4 bg-red-500/20 backdrop-blur-sm rounded-xl text-center"
                                            >
                                                <p className="text-sm font-medium text-white mb-2">
                                                    Incorrect password. Forgot
                                                    password?
                                                </p>
                                                <div className="flex justify-center space-x-4">
                                                    <Link
                                                        href={route(
                                                            "password.request"
                                                        )}
                                                        className="text-xs text-indigo-300 hover:text-indigo-200 transition-colors"
                                                    >
                                                        Reset password
                                                    </Link>
                                                    <Link
                                                        href="#"
                                                        onClick={() =>
                                                            setLoginFailed(
                                                                false
                                                            )
                                                        }
                                                        className="text-xs text-indigo-300 hover:text-indigo-200 transition-colors"
                                                    >
                                                        Try again
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Registration link outside the card - matching register style */}
                            <div className="text-center px-4">
                                <p className="text-sm text-white bg-gray-800/40 backdrop-blur-sm inline-block px-4 py-2 rounded-full">
                                    {t("auth.noAccount")}{" "}
                                    <Link
                                        href={route("register")}
                                        className="font-medium text-indigo-300 hover:text-indigo-200 transition-colors"
                                    >
                                        {t("auth.createAccount")}
                                    </Link>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
