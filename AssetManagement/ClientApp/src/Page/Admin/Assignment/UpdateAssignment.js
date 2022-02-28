import { Button, Form, Input, DatePicker, Select, Spin, Typography } from 'antd'
import { useHistory, Link } from "react-router-dom";
import { useParams } from 'react-router';
import ModalSearchUser from './ModalSearchUser';
import { GetAssignmentById, PutAssignment } from '../../../Api/AssignmnetApi'
import moment from 'moment'
import { useEffect, useState } from 'react';
import ModalSearchAsset from './ModalSearchAsset';
import { failed, success } from '../../../Component/Message';
const { Title } = Typography;
const UpdatingAssignment = () => {
    const [assignment, setAssignment] = useState(null)
    const [visibleUser, setVisibleUser] = useState(false)
    const [visibleAsset, setVisibleAsset] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [asset, setAsset] = useState(null)
    const [form] = Form.useForm()
    const { id } = useParams();
    let history = useHistory();


    useEffect(() => {
        async function getAssignment() {
            const assignmentResult = await GetAssignmentById(id)
            if (assignmentResult.state !== "waiting") {
                failed("Cannot access")
                history.push("/admin/assignment")
            }
            setAssignment(assignmentResult)
        }
        if (!assignment) {
            getAssignment()
        }
        if (selectedUser !== null) {
            form.setFieldsValue({ user: selectedUser.lastName + ' ' + selectedUser.firstName });
        }

        if (asset !== null) {
            form.setFieldsValue({ asset: asset.assetName });
        }

    }, [selectedUser, asset])


    const onFinish = async (values) => {
        var newAss = {
            assignmentId: assignment.assignmentId,
            assignToId: assignment.assignToId,
            assignById: assignment.assignById,
            assetId: assignment.assetId,
            note: values.note,
            assignedDate: moment(values.assignedDate),
            state: assignment.state
        }
        if (selectedUser !== null) {
            newAss.assignToId = selectedUser.id
        }
        if (asset !== null) {
            newAss.assetId = asset.id
        }

        var res = await PutAssignment(newAss)
        if (res.status === 200) {
            if (selectedUser !== null) {
                newAss.user = selectedUser
            }
            else {
                newAss.user = assignment.user
            }
            if (asset !== null) {
                newAss.asset = asset
            }
            else {
                newAss.asset = assignment.asset
            }
            newAss.admin = { userName: localStorage.getItem("userUserName") }
            localStorage.setItem("newAssignment", JSON.stringify(newAss))
            await success("Edit assignment")
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
    if (!assignment) {
        return <Spin size="large" style={{ position: 'absolute', top: '50%', left: '50%', translate: '-50%,-50%' }} />
    }
    return (
        <div>
            <Form
                name="basic"
                form={form}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                style={{ width: '700px', margin: '20px auto', padding: '3rem', background: 'white', borderRadius: '5px' }}
                title="Create new assignment"
            >
                <Title level={2} style={{ alignContent: 'center', marginBottom: '1em' }}>Edit Assignment</Title>

                <Form.Item
                    label="User"
                    name="user"
                    required={true}
                    initialValue={assignment.user.lastName + ' ' + assignment.user.firstName}
                    rules={[
                        () => ({
                            validator(_, value) {
                                if (value.trim() === "") {
                                    return Promise.reject('Name is required!')
                                }
                                return Promise.resolve()
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
                    form={form}
                />


                <Form.Item
                    label="Asset"
                    name="asset"
                    required={true}
                    initialValue={assignment.asset.assetName}
                    rules={[
                        () => ({
                            validator(_, value) {
                                if (value.trim() === "") {
                                    return Promise.reject('Asset is required!')
                                }
                                return Promise.resolve()
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
                    required={true}
                    hasFeedback
                    initialValue={moment(assignment.assignedDate)}
                    label="Assigned Date"
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
                    initialValue={assignment.note}
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

                <Form.Item wrapperCol={{ offset: 16, span: 12 }}>
                    <Button type="primary" htmlType="submit">
                        Save
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

export default UpdatingAssignment