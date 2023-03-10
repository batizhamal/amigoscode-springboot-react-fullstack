import {Drawer, Input, Col, Select, Form, Row, Button, Spin} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { StudentApi } from './api/studentApi.ts';
import { openNotificationWithIcon } from './Notification.ts';

const {Option} = Select;

function StudentDrawerForm({showDrawer, setShowDrawer, fetchStudents}) {
    const studenApi = new StudentApi();
    const [submitting, setSubmitting] = useState(false);
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    const onCLose = () => setShowDrawer(false);

    const onFinish = student => {
        setSubmitting(true);
        studenApi.addNewStudent(student)
            .then(()=> {
                console.log('student added');
                onCLose();
                fetchStudents();
                openNotificationWithIcon(
                    'success', 
                    'Student successfully added',
                    `${student.name} was added to the system.`
                );
            })
            .catch(error => {
                openNotificationWithIcon('error', 'There was a problem', error.data.message, "bottomLeft");
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const onFinishFailed = errorInfo => {
        alert(JSON.stringify(errorInfo, null, 2));
    };

    return <Drawer
        title="Create new student"
        width={720}
        onClose={onCLose}
        open={showDrawer}
        bodyStyle={{paddingBottom: 80}}
        footer={
            <div
                style={{
                    textAlign: 'right',
                }}
            >
                <Button onClick={onCLose} style={{marginRight: 8}}>
                    Cancel
                </Button>
            </div>
        }
    >
        <Form layout="vertical"
              onFinishFailed={onFinishFailed}
              onFinish={onFinish}
              >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{required: true, message: 'Please enter student name'}]}
                    >
                        <Input placeholder="Please enter student name"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{required: true, message: 'Please enter student email'}]}
                    >
                        <Input placeholder="Please enter student email"/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{required: true, message: 'Please select a gender'}]}
                    >
                        <Select placeholder="Please select a gender">
                            <Option value="MALE">MALE</Option>
                            <Option value="FEMALE">FEMALE</Option>
                            <Option value="OTHER">OTHER</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                {submitting && <Spin indicator={antIcon} />}
            </Row>
        </Form>
    </Drawer>
}

export default StudentDrawerForm;