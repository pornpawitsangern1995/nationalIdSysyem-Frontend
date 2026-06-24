import { useEffect } from "react";
import {
  Modal, Form, Row, Col, Input, Button, Space,
  Divider, Descriptions, Tag, Typography, Card, DatePicker,
} from "antd";
import {
  IdcardOutlined, UserOutlined, CalendarOutlined,
  HomeOutlined, PhoneOutlined, TeamOutlined,
  EditOutlined, PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

// mode: "add" | "edit" | "detail"

const  calcAge = (birthDate) => {
  if (!birthDate) return "";
  return dayjs().diff(dayjs(birthDate), "year");
}

// Detail View 
function DetailView({ citizen, onEdit, onClose }) {
  return (
    <>
      <Card
        style={{ background: "#e6f4ff", border: "none", marginBottom: 16, textAlign: "center" }}
      >
        <Text
          style={{
            fontSize: 22, fontWeight: 700, letterSpacing: 3,
            color: "#0958d9", fontFamily: "monospace", display: "block",
          }}
        >
          {citizen.nationalId}
        </Text>
        <Text style={{ fontSize: 16 }}>
          {citizen.firstName} {citizen.lastName}
        </Text>
      </Card>

      <Descriptions column={1} bordered size="small" labelStyle={{ width: 160, background: "#fafafa" }}>
        <Descriptions.Item label={<><CalendarOutlined /> วันเกิด</>}>
          {citizen.birthDate ? dayjs(citizen.birthDate).format("DD/MM/YYYY") : "-"}
          {citizen.birthDate && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              อายุ {calcAge(citizen.birthDate)} ปี
            </Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label={<><HomeOutlined /> ที่อยู่</>}>
          {citizen.address || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="ตำบล/แขวง">{citizen.subDistrict || "-"}</Descriptions.Item>
        <Descriptions.Item label="อำเภอ/เขต">{citizen.district || "-"}</Descriptions.Item>
        <Descriptions.Item label="จังหวัด">
          {citizen.province ? <Tag color="geekblue">{citizen.province}</Tag> : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="รหัสไปรษณีย์">{citizen.postalCode || "-"}</Descriptions.Item>
        <Descriptions.Item label={<><PhoneOutlined /> โทรศัพท์</>}>
          {citizen.phoneNumber || "-"}
        </Descriptions.Item>
        <Descriptions.Item label={<><TeamOutlined /> บันทึกโดย</>}>
          {citizen.createdBy || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="วันที่บันทึก">
          {citizen.createdAt ? dayjs(citizen.createdAt).format("DD/MM/YYYY HH:mm") : "-"}
        </Descriptions.Item>
        <Descriptions.Item label="อัปเดตล่าสุด">
          {citizen.updatedAt ? dayjs(citizen.updatedAt).format("DD/MM/YYYY HH:mm") : "-"}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
        <Button onClick={onClose}>ปิด</Button>
        <Button type="primary" icon={<EditOutlined />} onClick={onEdit}>
          แก้ไขข้อมูล
        </Button>
      </div>
    </>
  );
}

// Add / Edit Form 
function CitizenForm({ mode, citizen, onSave, onClose, loading }) {
  const [form] = Form.useForm();
  const isEdit = mode === "edit";

  useEffect(() => {
    if (isEdit && citizen) {
      form.setFieldsValue({
        ...citizen,
        birthDate: citizen.birthDate ? dayjs(citizen.birthDate) : null,
      });
    } else {
      form.resetFields();
      form.setFieldValue("createdBy", "เจ้าหน้าที่");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, citizen, form]);

  const handleFinish = (values) => {
    onSave({
      ...values,
      birthDate: values.birthDate ? values.birthDate.format("YYYY-MM-DD") : null,
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish} style={{ marginTop: 4 }}>
      <Divider orientation="left" orientationMargin={0}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          <IdcardOutlined /> ข้อมูลบัตรประชาชน
        </Text>
      </Divider>

      <Form.Item
        label="เลขบัตรประชาชน 13 หลัก"
        name="nationalId"
        rules={[
          { required: true, message: "กรุณากรอกเลขบัตรประชาชน" },
          { len: 13, message: "ต้องมี 13 หลักพอดี" },
        ]}
      >
        <Input
          prefix={<IdcardOutlined />}
          placeholder="ตัวอย่าง: 1234567890123"
          maxLength={13}
          showCount
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="ชื่อ"
            name="firstName"
            rules={[{ required: true, message: "กรุณากรอกชื่อ" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="ชื่อ" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="นามสกุล"
            name="lastName"
            rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="นามสกุล" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="วันเกิด"
        name="birthDate"
        rules={[{ required: true, message: "กรุณาเลือกวันเกิด" }]}
      >
        <DatePicker
          style={{ width: "100%" }}
          format="DD/MM/YYYY"
          placeholder="เลือกวันเกิด"
          suffixIcon={<CalendarOutlined />}
          disabledDate={(d) => d && d.isAfter(dayjs())}
        />
      </Form.Item>

      <Divider orientation="left" orientationMargin={0}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          <HomeOutlined /> ข้อมูลที่อยู่
        </Text>
      </Divider>

      <Form.Item
        label="ที่อยู่ (บ้านเลขที่ ถนน)"
        name="address"
        rules={[{ required: true, message: "กรุณากรอกที่อยู่" }]}
      >
        <Input prefix={<HomeOutlined />} placeholder="บ้านเลขที่ ถนน หมู่บ้าน" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="จังหวัด" name="province">
            <Input placeholder="จังหวัด" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="อำเภอ/เขต" name="district">
            <Input placeholder="อำเภอ/เขต" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="ตำบล/แขวง" name="subDistrict">
            <Input placeholder="ตำบล/แขวง" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="รหัสไปรษณีย์" name="postalCode">
            <Input placeholder="รหัสไปรษณีย์" maxLength={5} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="เบอร์โทรศัพท์" name="phoneNumber">
        <Input prefix={<PhoneOutlined />} placeholder="ตัวอย่าง: 081-234-5678" />
      </Form.Item>

      <Form.Item label="เจ้าหน้าที่ผู้บันทึก" name="createdBy">
        <Input prefix={<TeamOutlined />} placeholder="ชื่อเจ้าหน้าที่" />
      </Form.Item>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
        <Button onClick={onClose}>ยกเลิก</Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          icon={isEdit ? <EditOutlined /> : <PlusOutlined />}
        >
          {isEdit ? "บันทึกการแก้ไข" : "บันทึกข้อมูล"}
        </Button>
      </div>
    </Form>
  );
}

// Modal mode
const TITLE = {
  add:    { icon: <PlusOutlined style={{ color: "#1677ff" }} />,  label: "เพิ่มข้อมูลประชาชนใหม่" },
  edit:   { icon: <EditOutlined style={{ color: "#faad14" }} />,  label: "แก้ไขข้อมูลประชาชน" },
  detail: { icon: <IdcardOutlined style={{ color: "#1677ff" }} />, label: "ข้อมูลประชาชน" },
};

export default function CitizenModal({ mode, citizen, open, onClose, onSave, onSwitchEdit, loading }) {
  if (!mode) return null;
  const { icon, label } = TITLE[mode];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={<Space>{icon}<span>{label}</span></Space>}
      footer={null}
      width={mode === "detail" ? 560 : 680}
      destroyOnClose
    >
      {mode === "detail" && citizen && (
        <DetailView citizen={citizen} onEdit={onSwitchEdit} onClose={onClose} />
      )}
      {(mode === "add" || mode === "edit") && (
        <CitizenForm
          mode={mode}
          citizen={citizen}
          onSave={onSave}
          onClose={onClose}
          loading={loading}
        />
      )}
    </Modal>
  );
}