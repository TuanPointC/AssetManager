import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spin, Form, Button, Radio, Input, DatePicker, Select, Typography } from "antd";
import { GetAssetById } from "../../../Api/AssetApi";
import { PutAsset } from "../../../Api/AssetApi";
import { failed, success } from "../../../Component/Message";
import moment from "moment"
const { Title } = Typography;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 22 },
    colon: false,
    title: "Update asset"
};
const UpdateAsset = () => {
    const [asset, setAsset] = useState(null)
    const { id } = useParams();
    const [form] = Form.useForm();
    let history = useHistory();

    useEffect(() => {
        async function getAsset() {
            var res = await GetAssetById(id)
            setAsset({ ...res })
        }
        getAsset()
    }, [id])

    const handleCancel = () => {
        form.resetFields();
        history.push('/admin/asset')
    };

    const validateMessages = {
        required: "the field is required!",
    };

    const onFinish = async (values) => {
        try {
            var res = await PutAsset({ ...values.asset, id: asset.id, category: null })
            if (res.status === 200) {
                localStorage.setItem("editedAsset", JSON.stringify({ ...values.asset, assetCode: asset.assetCode, id: asset.id, category: { name: values.asset.category }, location: localStorage.getItem("userLocation") }))
                await success("Updating Asset")
                history.push('/admin/asset')
            }
            else {
                failed(res)
            }
        }
        catch {
            failed("Updating Asset")
        }

    };
    if (!asset) {
        return <Spin size="large" style={{ position: 'absolute', top: '50%', left: '50%', translate: '-50%,-50%' }} />
    }
    return (
        <div>
            <Form
                form={form} {...layout}
                onFinish={onFinish}
                validateMessages={validateMessages}
                style={{ width: '700px', margin: '20px auto', padding: '3rem', background: 'white', borderRadius: '5px' }}
            >
                <Title level={2} style={{ alignContent: 'center', marginBottom: '1em' }}>Edit Asset</Title>

                <Form.Item
                    name={['asset', 'assetName']}
                    label="Asset Name" rules={[
                        { required: true },
                        {
                            max: 50,
                            message: "Asset name should be less than 50 character",
                        },
                    ]}
                    hasFeedback
                    initialValue={asset.assetName}
                >
                    <Input onPaste={(e) => {
                        e.preventDefault()
                        return false;
                    }} onCopy={(e) => {
                        e.preventDefault()
                        return false
                    }} />
                </Form.Item>
                <Form.Item name={['asset', 'category']} label="Category" rules={[{ required: true }]} hasFeedback initialValue={asset.category.name}>
                    <Select
                        style={{ width: '60%' }}
                        disabled

                    >
                    </Select>
                </Form.Item>


                <Form.Item name={['asset', 'specification']} label="Specification" rules={[
                    { required: true },
                    {
                        max: 255,
                        message: "Specification should be less than 255 character",
                    },
                ]} hasFeedback
                    initialValue={asset.specification}
                >
                    <Input onPaste={(e) => {
                        e.preventDefault()
                        return false;
                    }} onCopy={(e) => {
                        e.preventDefault()
                        return false
                    }} />
                </Form.Item>

                <Form.Item name={['asset', 'installedDate']}
                    label="Installed Date"
                    rules={[
                        { required: true },
                        () => ({
                            validator(_, value) {
                                if (value) {
                                    if (value > Date.now()) {
                                        return Promise.reject('Installed date must be less current date')
                                    }
                                    return Promise.resolve()
                                }
                                return Promise.reject(null)
                            }
                        })
                    ]}
                    hasFeedback
                    initialValue={moment(new Date(asset.installedDate))}
                >
                    <DatePicker />
                </Form.Item>


                <Form.Item name={['asset', 'state']} label="State" rules={[{ required: true }]} hasFeedback initialValue={asset.state}>
                    <Radio.Group>
                        <Radio value="available">Available</Radio>
                        <Radio value="unavailable">Not available</Radio>
                        <Radio value="waiting">Waiting for recycling</Radio>
                        <Radio value="recycled">Recycled</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 15 }} shouldUpdate>
                    {() => (
                        <div style={{ display: 'flex' }}>
                            <Button
                                danger
                                type="primary"
                                htmlType="submit"
                                disabled={
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
        </div>
    )
}

export default UpdateAsset;