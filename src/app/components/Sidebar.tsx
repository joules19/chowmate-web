import React from "react";
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillAlt,
  FaChartBar,
  FaDatabase,
  FaUserPlus,
  FaHistory,
  FaFileAlt,
} from "react-icons/fa";

// Define the type for menu items
interface MenuItem {
  name: string;
  icon: JSX.Element;
}

// Define the type for the Sidebar props
interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  activeEmployeeSubmenu: string;
  setActiveEmployeeSubmenu: (submenu: string) => void;
  employeeDropdownOpen: boolean;
  setEmployeeDropdownOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  setActiveMenu,
  activeEmployeeSubmenu,
  setActiveEmployeeSubmenu,
  employeeDropdownOpen,
  setEmployeeDropdownOpen,
}) => {
  const menuItems: MenuItem[] = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Employees", icon: <FaUsers /> },
    { name: "Attendance", icon: <FaCalendarAlt /> },
    { name: "Payroll", icon: <FaMoneyBillAlt /> },
    { name: "Reports", icon: <FaChartBar /> },
  ];

  const employeeSubmenuItems: MenuItem[] = [
    { name: "Database", icon: <FaDatabase /> },
    { name: "Add Employee", icon: <FaUserPlus /> },
    { name: "Job History", icon: <FaHistory /> },
    { name: "Documents", icon: <FaFileAlt /> },
  ];

  return (
    <nav className="col-md-3 col-lg-2 d-md-block custom-bg-sidebar sidebar">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.name}>
              {item.name === "Employees" ? (
                <div>
                  <a
                    className={`nav-link ${
                      activeMenu === item.name ? "active" : ""
                    }`}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveMenu(item.name);
                      setEmployeeDropdownOpen(!employeeDropdownOpen);
                    }}
                  >
                    <span className="me-2">{item.icon}</span>
                    {item.name}
                    <span className="ms-2">▼</span>
                  </a>
                  <ul
                    className={`nav flex-column ms-3 ${
                      employeeDropdownOpen ? "d-block" : "d-none"
                    }`}
                  >
                    {employeeSubmenuItems.map((subItem) => (
                      <li className="nav-item" key={subItem.name}>
                        <a
                          className={`nav-link ${
                            activeEmployeeSubmenu === subItem.name
                              ? "active"
                              : ""
                          }`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveEmployeeSubmenu(subItem.name);
                            setActiveMenu("Employees");
                          }}
                        >
                          <span className="me-2">{subItem.icon}</span>
                          {subItem.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <a
                  className={`nav-link ${
                    activeMenu === item.name ? "active" : ""
                  }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveMenu(item.name);
                  }}
                >
                  <span className="me-2">{item.icon}</span>
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
