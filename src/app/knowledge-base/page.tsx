"use client";
import { Card, Row, Col } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import Navbar from "../components/navigation/NavBar";

const tutorials = [
  {
    id: "product-management",
    title: "Product Management",
    description: "Learn how to effectively manage your products on the Chowmate platform",
    thumbnail: "/api/placeholder/300/200",
    duration: "15 min",
    category: "Vendor"
  }
];

export default function KnowledgeBasePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 pt-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Knowledge Base
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn how to make the most of Chowmate with our comprehensive video tutorials and guides
            </p>
          </div>

        <Row gutter={[24, 24]} justify="center">
          {tutorials.map((tutorial) => (
            <Col xs={24} sm={12} lg={8} key={tutorial.id}>
              <Link href={`/knowledge-base/${tutorial.id}`}>
                <Card
                  hoverable
                  className="h-full transition-all duration-300 hover:shadow-lg border-0 overflow-hidden"
                  cover={
                    <div className="relative h-48 bg-gradient-to-br from-[#FFC107] to-[#FFD54F] flex items-center justify-center">
                      <PlayCircleOutlined className="text-6xl text-white opacity-80" />
                    </div>
                  }
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs bg-[#FFC107] text-gray-800 px-2 py-1 rounded-full font-medium">
                        {tutorial.category}
                      </span>
                      <span className="text-xs text-gray-500">{tutorial.duration}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {tutorial.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {tutorial.description}
                    </p>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
        </div>
      </div>
    </>
  );
}