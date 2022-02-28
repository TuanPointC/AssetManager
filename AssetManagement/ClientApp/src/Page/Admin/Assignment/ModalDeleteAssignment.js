import { Modal } from 'antd';
import { useState } from 'react';
import { DeleteAssignmentId } from '../../../Api/AssignmnetApi';
import { failed, success } from '../../../Component/Message';
const ModalDeleteAssignment = (props) => {
    const onOk = async () => {
        var res = await DeleteAssignmentId(props.rowWasEntered)
        if (res.status === 200) {
            var newAssignments = props.assignments.filter(a => a.assignmentId !== props.rowWasEntered)
            props.setAssignments([...newAssignments])
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
            >
                <p>Do you want to delete this assignment?</p>
            </Modal>

        </>
    )
}
export default ModalDeleteAssignment;