import ApplicationLogo from "@/Components/ApplicationLogo";

export default function Footer() {
    return (
        <footer>
            <div className="bg-white dark:bg-black relative z-10 border-t border-gray-200 dark:border-gray-800 mt-12">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div className="mb-4 sm:mb-0">
                            <ApplicationLogo className="block h-8 w-auto" />
                        </div>
                        <div className="text-center sm:text-right text-sm text-gray-500 dark:text-gray-400">
                            <p>
                                © {new Date().getFullYear()} First Darfy. All
                                rights reserved.
                            </p>
                            <p className="mt-1">
                                Designed with ❤️ for a better financial future
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
