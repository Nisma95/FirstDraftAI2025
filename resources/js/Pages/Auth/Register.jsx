import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import TopTools from "@/Components/TopTools";
import StarBackground from "@/Components/StarBackground";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { Eye, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

// Import the shared media CSS file
import "../../../css/auth/auth-media.css";

export default function Register() {
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
            autoComplete: "name",
        },
        {
            name: "email",
            label: t("auth.register.fields.email.label"),
            placeholder: t("auth.register.fields.email.placeholder"),
            type: "email",
            autoComplete: "username",
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

    const handleNext = (e) => {
        e.preventDefault();
        const currentField = fields[currentStep];
        const value = data[currentField.name];

        if (!value) return;

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
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    const businessImageUrl = "/images/loginPix.jpeg";
    const currentField = fields[currentStep];
    const isPasswordField = currentField.name === "password";
    const isConfirmPasswordField =
        currentField.name === "password_confirmation";
    const showPasswordToggle = isPasswordField
        ? showPassword
        : showConfirmPassword;

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
                            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl text-white mb-6">
                                {/* Controls bar - Fixed positioning for TopTools */}
                                <div
                                    className="flex justify-center items-center gap-4 p-4 my-10"
                                    dir="ltr"
                                >
                                    <TopTools />
                                </div>

                                {/* Header - Title and Steps side by side */}
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
                                                            (isPasswordField ||
                                                                isConfirmPasswordField) &&
                                                            !showPasswordToggle
                                                                ? "password"
                                                                : "text"
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
                                                                ? "text-right pl-12 pr-4"
                                                                : "text-left pr-12 pl-4"
                                                        }`}
                                                        placeholder={
                                                            currentField.placeholder
                                                        }
                                                        autoComplete={
                                                            currentField.autoComplete
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                currentField.name,
                                                                e.target.value
                                                            )
                                                        }
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
                                                                    ? "left-12"
                                                                    : "right-12"
                                                            } ${
                                                                showPasswordToggle
                                                                    ? "text-indigo-500"
                                                                    : "text-gray-500"
                                                            } hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors`}
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
                                                            aria-label={t(
                                                                "auth.register.togglePassword"
                                                            )}
                                                        >
                                                            <Eye
                                                                size={18}
                                                                className={
                                                                    showPasswordToggle
                                                                        ? "fill-current"
                                                                        : ""
                                                                }
                                                            />
                                                        </button>
                                                    )}

                                                    <button
                                                        type="submit"
                                                        className={`absolute ${
                                                            isRtl
                                                                ? "left-3"
                                                                : "right-3"
                                                        } top-1/2 transform -translate-y-1/2 rounded-full p-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors ${
                                                            !data[
                                                                currentField
                                                                    .name
                                                            ] || processing
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                        }`}
                                                        disabled={
                                                            !data[
                                                                currentField
                                                                    .name
                                                            ] || processing
                                                        }
                                                        aria-label={
                                                            currentStep ===
                                                            fields.length - 1
                                                                ? t(
                                                                      "auth.register.submit"
                                                                  )
                                                                : t(
                                                                      "auth.register.next"
                                                                  )
                                                        }
                                                    >
                                                        <ArrowRight
                                                            size={18}
                                                            className={
                                                                isRtl
                                                                    ? "rotate-180"
                                                                    : ""
                                                            }
                                                        />
                                                    </button>
                                                </div>

                                                <InputError
                                                    message={
                                                        errors[
                                                            currentField.name
                                                        ]
                                                    }
                                                    className={`mt-2 ${
                                                        isRtl
                                                            ? "text-right"
                                                            : "text-left"
                                                    }`}
                                                />
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

                            {/* Registration link outside the card */}
                            <div
                                className={`text-center px-4 ${
                                    isRtl ? "text-right" : "text-left"
                                }`}
                            >
                                <p
                                    className={`text-sm text-white bg-gray-800/40 backdrop-blur-sm inline-block px-4 py-2 rounded-full ${
                                        isRtl ? "text-right" : "text-left"
                                    }`}
                                >
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
