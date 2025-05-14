import React from "react";
import { Link, Head } from "@inertiajs/react";
import {
    PlusIcon,
    DocumentTextIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ auth, plans, projects }) {
    const getStatusBadge = (status) => {
        const badges = {
            draft: "bg-gray-100 text-gray-800 border-gray-300",
            completed: "bg-green-100 text-green-800 border-green-300",
            premium: "bg-purple-100 text-purple-800 border-purple-300",
        };

        const labels = {
            draft: "مسودة",
            completed: "مكتملة",
            premium: "متميزة",
        };

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${badges[status]}`}
            >
                {labels[status]}
            </span>
        );
    };

    const getProgress = (plan) => {
        let completed = 0;
        const total = 6; // عدد الأقسام المطلوبة

        if (plan.summary) completed++;
        if (plan.finance) completed++;
        if (plan.market) completed++;
        if (plan.audiences?.length > 0) completed++;
        if (plan.goals?.length > 0) completed++;
        if (plan.ai_analysis) completed++;

        return (completed / total) * 100;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        خطط العمل
                    </h2>
                    <Link
                        href={route("plans.create")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5" />
                        إنشاء خطة جديدة
                    </Link>
                </div>
            }
        >
            <Head title="خطط العمل" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {plans.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center">
                                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    لا توجد خطط عمل
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    ابدأ بإنشاء خطة عمل جديدة لمشروعك
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href={route("plans.create")}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                                        إنشاء خطة عمل
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <ul className="divide-y divide-gray-200">
                                {plans.map((plan) => (
                                    <li key={plan.id}>
                                        <Link
                                            href={route("plans.show", plan.id)}
                                            className="block hover:bg-gray-50"
                                        >
                                            <div className="px-4 py-4 sm:px-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <DocumentTextIcon className="h-8 w-8 text-gray-400 ml-3" />
                                                        <div>
                                                            <p className="text-sm font-medium text-blue-600 truncate">
                                                                {plan.title}
                                                            </p>
                                                            <p className="text-sm text-gray-500 truncate">
                                                                {
                                                                    plan.project
                                                                        .name
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {getStatusBadge(
                                                            plan.status
                                                        )}
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(
                                                                plan.created_at
                                                            ).toLocaleDateString(
                                                                "ar-AE"
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                        <span>التقدم</span>
                                                        <span>
                                                            {Math.round(
                                                                getProgress(
                                                                    plan
                                                                )
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{
                                                                width: `${getProgress(
                                                                    plan
                                                                )}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex justify-between items-center">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <ChartBarIcon className="flex-shrink-0 ml-1.5 h-4 w-4 text-gray-400" />
                                                        <span>
                                                            {plan.ai_suggestions
                                                                ?.length ||
                                                                0}{" "}
                                                            اقتراح من الذكاء
                                                            الاصطناعي
                                                        </span>
                                                    </div>
                                                    {plan.pdf_path && (
                                                        <a
                                                            href={route(
                                                                "plans.pdf",
                                                                plan.id
                                                            )}
                                                            className="text-xs text-blue-600 hover:text-blue-800"
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >
                                                            تحميل PDF
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
