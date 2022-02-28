import { Button, Modal, Descriptions } from 'antd';
const ModalDetailAsignment = (props) => {
    const handleCancel = () => {
        props.setVisible(false);
    };
    const stateRender = () => {
        if (props.assignments.state === 'unavailable') return <span>Not available</span>
        if (props.assignments.state === 'available') return <span>Available</span>
        if (props.assignments.state === 'waiting') return <span>Waiting for acceptance</span>
        if (props.assignments.state === 'accepted') return <span>Accepted</span>
        if (props.assignments.state === 'declined') return <span>Declined</span>
    }
    return (
        <div>
            <Modal title="Assignment Information" visible={props.visible} onCancel={handleCancel} footer={null} >
                {props.assignments !== null && (
                    <div>
                        <Descriptions bordered>
                            <Descriptions.Item label="Asset Code" span={3}>{props.assignments.asset.assetCode}</Descriptions.Item>
                            <Descriptions.Item label="Asset Name" span={3}>{props.assignments.asset.assetName}</Descriptions.Item>
                            <Descriptions.Item label="Assigned to" span={3}>{props.assignments.user.userName}</Descriptions.Item>
                            <Descriptions.Item label="Assigned by" span={3}>{props.assignments.admin.userName}</Descriptions.Item>
                            <Descriptions.Item label="Assigned Date" span={3}>{props.assignments.assignedDate.split("T")[0]}</Descriptions.Item>
                            <Descriptions.Item label="Note" span={3}>{props.assignments.note}</Descriptions.Item>
                            <Descriptions.Item label="State" span={3}> {
                                stateRender()
                            } </Descriptions.Item>
                        </Descriptions>
                        <Button type="secondary" onClick={handleCancel} style={{ marginTop: "1em" }}>
                            Close
                        </Button>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default ModalDetailAsignment