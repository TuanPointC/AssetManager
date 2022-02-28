import { Menu, Dropdown, Modal, Button, Form, Input } from 'antd';
import { useState, useEffect } from 'react';
import { success, failed } from './Message';
import { RemoveLocalStorage } from './LocalStoreageFunction';
import { DownOutlined } from '@ant-design/icons';
import { ChangePasswordApi } from '../Api/LoginApi';


const HeaderComponent = (props) => {
    const [user, setUser] = useState(null)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleLogout, setIsModalVisibleLogout] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsModalVisibleLogout(false)
    };

    const onFinish = async (values) => {
        var passwordParams = {
            id: localStorage.getItem("userId"),
            newPassword: values.password,
            oldPassword: values.oldPassword
        }

        if (values.password === values.re_password) {
            var res = await ChangePasswordApi(passwordParams)

            if (res.status === 200) {
                await success("Your password has been changed")
                setIsModalVisible(false);
                form.resetFields()
            }
            else failed(res)

        }
        else {
            failed("Re-password is not match password!")
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setUser(localStorage.getItem("userUserName"))
        }, 2000)
    })

    const menu = (
        <Menu>
            <Menu.Item key="0" onClick={() => setIsModalVisibleLogout(true)}>
                {!user ? 'Login' : 'Logout'}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1" onClick={() => { showModal() }}>
                Change Password
            </Menu.Item>
        </Menu>
    );

    const logEvent = async () => {
        if (!user) {
            window.location.href = window.location.href.split("/")[0] + '/login'
        }
        else {
            RemoveLocalStorage()
            await success("logout")
            props.setUserLogin(false)

        }
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', height: '60px' }}>
            <div style={{ flex: "1", fontWeight: 'bold', fontSize: '25px', color: 'white' }}>
                <img src={process.env.PUBLIC_URL+'/logo.png'} style={{width:'120px',display:'block'}}/>
            </div>
            <div>
                <Dropdown overlay={menu} trigger={['click']}>
                    <b className="ant-dropdown-link" style={{ color: 'white' }}>
                        Welcome {user} <DownOutlined />
                    </b>
                </Dropdown>
            </div>

            <Modal title="Are you sure?" visible={isModalVisibleLogout} onOk={logEvent} onCancel={handleCancel} okText="Logout">
                <p>Do you want to log out?</p>
            </Modal>

            <Modal width={700} title="Change Password" visible={isModalVisible} onCancel={handleCancel} footer={null}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Old Password"
                        name="oldPassword"
                        rules={[{ min: 8, message: 'Old Password must be at least 8 characters!' },
                        () => ({
                            validator(_, value) {
                                if (value.trim() === "") {
                                    return Promise.reject('Old Password is required!')
                                }
                                return Promise.resolve()
                            }
                        })
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="password"
                        rules={[{ min: 8, message: 'New Password must be at least 8 characters!' },
                        () => ({
                            validator(_, value) {
                                if (value.trim() === "") {
                                    return Promise.reject('New Password is required!')
                                }
                                return Promise.resolve()
                            }
                        }),
                        () => ({
                            validator(_, value) {
                                var oldPass = form.getFieldValue("oldPassword")
                                if (value === oldPass) {
                                    return Promise.reject('New password must be diffirent old password!')
                                }
                                return Promise.resolve()
                            }
                        })
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Re-enter New Password"
                        name="re_password"
                        rules={[{ min: 8, message: 'Re-enter New Password must be at least 8 characters!' },
                        () => ({
                            validator(_, value) {
                                if (value.trim() === "") {
                                    return Promise.reject('Re-enter New Password is required!')
                                }
                                return Promise.resolve()
                            }
                        }),
                        () => ({
                            validator(_, value) {
                                var pass = form.getFieldValue("password")
                                if (value !== pass) {
                                    return Promise.reject('Re-enter New Password is not match password!')
                                }
                                return Promise.resolve()
                            }
                        })
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 18, span: 16 }} shouldUpdate>
                        {() =>
                            <>
                                <Button danger type="primary" htmlType="submit" disabled={
                                    !form.isFieldsTouched(true) ||
                                    form.getFieldsError().filter(({ errors }) => errors.length)
                                        .length > 0
                                }>
                                    Save
                                </Button>
                                <Button htmlType="button" onClick={() => setIsModalVisible(false)} style={{ marginLeft: '10px' }}>
                                    Cancel
                                </Button>
                            </>
                        }

                    </Form.Item>
                </Form>
            </Modal>
        </div >
    )
}

export default HeaderComponent;