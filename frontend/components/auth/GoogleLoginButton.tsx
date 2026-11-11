
"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/hooks/useAuth";

export default function GoogleLoginButton({
    onSuccess,
    onError,
}: {
    onSuccess: () => void;
    onError: (message: string) => void;
}) {
    const { loginWithGoogle } = useAuth();

    return (
        <div className="flex justify-center">
            <GoogleLogin
                onSuccess={async (credentialResponse) => {
                    try {
                        if (!credentialResponse.credential) {
                            throw new Error(
                                "Google did not return an ID token."
                            );
                        }

                        await loginWithGoogle(
                            credentialResponse.credential
                        );

                        onSuccess();
                    } catch (error) {
                        onError(
                            error instanceof Error
                                ? error.message
                                : "Google login failed."
                        );
                    }
                }}
                onError={() => {
                    onError("Google authentication failed.");
                }}
                theme="filled_black"
                shape="rectangular"
                size="large"
                width="100%"
                text="continue_with"
            />
        </div>
    );
}
