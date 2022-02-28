import { Modal } from 'antd';
import { PostChangeStateAssignment } from '../../../Api/AssignmnetApi';
import { failed, success } from '../../../Component/Message';
const ModalAcceptedAssignment = (props) => {
    const onOk = async () => {
        var res = await PostChangeStateAssignment({id:props.rowWasEntered.assignmentId,state:'accepted'})
        if (res.status === 200) {
            var currentAssignment = {...props.rowWasEntered}
            var newAssignment = props.assignments.filter(a => a.assignmentId !== props.rowWasEntered.assignmentId)
            currentAssignment.state = "accepted"
            newAssignment.unshift(currentAssignment)
            props.setAssignments([...newAssignment])
            success("Accept assignment")
            props.setVisible(false)
        }
        else {
            failed(res)
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
                okText="Accept"
            >
                <p>Do you want to accept this assignment?</p>
            </Modal>
        </>
    )
}
export default ModalAcceptedAssignment