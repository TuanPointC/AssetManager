import { GetUserById, PutUser } from "../../../Api/UserApi"
import { useState, useEffect } from "react"
import { Spin, Form, Button, Input, DatePicker, Select, Radio, Typography } from 'antd';
import { useParams, useHistory, Link } from "react-router-dom";
import { failed, success } from "../../../Component/Message";
import moment from "moment"

const { Title } = Typography;
const { Option } = Select;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 22 },
    colon: false,
    title: "Update user"
};

const UpdateUser = ({users, setUsers, setUsersView}) => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [user, setUser] = useState(null)
    let history = useHistory();

    const validateMessages = {
        required: "the field is required!",
        types: {
            email: 'email is not a valid email!',
        }
    };
    useEffect(() => {
        async function getUser() {
            var userClone = await GetUserById(id)
            setUser(userClone)
        }
        getUser()
    }, [id])

    const setUserLocal = (user) => {
        localStorage.setItem("userLocal",JSON.stringify(user));
    }    

    const onFinish = async (values) => {
        try {
            const res = await PutUser({
                dateOfBirth: values.user.dateOfBirth.add(7, 'hours'),
                joinedDate: values.user.joinedDate.add(7, 'hours'),
                ...values.user,
                Id: id
            })
            if (res.status === 200) {
                setUserLocal(res.data)            
                await success("Updating")
                history.push('/admin/user')
            }
        }
        catch {
            failed("Updating")
        }
    };

    const calcAge = (date) => {
        var ageDifMs = Date.now() - date.getTime();
        var ageDate = new Date(ageDifMs);
        return (Math.abs(ageDate.getUTCFullYear() - 1970))
    }

    if (!user) {
        return <Spin size="large" style={{ position: 'absolute', top: '50%', left: '50%', translate: '-50%,-50%' }} />
    }
    return (
        <div>

            <Form form={form} {...layout} onFinish={onFinish} validateMessages={validateMessages} style={{ width: '700px', margin: '20px auto', padding: '3rem', background: 'white', borderRadius: '5px' }}>
                <Title level={2} style={{ alignContent: 'center', marginBottom: '1em' }}>Edit user</Title>
                <Form.Item name={['user', 'staffCode']} label="Staff Code" initialValue={user.staffCode}>
                    <Input disabled />
                </Form.Item>

                <Form.Item name={['user', 'userName']} label="Username" initialValue={user.userName}>
                    <Input disabled />
                </Form.Item>

                <Form.Item name={['user', 'dateOfBirth']}
                    label="Date Of Birth"
                    rules={[
                        { required: true },
                        () => ({
                            validator(_, value) {
                                if (value) {
                                    if (calcAge(value.toDate()) < 18) {
                                        return Promise.reject('Age must be above 18')
                                    }
                                    return Promise.resolve()
                                }
                                return Promise.reject(null)
                            }
                        })
                    ]}
                    initialValue={moment(user.dateOfBirth)}
                >
                    <DatePicker/>
                </Form.Item>

                <Form.Item name={['user', 'joinedDate']}
                    label="Joined Date"
                    dependencies={[['user', 'dateOfBirth']]}
                    rules={[
                        { required: true },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (value) {
                                    if (getFieldValue('user')['dateOfBirth'] && value < getFieldValue('user')['dateOfBirth']) {
                                        return Promise.reject('Joined date must be after date of birth')
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
                                        return Promise.reject('Joined date must not be saturday or sunday')
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
                                        return Promise.reject('Joined date must be less current date')
                                    }
                                    return Promise.resolve()
                                }
                                return Promise.reject(null)
                            }
                        })
                    ]}
                    initialValue={moment(new Date(user.joinedDate))}
                >
                    <DatePicker/>
                </Form.Item>

                <Form.Item name={['user', 'gender']} label="Gender" rules={[{ required: true }]} initialValue={user.gender}>
                    <Radio.Group>
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name={['user', 'type']} label="Type" rules={[{ required: true }]} initialValue={user.type}>
                    <Select placeholder="Select Type">
                        <Option value="admin">Admin</Option>
                        <Option value="staff">Staff</Option>
                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 16 }} shouldUpdate>
                    {() => (
                        <div style={{ display: 'flex' }}>
                            <Button type="primary" danger disabled={
                                form.getFieldsError().filter(({ errors }) => errors.length)
                                    .length > 0
                            } htmlType="submit" style={{ marginRight: '2rem' }}>
                                Save
                            </Button>
                            <Button type="danger" style={{ marginRight: '2rem' }}>
                                <Link to="../user">
                                    Cancel
                                </Link>
                            </Button>
                        </div>
                    )}
                </Form.Item>

            </Form>
        </div>
    )
}

export default UpdateUser