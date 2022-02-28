import { Modal } from 'antd';
import { PostReturningApi } from '../../../Api/ReturningApi';
import { failed, success } from '../../../Component/Message';
const ModalConfirmCreateReturning = (props) => {
    const onOk = async () => {
        var data ={
            assignmentId:props.rowWasEntered.assignmentId,
            state:props.rowWasEntered.state,
            requestBy:localStorage.getItem("userId")
        }
        var res = await PostReturningApi(data)
        if(res.status===200){
            await success("Create request returning")
            props.setVisible(false)
            var currentAssignment = {...props.rowWasEntered}
            currentAssignment.isReturning =true
            var listAssignment = props.assignments.filter(a=>a.assignmentId!==props.rowWasEntered.assignmentId)
            listAssignment.unshift(currentAssignment) 
            props.setAssignments([...listAssignment])
        }
        else{
            failed(res)
            props.setVisible(false)
            window.location.reload();
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
                <p>Do you want to create a returning request for this asset?</p>
            </Modal>
        </>
    )
}
export default ModalConfirmCreateReturning