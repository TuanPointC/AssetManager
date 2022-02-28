import { v4 as uuid } from "uuid";
import { Button, Modal, Form, Input, Select, DatePicker, Divider, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PostAsset } from "../../../Api/AssetApi";
import { useState, useEffect } from "react";
import { success, failed } from "../../../Component/Message";
import { PostCategory, GetCategories } from "../../../Api/CategoryApi";
const { Option } = Select;
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 24 },
    colon: false
};

const ModalAddingUser = (props) => {
    const [form] = Form.useForm();
    const [formCategory] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [categories, setCategories] = useState([])
    const [nameCategory, setNameCategory] = useState("")
    const [prefixCategory, setPrefixCategory] = useState("")

    const validateMessages = {
        required: "the field is required!",
    };

    useEffect(() => {
        const getCate = async () => {
            var listCate = await GetCategories()
            setCategories(listCate.data);
        }
        getCate()
    }, [])

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const onFinish = async (values) => {
        var cate = categories.find(c => c.id === values.asset.category)
        var assetCopy = { ...values.asset, id: uuid(), category: cate, location: localStorage.getItem("userLocation") }
        var res = await PostAsset(assetCopy);
        if (res.status === 200) {
            setIsModalVisible(false);
            props.setAssets([res.data, ...props.assets])
            await success("Adding asset")
            form.resetFields();
        }
        else {
            failed("Adding failed")
        }
    };

    const onNameChange = event => {

        setNameCategory(event.target.value)
    };
    const onPrefixChange = event => {
        setPrefixCategory(event.target.value.toUpperCase())
    };

    const addCategory = async () => {
        var newCategory = {
            id: uuid(),
            name: nameCategory,
            prefix: prefixCategory
        }
        var listCategories = [...categories]
        var res = await PostCategory(newCategory)
        if (res.status === 200) {
            success("Add category")
            listCategories.push(newCategory)
            setCategories([...listCategories])
        }
        else {
            failed("Add category")
        }

    };

    return (
        <div>
            <Button danger type="primary" onClick={showModal}>Create new asset </Button>
            <Modal title="Create new Asset" visible={isModalVisible} onCancel={handleCancel} footer={null} width={700}>
                <Form form={form} {...layout} onFinish={onFinish} validateMessages={validateMessages}>

                    <Form.Item name={['asset', 'assetName']} label="Name" rules={[
                        () => ({
                            validator(_, value) {
                                if (value.trim() === "") {
                                    return Promise.reject('Name is required!')
                                }
                                return Promise.resolve()
                            }
                        }),
                        {
                            max: 50,
                            message: "Asset name should be less than 50 character",
                        },
                    ]} hasFeedback>
                        <Input  />
                    </Form.Item>

                    <Form.Item name={['asset', 'category']} label="Category" rules={[{ required: true }]} hasFeedback>
                        <Select
                            listHeight={150}
                            style={{ width: '60%' }}
                            placeholder="Category"
                            dropdownRender={menu => (
                                <div>
                                    {menu}
                                    <Divider />
                                    <Form
                                        form={formCategory}
                                        name="basic"
                                        style={{ margin: '0 10px 10px' }}
                                        wrapperCol={{ span: 24 }}
                                        onFinish={addCategory}
                                        autoComplete="off"
                                    >
                                        <Form.Item
                                            size="small"
                                            style={{ marginBottom: '5px' }}
                                            name="name"
                                            rules={[
                                                {
                                                    max: 50,
                                                    message: "First name should be less than 50 character",
                                                },
                                                () => ({
                                                    validator(_, value) {
                                                        var isCorrect = true
                                                        for (var i = 0; i < categories.length; i++) {
                                                            if (categories[i].name === value) {
                                                                isCorrect = false
                                                                break
                                                            }
                                                        }
                                                        if (!isCorrect) {
                                                            return Promise.reject('Category is already existed. Please enter a different category')
                                                        }
                                                        return Promise.resolve()
                                                    }
                                                }),
                                                () => ({
                                                    validator(_, value) {
                                                        if (value.trim() === "") {
                                                            return Promise.reject('Name is required!')
                                                        }
                                                        return Promise.resolve()
                                                    }
                                                }),

                                            ]}
                                            hasFeedback
                                        >
                                            <Input onChange={onNameChange} placeholder="Name of new category" />
                                        </Form.Item>

                                        <Form.Item
                                            name="prefix"
                                            rules={[{min: 2 },
                                            () => ({
                                                validator(_, value) {
                                                    var isCorrect = true
                                                    for (var i = 0; i < categories.length; i++) {
                                                        if (categories[i].prefix === value) {
                                                            isCorrect = false
                                                            break
                                                        }
                                                    }
                                                    if (!isCorrect) {
                                                        return Promise.reject('Prefix  ategory is already existed. Please enter a different prefix')
                                                    }
                                                    return Promise.resolve()
                                                }
                                            }),
                                            () => ({
                                                validator(_, value) {
                                                    if (value.trim() === "") {
                                                        return Promise.reject('Prefix  is required!')
                                                    }
                                                    return Promise.resolve()
                                                }
                                            }),
                                            () => ({
                                                validator(_, value) {
                                                    if (!value.match(/^[a-zA-Z]+$/)) {
                                                        return Promise.reject('Prefix  is only alphabet!')
                                                    }
                                                    return Promise.resolve()
                                                }
                                            }),
                                            ]}
                                            onChange={onPrefixChange}
                                            hasFeedback
                                        >
                                            <Input placeholder="Prefix" maxLength={2} style={{ textTransform: 'uppercase' }} />
                                        </Form.Item>

                                        <Form.Item shouldUpdate>
                                            {() => (
                                                <Button type="primary" htmlType="submit" disabled={
                                                    !formCategory.isFieldsTouched(true) ||
                                                    formCategory.getFieldsError().filter(({ errors }) => errors.length)
                                                        .length > 0
                                                }>
                                                    Add
                                                </Button>
                                            )}
                                        </Form.Item>
                                    </Form>
                                </div>
                            )}
                        >
                            {categories.map(item => (
                                <Option key={item.id}>Prefix: {item.prefix} - Category: {item.name}  </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name={['asset', 'specification']} label="Specification" rules={[
                        () => ({
                            validator(_, value) {
                                if (value.trim() === "") {
                                    return Promise.reject('Specification is required!')
                                }
                                return Promise.resolve()
                            }
                        }),
                        {
                            max: 255,
                            message: "Specification should be less than 255 character",
                        },
                    ]} hasFeedback>
                        <Input/>
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
                    >
                        <DatePicker />
                    </Form.Item>

                    <Form.Item name={['asset', 'state']} label="State" hasFeedback validateStatus="success" initialValue="available">
                        <Radio.Group>
                            <Radio value="available">Available</Radio>
                            <Radio value="unavailable">Unavailable</Radio>
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
                                        !form.isFieldsTouched(
                                            [['asset', 'assetName'], ['asset', 'category'],
                                            ['asset', 'specification'], ['asset', 'installedDate']],
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