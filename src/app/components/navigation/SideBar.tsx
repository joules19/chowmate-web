// src/components/AntSidebar.tsx
import React, { useState } from "react";
import { Layout, Menu, Drawer } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  DashboardOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Link } from "react-router-dom";

const { Sider } = Layout;
const { SubMenu } = Menu;

interface AntSidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const AntSidebar: React.FC<AntSidebarProps> = ({
  activeMenu,
  setActiveMenu,
}) => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setActiveMenu(e.key);
  };

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <>
      <Sider
        width={200}
        className="site-layout-background"
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          if (broken) {
            setDrawerVisible(true);
          }
        }}
      >
        <div className="logo" />
        <Menu
          mode="inline"
          selectedKeys={[activeMenu]}
          onClick={handleMenuClick}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item key="Dashboard" icon={<DashboardOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="Employees">
            <Menu.Item key="EmployeeList">
              <Link to="/employees">Employee List</Link>
            </Menu.Item>
            <Menu.Item key="EmployeeSettings">
              <Link to="/employees/settings">Employee Settings</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<TeamOutlined />} title="Teams">
            <Menu.Item key="TeamList">
              <Link to="/teams">Team List</Link>
            </Menu.Item>
            <Menu.Item key="TeamSettings">
              <Link to="/teams/settings">Team Settings</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub3"
            icon={<AppstoreAddOutlined />}
            title="Departments"
          >
            <Menu.Item key="DepartmentList">
              <Link to="/departments">Department List</Link>
            </Menu.Item>
            <Menu.Item key="DepartmentSettings">
              <Link to="/departments/settings">Department Settings</Link>
            </Menu.Item>
          </SubMenu>
          {/* Add more submenus as needed */}
        </Menu>
      </Sider>
      <Drawer
        title="Menu"
        placement="left"
        closable={false}
        onClose={toggleDrawer}
        visible={drawerVisible}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="inline"
          selectedKeys={[activeMenu]}
          onClick={handleMenuClick}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item key="Dashboard" icon={<DashboardOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="Employees">
            <Menu.Item key="EmployeeList">
              <Link to="/employees">Employee List</Link>
            </Menu.Item>
            <Menu.Item key="EmployeeSettings">
              <Link to="/employees/settings">Employee Settings</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<TeamOutlined />} title="Teams">
            <Menu.Item key="TeamList">
              <Link to="/teams">Team List</Link>
            </Menu.Item>
            <Menu.Item key="TeamSettings">
              <Link to="/teams/settings">Team Settings</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub3"
            icon={<AppstoreAddOutlined />}
            title="Departments"
          >
            <Menu.Item key="DepartmentList">
              <Link to="/departments">Department List</Link>
            </Menu.Item>
            <Menu.Item key="DepartmentSettings">
              <Link to="/departments/settings">Department Settings</Link>
            </Menu.Item>
          </SubMenu>
          {/* Add more submenus as needed */}
        </Menu>
      </Drawer>
    </>
  );
};

export default AntSidebar;
