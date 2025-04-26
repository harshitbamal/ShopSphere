import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";

const withAuth = (WrappedComponent) => {
    return (props) => {
        const { user } = useContext(AuthContext);
        const router = useRouter();

        useEffect(() => {
            if (!user) {
                router.push("/auth/login"); // Redirect if not logged in
            }
        }, [user, router]);

        if (!user) {
            return <p>Loading...</p>; // Show loading text until redirect
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
