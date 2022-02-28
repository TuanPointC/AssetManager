import { Modal } from 'antd';
import { DeleteReturningId } from '../../../Api/ReturningApi';
import { failed, success } from '../../../Component/Message';
const ModalConfirmDelete = (props) => {
    const onOk = async () => {
        var res = await DeleteReturningId(props.rowWasEntered.requestId)
        if (res.status === 200) {
            var newReturning = props.returnings.filter(a => a.requestId !== props.rowWasEntered.requestId)
            props.setReturnings([...newReturning])
            success("Cancel Request for returning")
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
                <p>Do you want to canceling this request for returning?</p>
            </Modal>

        </>
    )
}
export default ModalConfirmDelete;