import { UserCheck, User } from "lucide-react";
import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";

export default function AuthIcon() {
    const { auth } = usePage().props;
    const isAuthenticated = !!auth.user;

    if (isAuthenticated) {
        // Show user with checkmark icon when authenticated (logout functionality)
        return (
            <Link
                href={route("logout")}
                method="post"
                as="button"
                className="w-12 h-12 rounded-full flex items-center justify-center p-4 mx-2 transition-all duration-300"
                style={{
                    background:
                        "linear-gradient(90deg, #5956e9, #6077a1, #2c2b2b)",
                    color: "#d4d3d3",
                }}
            >
                <UserCheck size={20} />
            </Link>
        );
    } else {
        // Show regular user icon when not authenticated (login functionality)
        return (
            <Link
                href={route("login")}
                className="w-12 h-12 rounded-full flex items-center justify-center p-4 mx-2 transition-all duration-300"
                style={{
                    background:
                        "linear-gradient(90deg, #5956e9, #6077a1, #2c2b2b)",
                    color: "#d4d3d3",
                }}
            >
                <User size={20} />
            </Link>
        );
    }
}
