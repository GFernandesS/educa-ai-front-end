import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../enums/user-role";

export function useAuthorization(redirectToHome: boolean) {
    const navigate = useNavigate()

    useEffect(() => {
        const roleItem = localStorage.getItem('role')

        if (!roleItem) {
            if (redirectToHome)
                navigate('/')
            return
        }

        const roleItemAsNumber = Number(roleItem)

        if (roleItemAsNumber == UserRole.Student)
            navigate('/chat')
        else
            navigate('/teacher-comment')
    }, [])
}