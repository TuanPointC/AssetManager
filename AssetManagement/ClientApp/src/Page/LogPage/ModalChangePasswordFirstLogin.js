import { Form, Input, Button, Modal } from 'antd';
import { ChangePasswordFirstLoginApi } from '../../Api/LoginApi';
import { success, failed } from '../../Component/Message';
const ModalChangePasswordFirstLogin = (props) => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        var passAndId = {
            id: localStorage.getItem("userId"),
            newPassword: values.password
        }

        if (values.password === values.re_password) {
            var res = await ChangePasswordFirstLoginApi(passAndId)
            if (res.status === 200) {
                localStorage.setItem("userLastLogin",Date.now())
                await success("Change password")
                props.setIsFirstLogin(false)
            }
            else {
                failed(res)
            }
        }
        else {
            failed("Re-enter New Password is not match password!")
        }
    }


    return (

        <Modal title="Change Password"  width={800} visible={props.isFirstLogin} footer={null} closable={false}>
            <p>This is the first time you logged in. You have to change your password to continue</p>
            <Form
                name="basic"
                form={form}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                autoComplete="off"
            >

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
                    })]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Re-enter New Password"
                    name="re_password"
                    rules={[{ min: 8, message: 'Re-ennter New Password must be at least 8 characters!' },
                    () => ({
                        validator(_, value) {
                            if (value.trim() === "") {
                                return Promise.reject('Re-enter New Passord is required!')
                            }
                            return Promise.resolve()
                        }
                    })
                        ,
                    () => ({
                        validator(_, value) {
                            var pass = form.getFieldValue("password")
                            if (value !== pass) {
                                return Promise.reject('Re-enter New Password is not match password!')
                            }
                            return Promise.resolve()
                        }
                    })]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }} shouldUpdate>
                    {() => <Button danger type="primary" htmlType="submit" disabled={
                        !form.isFieldsTouched(true) ||
                        form.getFieldsError().filter(({ errors }) => errors.length)
                            .length > 0
                    }>
                        Save
                    </Button>}
                    

                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalChangePasswordFirstLogin;