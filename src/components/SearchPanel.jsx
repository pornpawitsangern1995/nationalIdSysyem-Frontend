import { useState } from "react";
import { Card, Form, Row, Col, Input, Button, Space, DatePicker } from "antd";
import {
  SearchOutlined,
  ClearOutlined,
  IdcardOutlined,
  UserOutlined,
  CalendarOutlined,
  HomeOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const EMPTY = {
  nationalId: "",
  firstName: "",
  lastName: "",
  birthDate: null,
  address: "",
};

export default function SearchPanel({ onSearch, onClear }) {
  const [form] = Form.useForm();
  const [fields, setFields] = useState(EMPTY);

  const handleChange = (key, value) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch(fields);
  };

  const handleClear = () => {
    form.resetFields();
    setFields(EMPTY);
    onClear();
  };

  return (
    <Card
      style={{ marginBottom: 16 }}
      styles={{ body: { padding: "16px 20px 4px" } }}
      title={
        <Space>
          <FilterOutlined style={{ color: "#1677ff" }} />
          <span>ค้นหาข้อมูล</span>
        </Space>
      }
      extra={
        <Space>
          <Button icon={<ClearOutlined />} onClick={handleClear}>
            ล้างทั้งหมด
          </Button>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            ค้นหา
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Form.Item label="เลขบัตรประชาชน" name="nationalId" style={{ marginBottom: 16 }}>
              <Input
                prefix={<IdcardOutlined style={{ color: "#bbb" }} />}
                placeholder="เช่น 1234567890123"
                maxLength={13}
                value={fields.nationalId}
                onChange={(e) => handleChange("nationalId", e.target.value)}
                allowClear
                onClear={() => handleChange("nationalId", "")}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item label="ชื่อ" name="firstName" style={{ marginBottom: 16 }}>
              <Input
                prefix={<UserOutlined style={{ color: "#bbb" }} />}
                placeholder="ชื่อ"
                value={fields.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                allowClear
                onClear={() => handleChange("firstName", "")}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item label="นามสกุล" name="lastName" style={{ marginBottom: 16 }}>
              <Input
                prefix={<UserOutlined style={{ color: "#bbb" }} />}
                placeholder="นามสกุล"
                value={fields.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                allowClear
                onClear={() => handleChange("lastName", "")}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={5}>
            <Form.Item label="วัน เดือน ปีเกิด" name="birthDate" style={{ marginBottom: 16 }}>
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="เลือกวันเกิด"
                suffixIcon={<CalendarOutlined />}
                disabledDate={(d) => d && d.isAfter(dayjs())}
                value={fields.birthDate ? dayjs(fields.birthDate) : null}
                onChange={(d) => handleChange("birthDate", d ? d.format("YYYY-MM-DD") : null)}
                allowClear
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={16} lg={6}>
            <Form.Item label="ที่อยู่" name="address" style={{ marginBottom: 16 }}>
              <Input
                prefix={<HomeOutlined style={{ color: "#bbb" }} />}
                placeholder="ถนน / ตำบล / อำเภอ / จังหวัด"
                value={fields.address}
                onChange={(e) => handleChange("address", e.target.value)}
                allowClear
                onClear={() => handleChange("address", "")}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}