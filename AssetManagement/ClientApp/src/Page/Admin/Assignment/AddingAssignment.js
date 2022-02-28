import { Button, Form, Input, DatePicker, Select } from 'antd'
import { useHistory,Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import ModalSearchUser from './ModalSearchUser';
import moment from 'moment'
import { useEffect, useState } from 'react';
import ModalSearchAsset from './ModalSearchAsset';
import { PostAssignment } from '../../../Api/AssignmnetApi';
import { failed, success } from '../../../Component/Message';
const AddingAssignment = (props) => {
    const [visibleUser, setVisibleUser] = useState(false)
    const [visibleAsset, setVisibleAsset] = useState(false)
    const [selectedUser, setSelectedUser] = useState({ lastName: '', firstName: '' })
    const [asset, setAsset] = useState({ assetName: '' })
    const [form] = Form.useForm()
    let history = useHistory();

    useEffect(() => {
        if (selectedUser.lastName.trim() !== '' && selectedUser.firstName.trim() !== '') {
            form.setFieldsValue({ user: selectedUser.lastName + ' ' + selectedUser.firstName });
        }
        if (asset !== undefined) {
            form.setFieldsValue({ asset: asset.assetName });
        }

    }, [selectedUser, asset,form])

    const onFinish = async (values) => {
        var ass = {
            assignmentId: uuid(),
            assignToId: selectedUser.id,
            assignById: localStorage.getItem("userId"),
            assetId: asset.id,
            assignedDate: values.assignedDate,
            state: 'waiting',
            note: values.note
        }
        var res = await PostAssignment(ass)
        if (res.status === 200) {
            ass.asset = asset
            ass.user = selectedUser
            ass.admin = { userName: localStorage.getItem("userUserName") }
            localStorage.setItem("newAssignment", JSON.stringify(ass))
            await success("Create new assignment")
            history.push("/admin/assignment")
        }
        else {
            failed(res)
        }
    };

    const onFinishFailed = (errorInfo) => {
        
    };

    const onSearchUser = (value) => {
        setVisibleUser(true)
    }

    const onSearchAsset = (value) => {
        setVisibleAsset(true)
    }
    return (
        <div>
            <h1 style={{ margin: '20px 0' }}>
                Create new assignment
            </h1>
            <Form
                name="basic"
                form={form}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                style={{ background: 'white', padding: '30px 10px' }}
                title="Create new assignment"
            >

                <Form.Item
                    label="User"
                    name="user"
                    required={true}
                    rules={[
                        () => ({
                            validator(_, value) {
                                if (value) {
                                    if (value.trim() === "") {
                                        return Promise.reject('User is required!')
                                    }
                                    return Promise.resolve()
                                }
                                return Promise.reject('User is required!')
                            }
                        })
                    ]}
                >
                    <Select onClick={onSearchUser} notFoundContent={<></>} listHeight={0} />

                </Form.Item>

                <ModalSearchUser
                    visible={visibleUser}
                    setVisible={setVisibleUser}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                />


                <Form.Item
                    label="Asset"
                    name="asset"
                    required={true}
                    rules={[
                        () => ({
                            validator(_, value) {
                                if (value) {
                                    if (value.trim() === "") {
                                        return Promise.reject('Asset is required!')
                                    }
                                    return Promise.resolve()
                                }
                                return Promise.reject('Asset is required!')
                            }
                        })
                    ]}
                >
                    <Select onClick={onSearchAsset} notFoundContent={<></>} listHeight={0} />
                </Form.Item>
                <ModalSearchAsset
                    visible={visibleAsset}
                    setVisible={setVisibleAsset}
                    asset={asset}
                    setAsset={setAsset}
                />


                <Form.Item name="assignedDate"
                    hasFeedback
                    initialValue={moment(Date.now())}
                    label="Assigned Date"
                    validateFirst={true}
                    rules={[
                        { required: true },
                        () => ({
                            validator(_, value) {
                                if (value) {
                                    if (new Date(value).getDate() < new Date().getDate()) {
                                        return Promise.reject('Installed date must be greater or equal current date')
                                    }
                                    return Promise.resolve()
                                }
                                return Promise.reject(null)
                            }
                        })
                    ]}

                >
                    <DatePicker />
                </Form.Item>

                <Form.Item
                    label="Note"
                    name="note"
                    initialValue={""}
                    rules={[
                        () => ({
                            validator(_, value) {
                                if (value) {
                                    if (value.length > 512) {
                                        return Promise.reject(' Note field with Max-length data <= 512 characters')
                                    }
                                    return Promise.resolve()
                                }
                                return Promise.resolve()
                            }
                        })
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 18, span: 12 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button style={{ marginLeft: '2rem' }}>
                        <Link to="../assignment">
                            Cancel
                        </Link>
                    </Button>
                </Form.Item>
            </Form>
        </div>

    )
}

export default AddingAssignment