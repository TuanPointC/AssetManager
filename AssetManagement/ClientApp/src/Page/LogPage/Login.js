import { Form, Input, Button } from 'antd';
import { Redirect } from 'react-router';
import { PostLogin } from '../../Api/LoginApi';
import { useState } from 'react'
import { success, failed } from '../../Component/Message';
import { SetLocalStoreageFunction } from '../../Component/LocalStoreageFunction';
import './Login.scss'

const Login = (props) => {
    const [canAccess, setCanAccess] = useState(false)

    const [form] = Form.useForm();
    const onFinish = async (values) => {
        try {
            const res = await PostLogin(values)
            if (res.status === 200) {
                props.setUserLogin(true)
                await SetLocalStoreageFunction(res)
                await success("login")

                if(!res.data.userLastLogin){
                    props.setIsFirstLogin(true)
                }
                setCanAccess(true)
            }
            else{
                failed("login failed! Username or password is incorrect. Please try again?")
            }
        }
        catch {
            failed("login failed! Username or password is incorrect. Please try again?")
        }
    };
    if (canAccess) {
        if (localStorage.getItem("userRole") === "admin") {
            return <Redirect to='/admin' />
        }
        else {
            return <Redirect to='/' />
        }
    }

    return (
        <div className="login">
            <h1 className="title">Login</h1>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 0, }}
                wrapperCol={{ span: 0, }}
                initialValues={{ remember: true, }}
                onFinish={onFinish}
                autoComplete="off"
                className="form"
            >
                <Form.Item
                    label="Username"
                    name="userName"
                    rules={[{ required: true, message: 'Please input your username!', }]}
                >
                    <Input onCopy={(e) => {
                        e.preventDefault()
                        return false
                    }} />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!', min: 8 }]}
                >
                    <Input.Password onCopy={(e) => {
                        e.preventDefault()
                        return false
                    }} />
                </Form.Item>

                <Form.Item
                    wrapperCol={{ offset: 19 }}
                    shouldUpdate
                >
                    {() => (
                        <Button
                            danger
                            type="primary"
                            htmlType="submit"
                            disabled={
                                !form.isFieldsTouched(true) ||
                                form.getFieldsError().filter(({ errors }) => errors.length)
                                    .length > 0
                            }
                        >
                            Log in
                        </Button>
                    )}
                </Form.Item>
            </Form>
        </div>
    )
}

export default Login;