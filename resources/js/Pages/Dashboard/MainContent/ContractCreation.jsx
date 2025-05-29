import React from "react";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

export default function ContractCreation() {
    const { t } = useTranslation();

    return (
        <motion.div
            className={`p-10 rounded-lg cursor-pointer w-full text-center transition-all duration-300 
        bg-white/40 dark:bg-gray-900/20 dark:text-gray-200
        hover:bg-Fdbg-hover hover:text-white
        shadow-xl shadow-blue-500/5 dark:shadow-purple-500/10`}
            whileTap={{ scale: 0.95 }}
        >
            <Link
                href={route("contracts.create")}
                className="block h-full group"
            >
                <div className="group-hover:Fdbg rounded-lg p-4 transition-all duration-300">
                    <h2 className="text-xl font-semibold">Create Contract</h2>
                    <p className="text-sm mt-2">
                        Generate AI-powered legal contracts
                    </p>
                    <div className="mt-4">
                        <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-medium px-3 py-1 rounded-full">
                            AI Contract
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
