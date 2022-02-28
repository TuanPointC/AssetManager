import { useState, useEffect } from "react";
import { Spin, Table, Button, Space } from 'antd';
import { CloseCircleTwoTone, ReloadOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import { GetAssignments } from "../../../Api/AssignmnetApi";
import ModalDetailAsignment from "../../Admin/Assignment/ModalDetailAssignment";
import ModalAcceptedAssignment from "./ModalAcceptedAssignment";
import ModalDeclineAssignment from "./ModalDeclineAssignment";
import ModalConfirmCreateReturning from "./ModalConfirmCreateReturning";

const Home = () => {
    const [assignments, setAssignments] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const [isCreateReturning, setIsCreateReturning] = useState(false);
    const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false)
    const [isDeclineModalVisible, setIsDeclineModalVisible] = useState(false)

    const [rowWasEntered, setRowWasEntered] = useState(null)
    const [isDetailModalVisible, setIsDetaiModalVisible] = useState(false)

    const [search] = useState(null)
    const [loading, setLoading] = useState(false)

    // page params
    const [pageParams, setPageParams] = useState({ pageSize: 5, pageNumber: 1, searchName: null, filterTypeUser: null })
    const [pageTotal, setPageTotal] = useState(0)

    useEffect(() => {
        async function getAssignment() {
            setLoading(true)
            await GetAssignments({ ...pageParams, filterUserId: localStorage.getItem("userId") })
                .then(assignmentsResult => {
                    setLoading(false)
                    assignmentsResult.data.listAssignments = assignmentsResult.data.listAssignments.filter(x => x.state !== 'declined')
                    setAssignments([...assignmentsResult.data.listAssignments])
                    setPageTotal(assignmentsResult.data.count)
                    setisLoading(false);
                })
                .catch(err => {
                    setLoading(false)
                    setAssignments([])
                    setPageTotal(0)
                    setisLoading(false);
                })

        }
        getAssignment()
    }, [pageParams]);


    const changePage = (pageNumber, pageSize) => {
        setPageParams({ ...pageParams, pageSize: pageSize, pageNumber: pageNumber, searchName: search, filterTypeUser: pageParams.filterTypeUser })
    }

    const acceptedEvent = (e) => {
        setIsAcceptModalVisible(true)
        e.stopPropagation()
    }
    const declineEvent = (e) => {
        setIsDeclineModalVisible(true)
        e.stopPropagation()
    }
    const returningEvent = (e) => {
        setIsCreateReturning(true)
        e.stopPropagation()
    }
    const columns = [
        {
            title: 'No',
            render(_, record, index) {
                return (
                    <div>
                        {index + 1 + (pageParams.pageNumber - 1) * pageParams.pageSize}
                    </div>
                );
            }
        },
        {
            title: 'Asset code',
            dataIndex: ['asset', 'assetCode'],
            sorter: (a, b) => a.asset.assetCode.localeCompare(b.asset.assetCode),
        },
        {
            title: 'Asset name',
            dataIndex: ['asset', 'assetName'],
            sorter: (a, b) => a.asset.assetName.localeCompare(b.asset.assetName),
        },
        {
            title: 'Assigned by',
            dataIndex: ['admin', 'userName'],
            sorter: (a, b) => a.admin.userName.localeCompare(b.admin.userName),
        },
        {
            title: 'Assigned date',
            dataIndex: 'assignedDate',
            render: (assignedDate) => (
                <div>{assignedDate.split('T')[0]}</div>
            ),
            sorter: (a, b) => a.assignedDate > b.assignedDate,
        },
        {
            title: 'State',
            dataIndex: 'state',
            sorter: (a, b) => a.state.localeCompare(b.state),
            render: (state) => {
                if (state === 'accepted') return 'Accepted'
                if (state === 'declined') return 'Declined'
                if (state === 'waiting') return 'Waiting for acceptance'
            }

        },
        {
            title: "Actions",
            width: '10%',
            size: "large",
            render: (data, _, _1) => (
                <Space size="large">
                    <Button
                        style={{ border: 'none', }}
                        shape="circle"
                        disabled={data.state !== 'waiting'}
                        icon={<CheckCircleTwoTone twoToneColor="#52c41a"
                            style={{ fontSize: '1.5em' }} />}
                        onClick={acceptedEvent}

                    >
                    </Button>
                    <Button
                        style={{ border: 'none', }}
                        disabled={data.state !== 'waiting'}
                        shape="circle"
                        icon={<CloseCircleTwoTone twoToneColor="#ff5454"
                            style={{ fontSize: '1.5em' }} />}
                        onClick={declineEvent}
                    >
                    </Button>

                    <Button
                        style={{ border: 'none', }}
                        shape="circle"
                        disabled={data.state !== 'accepted'}
                        icon={<ReloadOutlined
                            style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'blue' }} />}
                        onClick={returningEvent}
                    >

                    </Button>

                </Space>
            )

        }
    ];

    if (isLoading) {
        return <Spin size="large" style={{ position: 'absolute', top: '50%', left: '50%', translate: '-50%,-50%' }} />
    }
    return (
        <div>

            <ModalDetailAsignment
                assignments={rowWasEntered}
                visible={isDetailModalVisible}
                setVisible={setIsDetaiModalVisible}
            />
            <ModalAcceptedAssignment
                assignments={assignments}
                setAssignments={setAssignments}
                visible={isAcceptModalVisible}
                setVisible={setIsAcceptModalVisible}
                rowWasEntered={rowWasEntered}
            />
            <ModalDeclineAssignment
                assignments={assignments}
                setAssignments={setAssignments}
                visible={isDeclineModalVisible}
                setVisible={setIsDeclineModalVisible}
                rowWasEntered={rowWasEntered}
            />
            <ModalConfirmCreateReturning
                visible={isCreateReturning}
                setVisible={setIsCreateReturning}
                rowWasEntered={rowWasEntered}
            />
            <Table
                columns={columns}
                loading={loading}
                dataSource={assignments}
                scroll={{ x: 'max-content' }}
                bordered style={{ margin: '20px 0' }}
                rowKey="assignmentId"
                onRow={(record) => {
                    return {
                        onMouseEnter: () => { setRowWasEntered(record) },
                        onClick: () => {
                            setIsDetaiModalVisible(true)
                        }
                    }
                }}
                pagination={{ total: pageTotal, showSizeChanger: true, defaultCurrent: 1, defaultPageSize: 5, pageSizeOptions: [5, 10, 50], current: pageParams.pageNumber, pageSize: pageParams.pageSize, onChange: changePage }}
            />
        </div>
    )
}
export default Home;