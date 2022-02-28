import { Modal, Table, Input } from 'antd';
import { useState, useEffect } from 'react';
import { GetUsers } from "../../../Api/UserApi";
import "./ModalSearchUser.scss"

const ModalSearchUser = (props) => {
    const [users, setUsers] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const [pageParams, setPageParams] = useState({ pageSize: 5, pageNumber: 1, searchName: props.searchName,locationUser: localStorage.getItem("userLocation") })
    const [pageTotal, setPageTotal] = useState(0)
    const [selectedRow, setSelectedRow] = useState(null)

    useEffect(() => {
        async function getUser() {
            setisLoading(true)
            const userResult = await GetUsers({ ...pageParams })
            if (userResult.data.listUsers !== null && userResult.data.listUsers !== undefined)
                if (userResult.data.listUsers.length > 0) {
                    setisLoading(false)
                    var newUsers = userResult.data.listUsers.map(u => {
                        return { ...u, fullName: u.lastName + ' ' + u.firstName }
                    })
                    setUsers([...newUsers])
                    setPageTotal(userResult.data.count)

                }
                else {
                    setisLoading(false)
                    setUsers([])
                    setPageTotal(0)
                }
        }
        getUser()
    }, [pageParams, props.visible]);

    const handleOk = () => {
        if (selectedRow) {
            props.setSelectedUser({ ...selectedRow })
        }
        props.setVisible(false);
    };

    const handleCancel = () => {
        props.setVisible(false);
    };

    const columns = [
        {
            title: 'Staff code',
            dataIndex: 'staffCode',
            sorter: (a, b) => a.staffCode.localeCompare(b.staffCode),
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            sorter: (a, b) => a.type.localeCompare(b.type),
        },
    ];
    const changePage = (pageNumber, pageSize) => {
        setPageParams({ ...pageParams, pageSize: pageSize, pageNumber: pageNumber, })
    }
    const searchName = (value) => {
        setPageParams({ ...pageParams, searchName: value })
    }
    const title = () => {
        return (
            <div style={{ display: 'flex', width: '90%', justifyContent: 'space-between' }}>
                <h3 style={{ color: 'white' }}>Select User</h3>
                <Input.Search placeholder="input search text" style={{ width: '30%' }} onSearch={searchName} defaultValue={props.searchName} />
            </div>
        )
    }

    const rowSelection = {
        onChange: (_, selectedRows) => {
            setSelectedRow(selectedRows[0])
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };
    return (
        <Modal
            title={title()}
            visible={props.visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1200}
            bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }}
            okButtonProps={{ disabled:!selectedRow }}
        >

            <Table
                columns={columns}
                loading={isLoading}
                dataSource={users}
                bordered style={{ margin: '20px 0' }}
                rowKey="id"
                rowSelection={{
                    type: 'radio',
                    ...rowSelection,
                }}
                pagination={{ total: pageTotal, showSizeChanger: true, defaultCurrent: 1, defaultPageSize: 5, pageSizeOptions: [5, 10, 50], current: pageParams.pageNumber, pageSize: pageParams.pageSize, onChange: changePage }}
            />
        </Modal>

    )
}

export default ModalSearchUser