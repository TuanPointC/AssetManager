import { Button, Modal,  Descriptions } from 'antd';


const ModalDetailUser = ({ user, visible, setVisible }) => {

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <div>
            <Modal title="User Info" visible={visible} onCancel={handleCancel} footer={null} >
                {user !== null && (
                    <div>
                        <Descriptions bordered>
                            <Descriptions.Item label="StaffCode" span={3}>{user.staffCode}</Descriptions.Item>
                            <Descriptions.Item label="Full Name" span={3}>{`${user.lastName} ${user.firstName}`}</Descriptions.Item>
                            <Descriptions.Item label="Username" span={3}>{user.userName}</Descriptions.Item>
                            <Descriptions.Item label="Date of Birth" span={3}>{user.dateOfBirth.split("T")[0]}</Descriptions.Item>
                            <Descriptions.Item label="Gender" span={3}>{user.gender}</Descriptions.Item>
                            <Descriptions.Item label="Type" span={3}>{user.type}</Descriptions.Item>
                            <Descriptions.Item label="Location" span={3}>{user.location}</Descriptions.Item>
                        </Descriptions>
                        <Button type="secondary" onClick={handleCancel} style={{marginTop: "1em"}}>
                            Close
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default ModalDetailUser