import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space, Badge, Typography } from "antd";
import { BellOutlined } from "@ant-design/icons";

const { Text } = Typography;

const NotificationButton: React.FC = () => {
  // Manage dynamic notification count
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Performance Review", href: "#" },
    { id: 2, message: "New Employee", href: "#" },
    { id: 3, message: "Onboarding Today", href: "#" },
  ]);

  // Create menu items dynamically
  const items: MenuProps["items"] = notifications.map((notification) => ({
    key: notification.id.toString(),
    label: (
      <a target="_blank" rel="noopener noreferrer" href={notification.href}>
        {notification.message}
      </a>
    ),
  }));

  return (
    <Space direction="vertical">
      <Space wrap>
        <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
          {/* <Badge count={notifications.length}> */}
          <Badge count={1}>
            <Button
              icon={<BellOutlined />}
              shape="default"
              type="default"
              aria-label="Notifications"
            />
          </Badge>
        </Dropdown>
        <Text>Notification Center</Text>
      </Space>
    </Space>
  );
};

export default NotificationButton;
