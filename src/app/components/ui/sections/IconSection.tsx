import { Row, Col, Card, Avatar } from "antd";
import { FaSuitcase, FaUserTie, FaHandshake } from "react-icons/fa";

const IconSection = () => {
  return (
    <Row gutter={[16, 16]} justify="center" align={"bottom"} className="mb-10">
      <Col xs={24} sm={12} md={8}>
        <Card
          hoverable
          bordered={false}
          className="text-center transition-shadow duration-300 ease-in-out hover:shadow-[0_4px_12px_rgba(54,162,235,0.3)]"
        >
          <Avatar
            size={64}
            icon={<FaSuitcase className="text-[#36A2EB]" />}
            className="mb-4"
            style={{ backgroundColor: "#F0F8FF" }} // Added background color
          />
          <h3 className="text-xl font-semibold text-gray-800">
            Open Positions
          </h3>
          <p className="text-gray-600">Browse exciting roles at our company</p>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card
          hoverable
          bordered={false}
          className="text-center transition-shadow duration-300 ease-in-out hover:shadow-[0_4px_12px_rgba(54,162,235,0.3)]"
        >
          <Avatar
            size={64}
            icon={<FaUserTie className="text-[#36A2EB]" />}
            className="mb-4"
            style={{ backgroundColor: "#F0F8FF" }} // Added background color
          />
          <h3 className="text-xl font-semibold text-gray-800">Career Growth</h3>
          <p className="text-gray-600">We help you build an future</p>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card
          hoverable
          bordered={false}
          className="text-center transition-shadow duration-300 ease-in-out hover:shadow-[0_4px_12px_rgba(54,162,235,0.3)]"
        >
          <Avatar
            size={64}
            icon={<FaHandshake className="text-[#36A2EB]" />}
            className="mb-4"
            style={{ backgroundColor: "#F0F8FF" }} // Added background color
          />
          <h3 className="text-xl font-semibold text-gray-800">
            Inclusive Culture
          </h3>
          <p className="text-gray-600">Diversity and collaboration are key</p>
        </Card>
      </Col>
    </Row>
  );
};

export default IconSection;
