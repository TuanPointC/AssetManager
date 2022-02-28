import { v4 as uuid } from "uuid";
import { Button, Modal, Form, Input, Select, DatePicker, Radio } from 'antd';
import { PostUser } from "../../../Api/UserApi";
import { useState } from "react";
import { success, failed } from "../../../Component/Message";
import moment from 'moment'
const { Option } = Select;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
    colon: false
};

const ModalAddingUser = (props) => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const validateMessages = {
        required: "${label} is required!",
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const calcAge = (date) => {
        var ageDifMs = Date.now() - date.getTime();
        var ageDate = new Date(ageDifMs);
        return (Math.abs(ageDate.getUTCFullYear() - 1970))
    }

    const onFinish = async (values) => {
        var dateOfBirth = new Date(values.user.dateOfBirth)
        var userCopy = { ...values.user, id: uuid(), 
            dateOfBirth: moment(dateOfBirth.setHours(dateOfBirth.getHours() + 7)),
            firstName:values.user.firstName.trim(),
            lastName:values.user.lastName.trim(),
        }
        var res = await PostUser(userCopy);
        if (res.status === 200) {
            setIsModalVisible(false);
            props.setPageTotal(prev => prev + 1)
            props.setUsers([{ ...res.data, fullName: res.data.lastName + ' ' + res.data.firstName }, ...props.users])
            await success("User Created")
            form.resetFields();
        }
        else {
            failed("Adding failed")
        }
    };

    return (
        <div>
            <Button danger type="primary" onClick={showModal}>Create New User</Button>
            <Modal title="Create new user" visible={isModalVisible} onCancel={handleCancel} footer={null} width={700}>
                <Form form={form} {...layout} onFinish={onFinish} validateMessages={validateMessages} >

                    <Form.Item name={['user', 'firstName']} label="First Name" rules={[
                        {
                            max: 50,
                            message: "First name should be less than 50 character",
                        },
                        () => ({
                            validator(_, value) {
                                if (value.trim() === "") {
                                    return Promise.reject('FirstName is required!')
                                }
                                return Promise.resolve()
                            }
                        })
                    ]} hasFeedback>
                        <Input onPaste={(e) => {
                            e.preventDefault()
                            return false;
                        }} onCopy={(e) => {
                            e.preventDefault()
                            return false
                        }} />
                    </Form.Item>
                    <Form.Item name={['user', 'lastName']} label="Last Name" rules={[
                        {
                            max: 50,
                            message: "Last name should be less than 50 character",
                        },
                        () => ({
                            validator(_, value) {
                                if (value.trim() === "") {
                                    return Promise.reject('LastName is required!')
                                }
                                return Promise.resolve()
                            }
                        })
                    ]} hasFeedback>
                        <Input onPaste={(e) => {
                            e.preventDefault()
                            return false;
                        }} onCopy={(e) => {
                            e.preventDefault()
                            return false
                        }} />
                    </Form.Item>

                    <Form.Item name={['user', 'dateOfBirth']}
                        label="Date Of Birth"
                        rules={[
                            { required: true },
                            () => ({
                                validator(_, value) {
                                    if (value) {
                                        if (calcAge(value.toDate()) < 18) {
                                            return Promise.reject('User is under 18. Please select a different date')
                                        }
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(null)
                                }
                            })
                        ]}
                        hasFeedback
                    >
                        <DatePicker />
                    </Form.Item>

                    <Form.Item name={['user', 'gender']} label="Gender" hasFeedback validateStatus="success" initialValue="female">
                        <Radio.Group >
                            <Radio value="female">Female</Radio>
                            <Radio value="male">Male</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name={['user', 'joinedDate']}
                        label="Joined Date"
                        dependencies={[['user', 'dateOfBirth']]}
                        rules={[
                            { required: true },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (value) {
                                        if (getFieldValue('user')['dateOfBirth'] && value < getFieldValue('user')['dateOfBirth']) {
                                            return Promise.reject('Joined date is not later than Date of Birth. Please select a different date')
                                        }
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(null)
                                }
                            }),
                            () => ({
                                validator(_, value) {
                                    if (value) {
                                        if (value.day() === 0 || value.day() === 6) {
                                            return Promise.reject('Joined date is Saturday or Sunday. Please select a different date')
                                        }
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(null)
                                }
                            }),
                            () => ({
                                validator(_, value) {
                                    if (value) {
                                        if (value > Date.now()) {
                                            return Promise.reject('Joined date must not be less current date')
                                        }
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(null)
                                }
                            })
                        ]}
                        hasFeedback
                    >
                        <DatePicker />
                    </Form.Item>

                    <Form.Item name={['user', 'type']} label="Type" rules={[{ required: true }]} hasFeedback>
                        <Select placeholder="Select Type">
                            <Option value="admin">Admin</Option>
                            <Option value="staff">Staff</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name={['user', 'location']} label="Location" rules={[{ required: true }]} hasFeedback>
                        <Select placeholder="Select Location">
                            <Option value="hanoi">Ha Noi</Option>
                            <Option value="danang">Da Nang</Option>
                            <Option value="hcm">HCM</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 15 }} shouldUpdate>
                        {() => (
                            <div style={{ display: 'flex' }}>
                                <Button
                                    danger
                                    type="primary"
                                    htmlType="submit"
                                    disabled={
                                        !form.isFieldsTouched(
                                            [['user', 'type'], ['user', 'firstName'],
                                            ['user', 'lastName'], ['user', 'dateOfBirth'],
                                            ['user', 'joinedDate'], ['user', 'location']],
                                            true) ||
                                        form.getFieldsError().filter(({ errors }) => errors.length)
                                            .length > 0
                                    }
                                >
                                    Save
                                </Button>
                                <Button style={{ marginLeft: '2rem' }} onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    )
}

export default ModalAddingUser