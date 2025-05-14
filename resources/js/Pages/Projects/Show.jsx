import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ auth, project }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    تفاصيل المشروع: {project.name}
                </h2>
            }
        >
            <Head title={`مشروع - ${project.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    الاسم
                                </h3>
                                <p className="mt-1 text-gray-700 dark:text-gray-300">
                                    {project.name}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    الوصف
                                </h3>
                                <p className="mt-1 text-gray-700 dark:text-gray-300">
                                    {project.description ||
                                        "لا يوجد وصف مضاف لهذا المشروع."}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    الصناعة
                                </h3>
                                <p className="mt-1 text-gray-700 dark:text-gray-300">
                                    {project.industry}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    السوق المستهدف
                                </h3>
                                <p className="mt-1 text-gray-700 dark:text-gray-300">
                                    {project.target_market}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    الموقع الجغرافي
                                </h3>
                                <p className="mt-1 text-gray-700 dark:text-gray-300">
                                    {project.location}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    الحالة
                                </h3>
                                <span
                                    className={`mt-1 inline-block px-3 py-1 text-sm font-semibold ${
                                        project.status === "idea"
                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                            : project.status === "in_progress"
                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                            : project.status === "launched"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                            : ""
                                    } rounded-full`}
                                >
                                    {project.status_display || project.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
