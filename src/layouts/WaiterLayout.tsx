import { useAuth } from "@/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import ProfileBox from "./common/ProfileBox";
import { useState } from "react";
import { Menu as MenuIcon, X as XIcon } from "lucide-react";
import { Cross1Icon } from "@radix-ui/react-icons";
import Sidebar from "@/components/waiter-sidebar/Sidebar";

const WaiterLayout = () => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  if (!isAuthenticated) {
    return <Navigate to={"/auth/login"} state={{ from: location }} replace />;
  }

  if (role === "chef" ) {
    return <Navigate to="/chef/dashboard" />;
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}

      {/* Desktop Sidebar */}
      {/* <div className="hidden lg:block">
        <div className="lg:flex flex-col hidden min-h-svh bg-gray-100 h-full transition-all duration-300 lg:min-w-[280px] shadow-lg">
          <div className="flex flex-col items-center justify-center h-20">
            <div className="">YaTharYone</div>
          </div>
          <MobileSidebar />
        </div>
      </div> */}

      {/* Mobile Sidebar */}
      {isSidebarOpen &&
        <div className="fixed top-0 left-0 w-[280px] h-full bg-gray-100 z-[100] shadow-lg">
          <div className="py-4">
            <div className="flex justify-between mb-10 px-3">
              <div className="">
                YaTharYone
              </div>
              <button onClick={toggleSidebar}>
                <Cross1Icon />
              </button>
            </div>
            <div>
              <Sidebar />
            </div>
          </div>
        </div>
      }


      {/* Main Content */}
      <main className="flex flex-col w-full overflow-y-auto">
        {/* Header */}
        <nav className="flex items-center justify-between p-3 bg-white shadow-md z-[50] sticky top-0">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          
          >
            {isSidebarOpen ? (
              <XIcon className="w-6 h-6 text-gray-600" />
            ) : (
              <MenuIcon className="w-6 h-6 text-gray-600" />
            )}
          </button>
          <div className="ml-auto flex items-center">
            <ProfileBox />
          </div>
        </nav>

        {/* Outlet for dynamic content */}
        <div className="p-4 z-[1]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default WaiterLayout;
