
import { Suspense } from "react";

import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

function LoginContent() {
    return (
        <AuthLayout
            title="Welcome Back"
            description="Login to access your student or staff account."
        >
            <LoginForm />
        </AuthLayout>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#081a2d]" />
            }
        >
            <LoginContent />
        </Suspense>
    );
}
