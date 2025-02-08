import { sidebarData } from "@/components/waiter-sidebar/sidebarData.ts";
import { t } from "i18next";
import { ChevronRightIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const toggleSubMenu = (itemName: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));

  };

  const ActiveMainMenu = (item: any): string => {
    const currentPath = window.location.pathname;

    // Check if any submenu is active
    if (item.subMenu) {
      const isSubMenuActive = item.subMenu.some((subMenu: any) =>
        subMenu.routeNames.some((path: string) => currentPath.startsWith(path))
      );

      if (isSubMenuActive) {
        return "bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow";
      }
    }

    // Check if the main menu itself is active
    const paths: string[] = item.routeNames;
    if (!paths || paths.some((path) => path === "")) {
      return "";
    }

    const isActive = paths.some((path) => currentPath.startsWith(path));
    if (isActive) {
      return "bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow";
    }

    return "";
  };


  const ActiveSubMenu = (paths: string[]): string => {
    const currentPath = window.location.pathname;

    if (!paths || paths.some((path) => path === "")) {
      return "";
    }

    const isActive = paths.some((path) => currentPath.startsWith(path));

    if (isActive) {
      return "bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow";
    }

    return "";
  };


  return (
    <div className="h-full">
      <div className="px-3">
        {sidebarData.map((item) => (
          <div
            key={item.name}
            className={`flex flex-col`}>
            <div className={`p-2 rounded-sm cursor-pointer ${ActiveMainMenu(item)} 
            ${openSubMenus[item.name] ? "" : "hover:bg-accent mb-3"}`}>
              {/* Main Menu */}
              {item.routeNames[0] === "" ? (
                <div className="flex items-center justify-between"
                  onClick={() => toggleSubMenu(item.name)}
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <p className="text-[13px]">{t(item.name)}</p>
                  </div>
                  <ChevronRightIcon
                    className={`w-4 h-4 transform transition-transform ${openSubMenus[item.name] ? "rotate-90" : ""
                      }`}
                  />
                </div>
              ) : (
                <NavLink to={item.routeNames[0]}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <p className="text-[13px]">{t(item.name)}</p>
                    </div>
                  </div>
                </NavLink>
              )}
            </div>
            {/* Submenu */}
            {item.subMenu && openSubMenus[item.name] && (
              <div className="ml-[14px] mt-1 pl-3 border-s-2 border-dashed mb-3">
                {item.subMenu.map((subItem) => (
                  <div
                    key={subItem.name}
                    className={`p-2 flex flex-col rounded-sm cursor-pointer mt-2 ${ActiveSubMenu(subItem.routeNames)} hover:bg-accent`}
                  >
                    <NavLink to={subItem.routeNames[0]}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {subItem.icon && <subItem.icon className="w-4 h-4" />}
                          <p className="text-[13px]">{t(subItem.name)}</p>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
