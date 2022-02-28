import { useState, useEffect } from "react";
import { Spin, Table, Button, Space, Select, Input, DatePicker } from 'antd';
import { CloseCircleTwoTone, EditTwoTone, ClearOutlined, ReloadOutlined } from '@ant-design/icons';
import { Link, useRouteMatch } from "react-router-dom";
import { GetAssignments } from "../../../Api/AssignmnetApi";
import ModalDetailAsignment from "./ModalDetailAssignment";
import ModalDeleteAssignment from "./ModalDeleteAssignment";
import ModalConfirmCreateReturning from "../../User/Home/ModalConfirmCreateReturning";
import moment from "moment"
const { Option } = Select;

const Assignment = () => {
    const [assignments, setAssignments] = useState(null)
    const [isLoading, setisLoading] = useState(false)

    const [isDeleting, setIsDeleting] = useState(false);
    const [isCreateReturning, setIsCreateReturning] = useState(false)
    const [rowWasEntered, setRowWasEntered] = useState(null)
    const [isDetailModalVisible, setIsDetaiModalVisible] = useState(false)
    const [selectAssignment, setSelectAssignment] = useState(null)

    const [search, setSearch] = useState(null)
    const [loading, setLoading] = useState(false)

    // page params
    const [pageParams, setPageParams] = useState({ pageSize: 5, pageNumber: 1, searchName: null, filterTypeUser: null,locationUser:localStorage.getItem("userLocation") })
    const [pageTotal, setPageTotal] = useState(0)
    let { url } = useRouteMatch();

    useEffect(() => {
        async function getAssignment() {
            setLoading(true)
            await GetAssignments({ ...pageParams })
                .then(assignmentsResult => {
                    var newListAssignment = checkLocal(assignmentsResult.data.listAssignments)
                    setAssignments([...newListAssignment])
                    setPageTotal(assignmentsResult.data.count)
                    setisLoading(false);
                    setLoading(false)
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

    const checkLocal = (listAssignment) => {
        const asignmentLocal = JSON.parse(localStorage.getItem("newAssignment"));
        if (asignmentLocal !== null && typeof asignmentLocal !== "undefined") {
            var listAssignment = listAssignment.filter(u => u.assignmentId !== asignmentLocal.assignmentId);
            listAssignment.unshift(asignmentLocal);

            localStorage.removeItem("newAssignment");

        }
        return listAssignment
    }


    const changeFilterType = (value) => {
        if (value !== 'all') {
            setPageParams({ ...pageParams, pageNumber: 1, filterState: value })
        }
        else {
            setPageParams({ ...pageParams, pageNumber: 1, filterState: null })
        }
    }

    const onFilterDate = (value) => {
        if (!value) {
            setPageParams({ ...pageParams, pageNumber: 1, filterDate: null })
        }
        else {
            let intlDateObj = new Intl.DateTimeFormat('vi-VI', {
                timeZone: "Asia/Ho_Chi_Minh",

            });
            var value1 = intlDateObj.format(value).split("/")
            value = value1[2] + '-' + value1[1] + '-' + value1[0]
            setPageParams({ ...pageParams, pageNumber: 1, filterDate: value })
        }


    }

    const onSearch = () => {
        if (search) {
            setPageParams({ ...pageParams, pageNumber: 1, searchName: search.trim() })
        }
        else {
            setPageParams({ ...pageParams, pageNumber: 1, searchName: null })
        }
    }

    const changePage = (pageNumber, pageSize) => {
        setPageParams({ ...pageParams, pageSize: pageSize, pageNumber: pageNumber, searchName: search, filterTypeUser: pageParams.filterTypeUser })
    }

    const clearSearch = () => {
        setSearch(null)
        setPageParams({ ...pageParams, pageNumber: 1, searchName: null })
    }

    const handleInputChange = (e) => {
        setSearch(e.target.value)
    }

    const deleteConfirm = (e) => {
        setIsDeleting(true)
        e.stopPropagation()
    }
    const createReturnConfirm = (e) => {
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
            title: 'Assigned to',
            dataIndex: ['user', 'userName'],
            sorter: (a, b) => a.user.userName.localeCompare(b.user.userName),
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
            size: "large",
            width: '10%',
            render: (data, _, _1) => (
                <Space size="large">
                    <Button
                        style={{ border: 'none', }} disabled={data.state !== 'waiting'}
                        shape="circle"
                    >
                        <Link to={
                            {
                                pathname: `${url}/${rowWasEntered}`
                            }
                        }>
                            <EditTwoTone twoToneColor="#c7c7c7"
                                style={{ fontSize: '1.5em' }} />
                        </Link>
                    </Button>
                    <Button
                        style={{ border: 'none', }}
                        disabled={data.state !== 'waiting' && data.state !== "declined"}
                        shape="circle" icon={<CloseCircleTwoTone twoToneColor="#ff5454" style={{ fontSize: '1.5em' }} />}
                        onClick={deleteConfirm}
                    />

                    <Button
                        style={{ border: 'none', }}
                        disabled={data.state !== "accepted" || data.isReturning}
                        icon={<ReloadOutlined style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'blue' }} />}
                        onClick={createReturnConfirm}
                        shape="circle"
                    />
                </Space>
            )

        }
    ];

    if (isLoading) {
        return <Spin size="large" style={{ position: 'absolute', top: '50%', left: '50%', translate: '-50%,-50%' }} />
    }
    return (
        <div>
            <ModalDeleteAssignment
                visible={isDeleting}
                setVisible={setIsDeleting}
                rowWasEntered={rowWasEntered}
                setAssignments={setAssignments}
                assignments={assignments}
            />

            <ModalDetailAsignment
                assignments={selectAssignment}
                visible={isDetailModalVisible}
                setVisible={setIsDetaiModalVisible}
            />

            <ModalConfirmCreateReturning
                visible={isCreateReturning}
                setVisible={setIsCreateReturning}
                rowWasEntered={selectAssignment}
                assignments={assignments}
                setAssignments={setAssignments}
            />

            <div style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignContent: 'left' }}>
                    <span style={{ display: 'flex', marginRight: '2em' }}>
                        <Select placeholder="State" style={{ width: 120 }} onChange={changeFilterType}>
                            <Option value="all">All</Option>
                            <Option value="accepted">Accepted</Option>
                            <Option value="declined">Declined</Option>
                            <Option value="waiting">Waiting for acceptance</Option>
                        </Select>
                    </span>
                    <span>
                        <DatePicker onChange={onFilterDate} placeholder="Assigned Date" />
                    </span>
                    <span>
                        <Button type="primary" style={{ marginLeft: '10px' }}><Link to="/admin/assignment/create">Create new Asignment</Link></Button>
                    </span>
                </div>
                <span style={{ display: 'inline-flex' }}>
                    <Input.Search value={search}
                        placeholder="Input search text"
                        onChange={handleInputChange}
                        onSearch={onSearch}
                        enterButton />
                    <Button danger onClick={clearSearch}>
                        <ClearOutlined /> Clear
                    </Button>
                </span>

            </div>


            <Table
                columns={columns}
                loading={loading}
                scroll={{ x: 'max-content' }}
                dataSource={assignments}
                bordered style={{ margin: '20px 0' }}
                rowKey="assignmentId"
                onRow={(record) => {
                    return {
                        onMouseEnter: () => {
                            setRowWasEntered(record.assignmentId)
                        },
                        onClick: () => {
                            setIsDetaiModalVisible(true)
                            setSelectAssignment(record)
                        }
                    }
                }}
                pagination={{ total: pageTotal, showSizeChanger: true, defaultCurrent: 1, defaultPageSize: 5, pageSizeOptions: [5, 10, 50], current: pageParams.pageNumber, pageSize: pageParams.pageSize, onChange: changePage }}
            />
        </div>
    )
}
export default Assignment;