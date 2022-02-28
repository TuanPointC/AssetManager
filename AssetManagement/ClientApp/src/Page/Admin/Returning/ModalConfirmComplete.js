import { Modal } from 'antd';
import { PostCompleteAssignment } from '../../../Api/ReturningApi';
import { failed, success } from '../../../Component/Message';
const ModalConfirmComplete = (props) => {
    const onOk = async () => {
        var modelComplete ={
            id: props.rowWasEntered.requestId,
            adminId:localStorage.getItem("userId")
        }
        var res = await PostCompleteAssignment(modelComplete)
        if(res.status===200){
            success("Complete request returning")
            props.setVisible(false)
            var currentRequest ={...props.rowWasEntered}
            currentRequest.state = "completed"
            currentRequest.returnDate =new Date().toJSON()
            currentRequest.acceptByName = localStorage.getItem("userUserName")
            var listRequests = props.returnings.filter(r=>r.requestId!==props.rowWasEntered.requestId)
            listRequests.unshift(currentRequest)
            props.setReturnings([...listRequests])
        }
        else{
            failed(res)
            props.setVisible(false)
        }
    }
    return (
        <>
            <Modal
                title="Are you sure?"
                visible={props.visible}
                onCancel={() => props.setVisible(false)}
                width={700}
                onOk={onOk}
                okText="Yes"
                cancelText="No"
            >
                <p>Do you want to mark this returning request as 'Completed'?</p>
            </Modal>
        </>
    )
}
export default ModalConfirmComplete