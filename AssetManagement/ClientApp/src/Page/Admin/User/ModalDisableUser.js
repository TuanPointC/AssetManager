import { Button, Modal } from 'antd';
import { DeleteUserById } from "../../../Api/UserApi";
import { success, failed } from "../../../Component/Message";
import { ExclamationCircleTwoTone } from '@ant-design/icons'

const ModalDisableUser = ({ user, setUser, valid, visible, setVisible, setIsDisabling }) => {
    const messages = {
        valid: "Do you want to disable this user?",
        inValid: "There are valid assignments belonging to this user. Please close all assignments before disabling user"
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const disableUser = async () => {
        const res = await DeleteUserById(user);
        if (res.data.result) {
            setVisible(false);
            setIsDisabling(false);
            setUser(null);
            await success("Disable user")
        }
        else {
            setVisible(false);
            failed("Disable user")
        }
    }

    return (
        <div>
            {valid ? (
                <Modal title="Disable User" visible={visible} onCancel={handleCancel} footer={[
                    <Button type="secondary" onClick={handleCancel}>
                        Close
                    </Button>
                ]} >
                    <div>
                        <p>
                            <ExclamationCircleTwoTone twoToneColor="#fff7ab" /> {messages.inValid}
                        </p>
                    </div>
                </Modal>
            ) : (
                <Modal title="Are you sure?" visible={visible} onCancel={handleCancel} footer={[
                    <Button danger onClick={disableUser} style={{ marginLeft: "1em", backgroundColor: "#ff5959", color: "#ffffff" }}>
                        Disable
                    </Button>,
                    <Button type="secondary" onClick={handleCancel} style={{ marginLeft: "1em" }}>
                        Cancel
                    </Button>
                ]} >
                    <div>
                        <p>
                            <ExclamationCircleTwoTone twoToneColor="#fff7ab" /> {messages.valid}
                        </p>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default ModalDisableUser