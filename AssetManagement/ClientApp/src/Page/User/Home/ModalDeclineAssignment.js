import { Modal } from 'antd';
import { PostChangeStateAssignment } from '../../../Api/AssignmnetApi';
import { failed, success } from '../../../Component/Message';
const ModalDeclineAssignment = (props) => {
    const onOk = async () => {
        var res = await PostChangeStateAssignment({id:props.rowWasEntered.assignmentId,state:'declined'})
        if (res.status === 200) {
            var newAssignment = props.assignments.filter(a => a.assignmentId !== props.rowWasEntered.assignmentId)
            props.setAssignments([...newAssignment])
            success("Delete assignment")
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
                okText="Decline"
            >
                <p>Do you want to decline this assignment?</p>
            </Modal>
        </>
    )
}
export default ModalDeclineAssignment