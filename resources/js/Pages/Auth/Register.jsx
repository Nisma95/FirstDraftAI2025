// File: resources/js/Pages/Auth/Register.jsx
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import TopTools from "@/Components/TopTools";
import StarBackground from "@/Components/StarBackground";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import {
    Eye,
    EyeOff,
    ArrowRight,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

// Import the shared media CSS file
import "../../../css/auth/auth-media.css";

export default function Register({
    status,
    message,
    suggested_action,
    ...props
}) {
    const { t, i18n } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [currentStep, setCurrentStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isRtl, setIsRtl] = useState(document.documentElement.dir === "rtl");
    const [localErrors, setLocalErrors] = useState({});

    const inputRefs = useRef([]);

    // Determine font family based on current language
    const fontFamily =
        i18n.language === "ar"
            ? "'Noto Sans Arabic', 'Tajawal', 'Cairo', sans-serif"
            : "'Inter', 'Roboto', 'Helvetica Neue', sans-serif";

    const fields = [
        {
            name: "name",
            label: t("auth.register.fields.name.label"),
            placeholder: t("auth.register.fields.name.placeholder"),
            type: "text",
            autoComplete: "off",
        },
        {
            name: "email",
            label: t("auth.register.fields.email.label"),
            placeholder: t("auth.register.fields.email.placeholder"),
            type: "email",
            autoComplete: "off",
        },
        {
            name: "password",
            label: t("auth.register.fields.password.label"),
            placeholder: t("auth.register.fields.password.placeholder"),
            type: "password",
            autoComplete: "new-password",
        },
        {
            name: "password_confirmation",
            label: t("auth.register.fields.confirmPassword.label"),
            placeholder: t("auth.register.fields.confirmPassword.placeholder"),
            type: "password",
            autoComplete: "new-password",
        },
    ];

    // Handle pre-filled email from login redirect
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get("email");

        if (email) {
            setData("email", email);
            setCurrentStep(0); // Start from name field
        }
    }, []);

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
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

    useEffect(() => {
        if (inputRefs.current[currentStep]) {
            inputRefs.current[currentStep].focus();
        }
    }, [currentStep]);

    // Clear local errors when server errors come in
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setLocalErrors({});
        }
    }, [errors]);

    const validateCurrentField = () => {
        const currentField = fields[currentStep];
        const value = data[currentField.name];

        if (!value || value.trim() === "") {
            return false;
        }

        if (currentField.name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        }

        if (currentField.name === "password") {
            return value.length >= 8;
        }

        return true;
    };

    const handleNext = (e) => {
        e.preventDefault();

        const currentField = fields[currentStep];
        const value = data[currentField.name];

        // Clear any previous local errors
        setLocalErrors({});

        if (!value || value.trim() === "") {
            setLocalErrors({
                [currentField.name]:
                    i18n.language === "ar"
                        ? "هذا الحقل مطلوب"
                        : "This field is required",
            });
            return;
        }

        if (!validateCurrentField()) {
            if (currentField.name === "email") {
                setLocalErrors({
                    email:
                        i18n.language === "ar"
                            ? "يرجى إدخال بريد إلكتروني صحيح"
                            : "Please enter a valid email",
                });
            } else if (currentField.name === "password") {
                setLocalErrors({
                    password:
                        i18n.language === "ar"
                            ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
                            : "Password must be at least 8 characters",
                });
            }
            return;
        }

        if (currentStep < fields.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleNext(e);
        }
    };

    const handleSubmit = () => {
        // Final validation
        const finalErrors = {};

        if (!data.name || data.name.trim() === "") {
            finalErrors.name =
                i18n.language === "ar" ? "الاسم مطلوب" : "Name is required";
        }

        if (!data.email || data.email.trim() === "") {
            finalErrors.email =
                i18n.language === "ar"
                    ? "البريد الإلكتروني مطلوب"
                    : "Email is required";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                finalErrors.email =
                    i18n.language === "ar"
                        ? "البريد الإلكتروني غير صحيح"
                        : "Invalid email format";
            }
        }

        if (!data.password || data.password.trim() === "") {
            finalErrors.password =
                i18n.language === "ar"
                    ? "كلمة المرور مطلوبة"
                    : "Password is required";
        } else if (data.password.length < 8) {
            finalErrors.password =
                i18n.language === "ar"
                    ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
                    : "Password must be at least 8 characters";
        }

        if (
            !data.password_confirmation ||
            data.password_confirmation.trim() === ""
        ) {
            finalErrors.password_confirmation =
                i18n.language === "ar"
                    ? "تأكيد كلمة المرور مطلوب"
                    : "Password confirmation is required";
        } else if (data.password !== data.password_confirmation) {
            finalErrors.password_confirmation =
                i18n.language === "ar"
                    ? "كلمة المرور غير متطابقة"
                    : "Passwords do not match";
        }

        if (Object.keys(finalErrors).length > 0) {
            setLocalErrors(finalErrors);
            return;
        }

        // All good, submit the form
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
            onSuccess: () => {
                console.log("Registration successful!");
            },
            onError: (serverErrors) => {
                console.log("Server validation errors:", serverErrors);

                // Handle email already taken specifically
                if (
                    serverErrors.email &&
                    serverErrors.email.includes("already been taken")
                ) {
                    const message =
                        i18n.language === "ar"
                            ? "البريد الإلكتروني مسجل مسبقاً. هل تريد تسجيل الدخول بدلاً من ذلك؟"
                            : "This email is already registered. Would you like to login instead?";

                    if (confirm(message)) {
                        window.location.href =
                            route("login") +
                            "?email=" +
                            encodeURIComponent(data.email);
                    }
                }
            },
        });
    };

    const businessImageUrl = "/images/loginPix.jpeg";
    const currentField = fields[currentStep];
    const isPasswordField = currentField.name === "password";
    const isConfirmPasswordField =
        currentField.name === "password_confirmation";

    // Get current error (local validation or server validation)
    const currentError =
        localErrors[currentField.name] || errors[currentField.name];

    return (
        <div
            className={`relative flex h-screen w-screen items-center justify-center p-4 ${
                isRtl ? "rtl" : "ltr"
            }`}
            style={{ fontFamily }}
            dir={isRtl ? "rtl" : "ltr"}
        >
            <StarBackground />
            <Head title={t("auth.register.title")} />

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
                    className="absolute inset-0 bg-center bg-no-repeat bg-cover"
                    style={{
                        backgroundImage: `url(${businessImageUrl})`,
                    }}
                ></div>

                {/* Soft gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10"></div>

                <div className="relative h-full w-full">
                    {/* Centered register card */}
                    <div className="flex justify-center items-center min-h-[500px] p-8">
                        <motion.div className="w-full max-w-md">
                            {/* Status Message - Show if redirected from login */}
                            {status === "user_not_found" && message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl backdrop-blur-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-blue-400" />
                                        <div>
                                            <p className="text-blue-100 text-sm font-medium">
                                                {message}
                                            </p>
                                            <p className="text-blue-200 text-xs mt-1">
                                                {i18n.language === "ar"
                                                    ? "يرجى إكمال البيانات أدناه لإنشاء حسابك"
                                                    : "Please complete the information below to create your account"}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Show email already taken error prominently */}
                            {errors.email &&
                                errors.email.includes("already been taken") && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-400" />
                                            <div>
                                                <p className="text-red-100 text-sm font-medium">
                                                    {i18n.language === "ar"
                                                        ? `البريد الإلكتروني "${data.email}" مسجل مسبقاً`
                                                        : `Email "${data.email}" is already registered`}
                                                </p>
                                                <Link
                                                    href={
                                                        route("login") +
                                                        "?email=" +
                                                        encodeURIComponent(
                                                            data.email
                                                        )
                                                    }
                                                    className="text-red-200 text-xs underline hover:text-red-100"
                                                >
                                                    {i18n.language === "ar"
                                                        ? "انقر هنا لتسجيل الدخول"
                                                        : "Click here to login instead"}
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl text-white mb-6">
                                {/* Controls bar */}
                                <div
                                    className="flex justify-center items-center gap-4 p-4 my-10"
                                    dir="ltr"
                                >
                                    <TopTools hideAuthIcon={true} />
                                </div>

                                {/* Header */}
                                <div className="px-6 pb-2">
                                    <div
                                        className={`flex items-center justify-between ${
                                            isRtl ? "text-right" : "text-left"
                                        }`}
                                    >
                                        <h1
                                            className={`text-2xl font-bold fdGradientColorzTX ${
                                                isRtl
                                                    ? "text-right"
                                                    : "text-left"
                                            }`}
                                            style={{
                                                textShadow:
                                                    "0 1px 2px rgba(0, 0, 0, 0.15)",
                                            }}
                                        >
                                            {t("auth.register.heading")}
                                        </h1>
                                        <div className="fdIcon w-12 h-12 flex items-center justify-center text-sm">
                                            {currentStep + 1}/{fields.length}
                                        </div>
                                    </div>
                                </div>

                                {/* Form content */}
                                <div className="p-5 pb-8">
                                    <AnimatePresence mode="wait">
                                        <motion.form
                                            key={currentStep}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            onSubmit={handleNext}
                                        >
                                            <div>
                                                <label
                                                    htmlFor={currentField.name}
                                                    className={`mb-4 block text-lg font-medium text-white ${
                                                        isRtl
                                                            ? "text-right"
                                                            : "text-left"
                                                    }`}
                                                >
                                                    {currentField.label}
                                                </label>

                                                <div className="relative">
                                                    <TextInput
                                                        ref={(el) =>
                                                            (inputRefs.current[
                                                                currentStep
                                                            ] = el)
                                                        }
                                                        id={currentField.name}
                                                        type={
                                                            isPasswordField
                                                                ? showPassword
                                                                    ? "text"
                                                                    : "password"
                                                                : isConfirmPasswordField
                                                                ? showConfirmPassword
                                                                    ? "text"
                                                                    : "password"
                                                                : currentField.type
                                                        }
                                                        name={currentField.name}
                                                        value={
                                                            data[
                                                                currentField
                                                                    .name
                                                            ]
                                                        }
                                                        className={`w-full rounded-xl border-0 p-4 text-gray-900 bg-gray-100/90 shadow-inner focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700/70 dark:text-white ${
                                                            isRtl
                                                                ? isPasswordField ||
                                                                  isConfirmPasswordField
                                                                    ? "text-right pl-20 pr-4"
                                                                    : "text-right pl-12 pr-4"
                                                                : isPasswordField ||
                                                                  isConfirmPasswordField
                                                                ? "text-left pr-20 pl-4"
                                                                : "text-left pr-12 pl-4"
                                                        } ${
                                                            currentError
                                                                ? "ring-2 ring-red-400"
                                                                : ""
                                                        }`}
                                                        placeholder={
                                                            currentField.placeholder
                                                        }
                                                        autoComplete={
                                                            currentField.autoComplete
                                                        }
                                                        autoCapitalize="off"
                                                        autoCorrect="off"
                                                        spellCheck="false"
                                                        onChange={(e) => {
                                                            setData(
                                                                currentField.name,
                                                                e.target.value
                                                            );
                                                            // Clear local errors when user starts typing
                                                            if (
                                                                localErrors[
                                                                    currentField
                                                                        .name
                                                                ]
                                                            ) {
                                                                setLocalErrors(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [currentField.name]:
                                                                            undefined,
                                                                    })
                                                                );
                                                            }
                                                        }}
                                                        onKeyPress={
                                                            handleKeyPress
                                                        }
                                                        required
                                                        dir={
                                                            isRtl
                                                                ? "rtl"
                                                                : "ltr"
                                                        }
                                                    />

                                                    {(isPasswordField ||
                                                        isConfirmPasswordField) && (
                                                        <button
                                                            type="button"
                                                            className={`absolute top-1/2 transform -translate-y-1/2 ${
                                                                isRtl
                                                                    ? "left-3"
                                                                    : "right-3"
                                                            } p-2 rounded-lg transition-all duration-200 z-10 ${
                                                                (
                                                                    isPasswordField
                                                                        ? showPassword
                                                                        : showConfirmPassword
                                                                )
                                                                    ? "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                                                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                                                            }`}
                                                            onClick={() => {
                                                                if (
                                                                    isPasswordField
                                                                ) {
                                                                    setShowPassword(
                                                                        !showPassword
                                                                    );
                                                                } else {
                                                                    setShowConfirmPassword(
                                                                        !showConfirmPassword
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            {(
                                                                isPasswordField
                                                                    ? showPassword
                                                                    : showConfirmPassword
                                                            ) ? (
                                                                <EyeOff
                                                                    size={18}
                                                                    className="stroke-2"
                                                                />
                                                            ) : (
                                                                <Eye
                                                                    size={18}
                                                                    className="stroke-2"
                                                                />
                                                            )}
                                                        </button>
                                                    )}

                                                    <button
                                                        type="submit"
                                                        className={`absolute ${
                                                            isRtl
                                                                ? isPasswordField ||
                                                                  isConfirmPasswordField
                                                                    ? "left-14"
                                                                    : "left-3"
                                                                : isPasswordField ||
                                                                  isConfirmPasswordField
                                                                ? "right-14"
                                                                : "right-3"
                                                        } top-1/2 transform -translate-y-1/2 rounded-full p-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors ${
                                                            processing
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                        }`}
                                                        disabled={processing}
                                                    >
                                                        {processing ? (
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <ArrowRight
                                                                size={18}
                                                                className={
                                                                    isRtl
                                                                        ? "rotate-180"
                                                                        : ""
                                                                }
                                                            />
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Show current error */}
                                                {currentError && (
                                                    <div
                                                        className={`mt-2 text-red-400 text-sm ${
                                                            isRtl
                                                                ? "text-right"
                                                                : "text-left"
                                                        }`}
                                                    >
                                                        {currentError}
                                                    </div>
                                                )}
                                            </div>

                                            {currentStep > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setCurrentStep(
                                                            currentStep - 1
                                                        )
                                                    }
                                                    className={`mt-4 text-xs text-indigo-400 hover:text-indigo-300 transition-colors ${
                                                        isRtl
                                                            ? "text-right"
                                                            : "text-left"
                                                    }`}
                                                >
                                                    {isRtl ? "→" : "←"}{" "}
                                                    {t("auth.register.goBack")}
                                                </button>
                                            )}
                                        </motion.form>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Login link */}
                            <div className="text-center px-4">
                                <p className="text-sm text-white bg-gray-800/40 backdrop-blur-sm inline-block px-4 py-2 rounded-full">
                                    {t("auth.register.alreadyHaveAccount")}{" "}
                                    <Link
                                        href={route("login")}
                                        className="font-medium text-indigo-300 hover:text-indigo-200 transition-colors"
                                    >
                                        {t("auth.signIn")}
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
