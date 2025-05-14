// BackButtonHandler.js
import { ChevronLeft, X } from "lucide-react";
import { motion } from "framer-motion";

const BackButtonHandler = ({
    step,
    currentField,
    fields,
    onBack,
    isDetails = false,
}) => {
    const handleBack = () => {
        if (step === "project") {
            // Go back to previous page (outside this form)
            window.history.back();
        } else if (step === "details") {
            // Find current field index
            const currentIndex = fields.findIndex(
                (field) => field.key === currentField
            );

            if (currentIndex === 0) {
                // If we're on the first field, go back to project selection
                onBack(); // This should call setStep("project")
            } else {
                // Otherwise, just go to previous field
                onBack(); // This should call handlePrevious
            }
        }
    };

    // Choose icon based on step
    const icon =
        step === "project" ? (
            <X className="w-5 h-5 mx-auto" />
        ) : (
            <ChevronLeft className="w-5 h-5 mx-auto" />
        );

    return (
        <motion.button
            onClick={handleBack}
            className="w-[15%] bg-white border border-gray-300 text-black rounded-lg py-3 hover:bg-gray-50 transition-colors"
            whileTap={{ scale: 0.95 }}
            type="button"
        >
            {icon}
        </motion.button>
    );
};

export default BackButtonHandler;
