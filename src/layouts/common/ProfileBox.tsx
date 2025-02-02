import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutDialog } from "@/components/dialogs";

const ProfileBox = () => {
	const [isDropdownOpen, setDropdownOpen] = useState(false);

	const toggleDropdown = () => {
		setDropdownOpen(!isDropdownOpen);
	};

	return (
		<div className="relative">
			{/* Profile Header */}
			<div
				className="flex items-center gap-3 cursor-pointer"
				onClick={toggleDropdown}
			>
				<Avatar className="w-8 h-8">
					<AvatarImage src="/image" alt="Profile Image" />
					<AvatarFallback>A</AvatarFallback>
				</Avatar>
				<div className="text-left">
					<h5 className="text-[13px] font-semibold">Admin</h5>
					<p className="text-muted text-[10px]">admin</p>
				</div>
				<span className="ml-1 text-muted">
					{isDropdownOpen ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M14.707 10.707a1 1 0 01-1.414 0L10 7.414 6.707 10.707a1 1 0 11-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
								clipRule="evenodd"
							/>
						</svg>
					)}
				</span>
			</div>


			{/* Dropdown Menu */}
			{isDropdownOpen && (
				<div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 z-50">
					<ul className="py-2">
						<li className="px-4 py-2 text-sm font-bold text-gray-700">
							My Account
						</li>
						<hr />
						<LogoutDialog>
							<li className="px-4 py-2 text-sm text-destructive hover:bg-accent cursor-pointer rounded-md">
								Log out
							</li>
						</LogoutDialog>
					</ul>
				</div>
			)}
		</div>
	);
};

export default ProfileBox;
