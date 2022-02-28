import { Button, Modal,  Descriptions } from 'antd';


const ModalDetailAsset = ({ asset, visible, setVisible }) => {

    const handleCancel = () => {
        setVisible(false);
    };

    return (
        <div>
            <Modal title="Asset Info" visible={visible} onCancel={handleCancel} footer={null} >
                {asset !== null && asset!==undefined && (
                    <div>
                        <Descriptions bordered>
                            <Descriptions.Item label="Name" span={3}>{asset.assetName}</Descriptions.Item>
                            <Descriptions.Item label="State" span={3}>{asset.state}</Descriptions.Item>
                            <Descriptions.Item label="Code" span={3}>{asset.assetCode}</Descriptions.Item>
                            <Descriptions.Item label="Category" span={3}>{asset.category.name}</Descriptions.Item>
                            <Descriptions.Item label="Location" span={3}>{asset.location}</Descriptions.Item>
                            <Descriptions.Item label="Specification" span={3}>{asset.specification}</Descriptions.Item>
                            <Descriptions.Item label="Installed Date" span={3}>{asset.installedDate.split("T")[0]}</Descriptions.Item>
                            
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

export default ModalDetailAsset