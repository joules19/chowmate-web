import React, { useState } from "react";
import { Button, message, notification, Popconfirm } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
import { clearSession } from "../../utils/sessionManager";
import { useNavigate } from "react-router-dom";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State for loading spinner

  // Handle the logout process
  const handleLogout = () => {
    // Clear the session
    clearSession();

    // Redirect to login page
    navigate("/");
    message.success("Logout successful");
  };

  const confirmLogout = (): void => {
    // Set loading spinner for 3 seconds
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleLogout(); // Proceed with logout after 3 seconds
    }, 3000); // 3 seconds delay
  };

  const cancelLogout = (): void => {
    // message.info("Logout Cancelled. You are still logged in")
    message.info("You are still logged in.")

  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <Popconfirm
        title="Are you sure you want to log out?"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        okText="Yes"
        cancelText="No"
        placement="bottomRight"
        okButtonProps={{
          loading: loading, // Set the loading spinner on the "Yes" button
          style: { backgroundColor: "#36A2EB", borderColor: "#36A2EB" },
        }} // Primary color for 'Yes' button
        cancelButtonProps={{
          style: { color: "#36A2EB", borderColor: "#36A2EB" },
        }} // Primary color for 'No' button
      >
        <Button
          type="primary"
          shape="circle"
          icon={<PoweroffOutlined />}
          style={{
            fontSize: 24,
            backgroundColor: "#36A2EB",
            borderColor: "#36A2EB",
          }}
        />
      </Popconfirm>
    </div>
  );
};

export default LogoutButton;
