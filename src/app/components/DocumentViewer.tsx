import React from "react";
import { List, Button } from "antd";
import { FileOutlined, DownloadOutlined } from "@ant-design/icons";
import { mockDocument } from "../data/mockDocument";

interface DocumentViewerProps {
  employeeId: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ employeeId }) => {
  const documents = mockDocument[employeeId] || [];

  const handleDownload = (fileUrl: string, fileName: string) => {
    // Implement document download logic here
  };

  return (
    <List
      header={<div className="font-bold">Employee Documents</div>}
      bordered
      dataSource={documents}
      renderItem={(document) => (
        <List.Item
          actions={[
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(document.fileUrl, document.name)}
            >
              Download
            </Button>
          ]}
        >
          <List.Item.Meta
            avatar={<FileOutlined style={{ fontSize: '24px' }} />}
            title={document.name}
            description={`Type: ${document.type} | Uploaded: ${document.uploadDate}`}
          />
        </List.Item>
      )}
    />
  );
};

export default DocumentViewer;