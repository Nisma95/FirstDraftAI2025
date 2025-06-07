import { Head, Link } from "@inertiajs/react";
import { ArrowRight, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TopTools from "@/Components/TopTools";
import InputError from "@/Components/InputError";
import StarBackground from "@/Components/StarBackground";
import { useLogin } from "./useLogin";

// Import the shared media CSS file
import "../../../css/auth/auth-media.css";

export default function Login({ status, canResetPassword }) {
    const {
        data,
        setData,
        processing,
        errors,
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
        emailInputRef,
        passwordInputRef,
        fontFamily,
        t,
        i18n,
        handleEmailSubmit,
        handlePasswordVisibility,
        resetToEmailStep,
        submit,
    } = useLogin();

    const businessImageUrl = "/images/loginPix.jpeg";

    return (
        <div
            className="relative flex h-screen w-screen items-center justify-center p-4"
            style={{ fontFamily }}
        >
            <StarBackground />
            <Head title={t("auth.signIn")} />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl relative"
                style={{ minHeight: "500px" }}
            >
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${businessImageUrl})` }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />

                <div className="relative h-full w-full">
                    <div className="flex justify-center items-center min-h-[500px] p-8">
                        <motion.div className="w-full max-w-md">
                            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl text-white mb-6">
                                {/* TopTools */}
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

                                {/* Forms */}
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
                                                    {/* Email Placeholder */}
                                                    <div
                                                        className={`${
                                                            data.email
                                                                ? "hidden"
                                                                : "block"
                                                        } absolute ${
                                                            isRtl
                                                                ? "right-4"
                                                                : "left-4"
                                                        } top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none z-10`}
                                                        style={{
                                                            maxWidth:
                                                                "calc(100% - 120px)",
                                                            overflow: "hidden",
                                                            whiteSpace:
                                                                "nowrap",
                                                            textOverflow:
                                                                "ellipsis",
                                                        }}
                                                    >
                                                        {emailText}
                                                    </div>

                                                    {/* Email Input */}
                                                    <input
                                                        ref={emailInputRef}
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        value={data.email}
                                                        className={`w-full rounded-xl border-0 py-4 ${
                                                            isRtl
                                                                ? "pr-4 pl-20 text-right"
                                                                : "pl-4 pr-20 text-left"
                                                        } text-gray-900 bg-gray-100/90 shadow-inner focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700/70 dark:text-white`}
                                                        placeholder=""
                                                        autoComplete="username"
                                                        dir={
                                                            isRtl
                                                                ? "rtl"
                                                                : "ltr"
                                                        }
                                                        style={{ fontFamily }}
                                                        onChange={(e) => {
                                                            setData(
                                                                "email",
                                                                e.target.value
                                                            );
                                                            setShowEmailPlaceholder(
                                                                false
                                                            );
                                                        }}
                                                    />

                                                    {/* Email Submit Button */}
                                                    <button
                                                        type="submit"
                                                        className={`absolute ${
                                                            isRtl
                                                                ? "left-3"
                                                                : "right-3"
                                                        } top-1/2 transform -translate-y-1/2 rounded-full p-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors z-20 ${
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
                                                    {/* Logging in as */}
                                                    <div className="text-sm mb-2 text-gray-300">
                                                        <span>
                                                            {i18n.language ===
                                                            "ar"
                                                                ? "تسجيل الدخول باسم"
                                                                : "Logging in as"}{" "}
                                                        </span>
                                                        <span className="font-semibold text-white">
                                                            {data.email}
                                                        </span>
                                                    </div>

                                                    <div className="relative">
                                                        {/* Password Placeholder */}
                                                        <div
                                                            className={`${
                                                                data.password
                                                                    ? "hidden"
                                                                    : "block"
                                                            } absolute ${
                                                                isRtl
                                                                    ? "right-4"
                                                                    : "left-4"
                                                            } top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none z-10`}
                                                            style={{
                                                                maxWidth:
                                                                    "calc(100% - 120px)",
                                                                overflow:
                                                                    "hidden",
                                                                whiteSpace:
                                                                    "nowrap",
                                                                textOverflow:
                                                                    "ellipsis",
                                                            }}
                                                        >
                                                            {passwordText}
                                                        </div>

                                                        {/* Password Input */}
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
                                                            className={`w-full rounded-xl border-0 py-4 ${
                                                                isRtl
                                                                    ? "pr-4 pl-20 text-right"
                                                                    : "pl-4 pr-20 text-left"
                                                            } text-gray-900 bg-gray-100/90 shadow-inner focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700/70 dark:text-white`}
                                                            placeholder=""
                                                            autoComplete="current-password"
                                                            dir={
                                                                isRtl
                                                                    ? "rtl"
                                                                    : "ltr"
                                                            }
                                                            style={{
                                                                fontFamily,
                                                            }}
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
                                                        />

                                                        {/* Eye Toggle Button */}
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
                                                            } hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors z-20`}
                                                            onClick={
                                                                handlePasswordVisibility
                                                            }
                                                            aria-label={
                                                                isPasswordVisible
                                                                    ? "Hide password"
                                                                    : "Show password"
                                                            }
                                                        >
                                                            <Eye
                                                                size={18}
                                                                className={
                                                                    isPasswordVisible
                                                                        ? "fill-current"
                                                                        : ""
                                                                }
                                                            />
                                                        </button>

                                                        {/* Password Submit Button */}
                                                        <button
                                                            type="submit"
                                                            className={`absolute ${
                                                                isRtl
                                                                    ? "left-3"
                                                                    : "right-3"
                                                            } top-1/2 transform -translate-y-1/2 rounded-full p-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors z-20 ${
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

                                                    {/* Action buttons */}
                                                    <div className="mt-4 flex justify-between items-center">
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                resetToEmailStep
                                                            }
                                                            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                                                        >
                                                            {i18n.language ===
                                                            "ar"
                                                                ? "← تغيير الإيميل"
                                                                : "← Change email"}
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
                                                    {i18n.language === "ar"
                                                        ? "كلمة مرور خاطئة. نسيت كلمة المرور؟"
                                                        : "Incorrect password. Forgot password?"}
                                                </p>
                                                <div className="flex justify-center space-x-4">
                                                    <Link
                                                        href={route(
                                                            "password.request"
                                                        )}
                                                        className="text-xs text-indigo-300 hover:text-indigo-200 transition-colors"
                                                    >
                                                        {i18n.language === "ar"
                                                            ? "إعادة تعيين كلمة المرور"
                                                            : "Reset password"}
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
                                                        {i18n.language === "ar"
                                                            ? "حاول مرة أخرى"
                                                            : "Try again"}
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Registration link */}
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
