import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Layout, Typography, Button, Table, Space, Tag,
  Tooltip, Popconfirm, message, ConfigProvider,
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  EyeOutlined, IdcardOutlined,
  PhoneOutlined, CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/th";
import locale from "antd/locale/th_TH";

import SearchPanel from "./components/SearchPanel";
import CitizenModal from "./components/CitizenModal";

dayjs.locale("th");

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const API = "http://localhost:5239/api/citizens";

const EMPTY_FILTER = {
  nationalId: "",
  firstName: "",
  lastName: "",
  birthDate: null,
  address: "",
};

export default function App() {
  const [allCitizens, setAllCitizens] = useState([]);
  const [filter, setFilter] = useState(EMPTY_FILTER);
  const [tableLoading, setTableLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // modal state: mode = "add" | "edit" | "detail" | null
  const [modalMode, setModalMode] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();

  const fetchAll = useCallback(async () => {
    setTableLoading(true);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error();
      setAllCitizens(await res.json());
    } catch {
      messageApi.error("ไม่สามารถเชื่อมต่อ API ได้");
    } finally {
      setTableLoading(false);
    }
  }, [messageApi]);

  useEffect(() => { 
    fetchAll(); 
  }, [fetchAll]);

  const filteredCitizens = useMemo(() => {
    return allCitizens.filter((c) => {
      const { nationalId, firstName, lastName, birthDate, address } = filter;
      if (nationalId && !c.nationalId?.includes(nationalId.trim())) return false;
      if (firstName && !c.firstName?.toLowerCase().includes(firstName.trim().toLowerCase())) return false;
      if (lastName && !c.lastName?.toLowerCase().includes(lastName.trim().toLowerCase())) return false;
      if (birthDate && dayjs(c.birthDate).format("YYYY-MM-DD") !== birthDate) return false;
      if (address) {
        const q = address.trim().toLowerCase();
        const match = [c.address, c.subDistrict, c.district, c.province]
          .some((f) => f?.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [allCitizens, filter]);

  const openModal = (mode, citizen = null) => {
    setModalMode(mode);
    setSelectedCitizen(citizen);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => { setModalMode(null); setSelectedCitizen(null); }, 200);
  };

  const switchToEdit = () => {
    setModalMode("edit");
  };

  const handleSave = async (payload) => {
    setFormLoading(true);
    try {
      const isEdit = modalMode === "edit";
      const method = isEdit ? "PUT" : "POST";
      const url    = isEdit ? `${API}/${selectedCitizen.id}` : API;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        messageApi.error("เลขบัตรประชาชนนี้มีอยู่แล้วในระบบ");
        return;
      }
      if (!res.ok) throw new Error();

      messageApi.success(isEdit ? "แก้ไขข้อมูลสำเร็จ" : "เพิ่มข้อมูลสำเร็จ");
      closeModal();
      fetchAll();
    } catch {
      messageApi.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      messageApi.success("ลบข้อมูลสำเร็จ");
      fetchAll();
    } catch {
      messageApi.error("ลบข้อมูลไม่สำเร็จ");
    }
  };

  const calcAge = (birthDate) => {
    if (!birthDate) return "";
    return dayjs().diff(dayjs(birthDate), "year");
  }

  // Table columns
  const columns = [
    {
      title: "ลำดับ",
      width: 52,
      align: "center",
      render: (_, __, i) => <Text type="secondary">{i + 1}</Text>,
    },
    {
      title: "เลขบัตรประชาชน",
      dataIndex: "nationalId",
      width: 180,
      render: (_, r) => (
        <Tag
          color="blue"
          style={{ fontFamily: "monospace", fontSize: 13, letterSpacing: 1, padding: "2px 10px" }}
        >
          {r.nationalId}
        </Tag>
      ),
      // render: (v) => (
      //   <Tag
      //     color="blue"
      //     style={{ fontFamily: "monospace", fontSize: 13, letterSpacing: 1, padding: "2px 10px" }}
      //   >
      //     {v}
      //   </Tag>
      // ),
    },
    {
      title: "ชื่อ-นามสกุล",
      width: 250,
      render: (_, r) => (
        <Space>
          {/* <UserOutlined style={{ color: "#1677ff" }} /> */}
          <Text strong>{r.firstName} {r.lastName}</Text>
        </Space>
      ),
    },
    {
      title: "วันเกิด",
      dataIndex: "birthDate",
      width: 150,
      render: (v) =>
        v ? (
          <Space direction="vertical" size={0}>
            <Space size={4}>
              <CalendarOutlined style={{ color: "#888", fontSize: 12 }} />
              <Text>{dayjs(v).format("DD/MM/YYYY")}</Text>
            </Space>
            <Text type="secondary" style={{ fontSize: 12 }}>
              อายุ {calcAge(v)} ปี
            </Text>
          </Space>
        ) : "-",
    },
    {
      title: "ที่อยู่",
      dataIndex: "province",
      width: 200,
      render: (_, r) => (
        <Space>
          <Text>{r.province}</Text>
        </Space>
      ),
      // render: (_, r) => (
      //   <Space>
      //     <Text>{r.address} {r.subDistrict} {r.district} {r.province} {r.postalCode}</Text>
      //   </Space>
      // ),
    },
    {
      title: "โทรศัพท์",
      dataIndex: "phoneNumber",
      width: 140,
      render: (v) =>
        v ? (
          <Space>
            <PhoneOutlined style={{ color: "#52c41a" }} />
            {v}
          </Space>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: "จัดการ",
      width: 130,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="ดูรายละเอียด">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => openModal("detail", record)}
            />
          </Tooltip>
          <Tooltip title="แก้ไข">
            <Button
              size="small"
              type="primary"
              ghost
              icon={<EditOutlined />}
              onClick={() => openModal("edit", record)}
            />
          </Tooltip>
          <Tooltip title="ลบ">
            <Popconfirm
              title="ยืนยันการลบ"
              description={`ต้องการลบข้อมูลของ "${record.firstName} ${record.lastName}" ใช่หรือไม่?`}
              onConfirm={() => handleDelete(record.id)}
              okText="ยืนยันลบ"
              cancelText="ยกเลิก"
              okButtonProps={{ danger: true }}
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  //console.log('filteredCitizens > ', filteredCitizens);

  // Render 
  return (
    <ConfigProvider locale={locale} theme={{ token: { fontFamily: "'Sarabun', sans-serif" } }}>
      {contextHolder}

      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            background: "linear-gradient(135deg, #1e3a8a, #1677ff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
          }}
        >
          <Space>
            <IdcardOutlined style={{ fontSize: 22, color: "#fff" }} />
            <div>
              <Title level={4} style={{ margin: 0, color: "#fff", lineHeight: 1.3 }}>
                ระบบบัตรประชาชน
              </Title>
            </div>
          </Space>
          <Button
            icon={<PlusOutlined />}
            onClick={() => openModal("add")}
            style={{ background: "#fff", color: "#1677ff", border: "none", fontWeight: 600 }}
          >
            เพิ่มข้อมูลใหม่
          </Button>
        </Header>

        <Content style={{ padding: "24px 28px", background: "#f0f4ff" }}>
          <SearchPanel
            onSearch={(f) => setFilter(f)}
            onClear={() => setFilter(EMPTY_FILTER)}
          />

          <Table
            rowKey="id"
            dataSource={filteredCitizens}
            columns={columns}
            loading={tableLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) =>
                `แสดง ${total} จาก ${allCitizens.length} รายการ`,
            }}
            locale={{
              emptyText: (
                <Space direction="vertical" style={{ padding: 32 }}>
                  <Text type="secondary" style={{ fontSize: 15 }}>
                    ไม่พบข้อมูล
                  </Text>
                </Space>
              ),
            }}
            scroll={{ x: 900 }}
            size="middle"
            style={{ background: "#fff", borderRadius: 8 }}
          />
        </Content>
      </Layout>

      <CitizenModal
        mode={modalMode}
        open={modalOpen}
        citizen={selectedCitizen}
        onClose={closeModal}
        onSave={handleSave}
        onSwitchEdit={switchToEdit}
        loading={formLoading}
      />
    </ConfigProvider>
  );
}