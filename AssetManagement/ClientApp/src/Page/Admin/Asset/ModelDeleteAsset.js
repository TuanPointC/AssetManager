import { Modal } from 'antd';
import { useState } from 'react';
import {useHistory } from "react-router-dom";
import { DeleteAssetById } from '../../../Api/AssetApi';
import { failed, success } from '../../../Component/Message';
const ModalDeleteAsset = (props) => {
    const [isFailed,setIsFailed] = useState(false)
    let history = useHistory();
    const onOk = async () => {
        try {
            var res = await DeleteAssetById(props.rowWasEntered)
            if (res.status === 200) {
                var newAssets = props.assets.filter(a => a.id !== props.rowWasEntered)
                props.setAssets([...newAssets])
                success("Delete asset")
                props.setIsDeleteModalVisible(false)
            }
            else {
                if (res === "isAssigned") {
                    setIsFailed(true)
                }
                else {
                    failed(res)
                }
            }
        }
        catch (e) {
            failed(e)
        }
    }
    return (
        <>
            <Modal
                title="Are you sure?"
                visible={props.isDeleteModalVisible}
                onCancel={() => props.setIsDeleteModalVisible(false)}
                width={700}
                onOk={onOk}
            >
                <p>Do you want to delete this asset?</p>
            </Modal>

            <Modal
                title="Cannot Delete Asset"
                visible={isFailed}
                onCancel={() => setIsFailed(false)}
                width={700}
                footer={null}
            >
                <p>Cannot delete the asset because it belongs to one or more historical assignments. <br/>
                    If the asset is not able to be used anymore, please update its state in Edit. 
                    If the asset is not able to be used anymore, please update its state in 
                    <a onClick={()=>history.push(`/admin/asset/${props.rowWasEntered}`)}> Edit Asset page</a> "
                </p>
            </Modal>

        </>
    )
}
export default ModalDeleteAsset;