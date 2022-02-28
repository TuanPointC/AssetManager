import { useState, useEffect } from "react";
import { Spin, Table, Button, Space, Select, Input, DatePicker } from 'antd';
import { CloseCircleTwoTone, CheckCircleTwoTone, ClearOutlined } from '@ant-design/icons';
import { GetReturnings } from "../../../Api/ReturningApi";
import ModalConfirmDelete from "./ModalConfirmDelete";
import ModalConfirmComplete from "./ModalConfirmComplete";

const { Option } = Select;

const Returning = () => {
    const [returnings, setReturnings] = useState(null)
    const [isLoading, setisLoading] = useState(false)

    const [isDeleting, setIsDeleting] = useState(false);
    const [rowWasEntered, setRowWasEntered] = useState(null)
    const [_, setIsDetaiModalVisible] = useState(false)
    const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false)

    const [search, setSearch] = useState(null)
    const [loading, setLoading] = useState(false)

    // page params
    const [pageParams, setPageParams] = useState({ pageSize: 5, pageNumber: 1, searchName: null, filterTypeUser: null, locationUser: localStorage.getItem("userLocation") })
    const [pageTotal, setPageTotal] = useState(0)

    useEffect(() => {
        async function getAssignment() {
            setLoading(true)
            await GetReturnings({ ...pageParams })
                .then(res => {
                    setLoading(false)
                    setisLoading(false);
                    setReturnings([...res.data.listReturns])
                    setPageTotal(res.data.count)

                })
                .catch(err => {
                    setLoading(false)
                    setReturnings([])
                    setPageTotal(0)
                    setisLoading(false);
                })


            setisLoading(false);
        }
        getAssignment()
    }, [pageParams]);


    const changeFilterType = (value) => {
        if (value !== 'all') {
            setPageParams({ ...pageParams, pageNumber: 1, filterState: value })
        }
        else {
            setPageParams({ ...pageParams, pageNumber: 1, filterState: null })
        }
    }

    const onFilterDate = (value) => {
        if (value) {
            setPageParams({ ...pageParams, pageNumber: 1, filterDate: new Date(value).toISOString().split('T')[0] })
        }
        else {
            setPageParams({ ...pageParams, pageNumber: 1, filterDate: null })
        }

    }

    const onSearch = () => {
        setPageParams({ ...pageParams, pageNumber: 1, searchName: search })
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


    const acceptedEvent = (e) => {
        setIsCompleteModalVisible(true)
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
            dataIndex: 'assetCode',
            sorter: (a, b) => a.assetCode.localeCompare(b.assetCode),
        },
        {
            title: 'Asset name',
            dataIndex: 'assetName',
            sorter: (a, b) => a.assetName.localeCompare(b.assetName),
        },
        {
            title: 'Requested By',
            dataIndex: 'requestByName',
            sorter: (a, b) => a.requestByName.localeCompare(b.requestByName),
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
            title: 'Returned date',
            dataIndex: 'returnDate',
            render: (returnDate) => (
                <div>{returnDate ? returnDate.split('T')[0] : ''}</div>
            ),
            sorter: (a, b) => a.returnDate > b.returnDate,
        },
        {
            title: 'Accepted by',
            dataIndex: 'acceptByName',
        },
        {
            title: 'State',
            dataIndex: 'state',
            sorter: (a, b) => a.state.localeCompare(b.state),
            render: (state) => {
                if (state === 'completed') return 'Completed'
                if (state === 'declined') return 'Declined'
                if (state === 'waiting') return 'Waiting for returning'
            }

        },
        {
            title: "Actions",
            size: "large",
            width: '7%',
            render: (data, _, _1) => (
                <Space size="large">
                    <Button
                        style={{ border: 'none', }}
                        shape="circle"
                        disabled={data.state !== 'waiting'}
                        icon={<CheckCircleTwoTone twoToneColor="#52c41a"
                            style={{ fontSize: '1.5em' }} />}
                        onClick={acceptedEvent}

                    />
                    <Button
                        style={{ border: 'none', }}
                        disabled={data.state !== 'waiting'}
                        shape="circle"
                        icon={<CloseCircleTwoTone twoToneColor="#ff5454" style={{ fontSize: '1.5em' }} />}
                        onClick={deleteConfirm}
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
            <ModalConfirmDelete
                visible={isDeleting}
                setVisible={setIsDeleting}
                rowWasEntered={rowWasEntered}
                returnings={returnings}
                setReturnings={setReturnings}
            />

            <ModalConfirmComplete
                setReturnings={setReturnings}
                visible={isCompleteModalVisible}
                setVisible={setIsCompleteModalVisible}
                rowWasEntered={rowWasEntered}
                returnings={returnings}
                setReturnings={setReturnings}
            />



            <div style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignContent: 'left' }}>
                    <span style={{ display: 'flex', marginRight: '2em' }}>
                        <Select placeholder="State" style={{ width: 120 }} onChange={changeFilterType}>
                            <Option value="all">All</Option>
                            <Option value="completed">Completed</Option>
                            <Option value="declined">Declined</Option>
                            <Option value="waiting">Waiting for returning</Option>
                        </Select>
                    </span>
                    <span>
                        <DatePicker onChange={onFilterDate} />
                    </span>
                </div>
                <span style={{ display: 'inline-flex' }}>
                    <Input.Search value={search} onCopy={(e) => {
                        e.preventDefault()
                        return false
                    }}
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
                scroll={{ x: 'max-content' }}
                loading={loading}
                dataSource={returnings}
                bordered style={{ margin: '20px 0' }}
                rowKey="requestId"
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
export default Returning;