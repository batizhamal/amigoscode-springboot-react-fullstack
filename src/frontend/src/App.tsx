import "./App.css";

import React, { useState, useEffect } from "react";
import { StudentApi } from "./api/studentApi.ts";

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  LoadingOutlined,
  PlusOutlined
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, Table, Spin, Empty, theme, Button } from "antd";
import StudentDrawerForm from "./StudentDrawerForm.tsx";
const { Header, Content, Footer, Sider } = Layout;
type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Option 1", "1", <PieChartOutlined />),
  getItem("Option 2", "2", <DesktopOutlined />),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("Tom", "3"),
    getItem("Bill", "4"),
    getItem("Alex", "5"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
  },
];

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function App() {
  const [students, setStudents] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);


  const studentApi = new StudentApi();
  const fetchStudents = () =>
    studentApi.getAllStudents().then((data) => {
      setStudents(data);
      setFetching(false);
    });

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // I want to run getAllStudents() only when the component loads => useEffect
  useEffect(() => {
    (async () => {
      await fetchStudents();
    })();
  }, []);

  const renderStudents = () => {
    if (fetching) {
      return <Spin indicator={antIcon} />;
    }
    if (students.length <= 0) {
      return <Empty />;
    }
    return <>
      <StudentDrawerForm showDrawer={showDrawer} setShowDrawer={setShowDrawer}/>
      <Table
        dataSource={students}
        columns={columns}
        bordered
        title={() => 
          <Button onClick={() => {setShowDrawer(!showDrawer);}} type="primary" shape="round" icon={<PlusOutlined />} size="middle">
            Add a new student
          </Button>}
        pagination={{ pageSize: 50 }}
        scroll={{ y: 350 }}
        rowKey={(student) => student.id}
      />
    </>
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
          }}
        />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            {renderStudents()}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>This is a footer</Footer>
      </Layout>
    </Layout>
  );
}

export default App;
