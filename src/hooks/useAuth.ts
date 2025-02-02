import Cookies from "js-cookie"
import { useState } from "react"

export default function useAuth() {
	const token = Cookies.get("employee")
	const role = Cookies.get("role")

	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token)

	const userLogin = (token: string, role: string) => {
		Cookies.set("employee", token)
		Cookies.set("role", role)
		setIsAuthenticated(true)
	}

	const userLogout = () => {
		Cookies.remove("employee")
		Cookies.remove("role")
		setIsAuthenticated(false)
	}

	return { isAuthenticated, userLogin, userLogout, role }
}
