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
import { Avatar, Badge, MenuProps, Popconfirm } from "antd";
import { Breadcrumb, Layout, Menu, Table, Spin, Empty, theme, Button, Radio } from "antd";
import StudentDrawerForm from "./StudentDrawerForm.tsx";
import { openNotificationWithIcon } from "./Notification.ts";
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

const TheAvatar = ({name}) => {
  if (name.trim().length === 0) {
    return <Avatar icon={<UserOutlined/>}/>
  }
  const split = name.trim().split(' ');
  if (split.length === 1) {
    return <Avatar>{name.charAt(0)}</Avatar>
  }
  return <Avatar>`${name.charAt(0)}${name.charAt(name.length-1)}`</Avatar>
}

const columns = (fetchStudents) => {
  return [
    {
      title: '',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (text, student) => <TheAvatar name={student.name}/>
    },
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
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, student) => <>
        <Radio.Group>
          <Popconfirm
            placement="topRight"
            title={"Delete student"}
            description={`Are you sure you want to delete student with ID ${student.id}?`}
            onConfirm={() => {deleteStudent(student.id, fetchStudents)}}
            okText="Yes"
            cancelText="No"
          >
            <Radio.Button>Delete</Radio.Button>
          </Popconfirm>
          <Radio.Button>Edit</Radio.Button>
        </Radio.Group>
      </>,
    },
  ];
} 

const deleteStudent = (id: number, callback) => {
  const studentApi = new StudentApi();
  studentApi.deleteStudent(id).then(() => {
    openNotificationWithIcon('success', 'Student successfully deleted', `Student with an ID ${id} was deleted`);
    callback();
  }).catch(error => {
    openNotificationWithIcon('error', 'There was a problem', error.data.message);
  });;
}

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
    }).catch((error) => {
      console.log(error.data.message);
      openNotificationWithIcon('error', 'There was a problem', error.data.message);
    }).finally(() => {
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
      <StudentDrawerForm 
          showDrawer={showDrawer} 
          setShowDrawer={setShowDrawer}
          fetchStudents={fetchStudents}
      />
      <Table
        dataSource={students}
        columns={columns(fetchStudents)}
        bordered
        title={() => 
          <>
            <Button onClick={() => {setShowDrawer(!showDrawer);}} type="primary" shape="round" icon={<PlusOutlined />} size="middle">
              Add a new student
            </Button>
            <Badge
              className="site-badge-count-109"
              count={students.length}
              style={{ backgroundColor: '#52c41a' }}
            />
          </>
          }
        pagination={{ pageSize: 5 }}
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
