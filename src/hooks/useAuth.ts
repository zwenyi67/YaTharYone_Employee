import { UserData } from "@/api/auth/types"
import Cookies from "js-cookie"
import { useState } from "react"

export default function useAuth() {
	const token = Cookies.get("employee")
	const role = Cookies.get("role")

	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token)

	const userLogin = (token: string, role: string, userData: UserData) => {
		Cookies.set("employee", token)
		Cookies.set("role", role)
		localStorage.setItem("userData", JSON.stringify(userData));
		setIsAuthenticated(true)

		window.dispatchEvent(new Event("storage"));
	}

	const userLogout = () => {
		Cookies.remove("employee")
		Cookies.remove("role")
		localStorage.removeItem("userData");
		setIsAuthenticated(false)

		window.dispatchEvent(new Event("storage"));
	}

	return { isAuthenticated, userLogin, userLogout, role }
}
