import { useState, useEffect } from "react";
import { GetUsers, checkValidUser } from "../../../Api/UserApi";
import { Spin, Table, Button, Space, Select, Input } from 'antd';
import { CloseCircleTwoTone, EditTwoTone, ClearOutlined } from '@ant-design/icons';
import { Link, useRouteMatch } from "react-router-dom";
import ModalAddingUser from "./ModalAddingUser";
import ModalDisableUser from "./ModalDisableUser";
import ModalDetailUser from "./ModalDetailUser";
const { Option } = Select;

const User = () => {
    const [users, setUsers] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const [isDisableModalVisible, setIsDisableModalVisible] = useState(false);
    const [isDisabling, setIsDisabling] = useState(false);
    const [validDisable, setValidDisable] = useState(false)
    const [rowWasEntered, setRowWasEntered] = useState(null)
    const [isDetailModalVisible, setIsDetaiModalVisible] = useState(false)
    const [selectUser, setSelectUser] = useState(null)
    const [search, setSearch] = useState(null)
    const [loading, setLoading] = useState(false)

    // page params
    const [pageParams, setPageParams] = useState({ pageSize: 5, pageNumber: 1, searchName: null, filterTypeUser: null, locationUser: localStorage.getItem("userLocation") })
    const [pageTotal, setPageTotal] = useState(0)
    let { url } = useRouteMatch();

    useEffect(() => {
        async function getUser() {
            setLoading(true)
            await GetUsers({ ...pageParams })
                .then(res => {
                    res.data.listUsers.sort((x, y) => x.staffCode.localeCompare(y.staffCode))
                    var newUsers = checkLocal(res.data.listUsers)
                    newUsers = newUsers.map(u => {
                        return { ...u, fullName: u.lastName + ' ' + u.firstName }
                    })
                    setUsers([...newUsers])
                    setPageTotal(res.data.count)
                    setisLoading(false);
                    setLoading(false)

                })
                .catch(err => {
                    setLoading(false)
                    setUsers([])
                    setPageTotal(0)
                    setisLoading(false);
                })
        }
        getUser()
    }, [isDisabling, pageParams]);

    const checkLocal = (listUsers) => {
        const userLocal = JSON.parse(localStorage.getItem("userLocal"));
        if (userLocal !== null && typeof userLocal !== "undefined") {
            listUsers = listUsers.filter(u => u.id !== userLocal.id);
            listUsers.unshift(userLocal);
            localStorage.removeItem("userLocal");

        }
        return listUsers
    }

    const changeFilterType = (value) => {
        if (value !== 'all') {
            setPageParams({ ...pageParams, pageNumber: 1, filterTypeUser: value })
        }
        else {
            setPageParams({ ...pageParams, pageNumber: 1, filterTypeUser: null })
        }

    }
    const onSearch = () => {
        setPageParams({ ...pageParams, pageNumber: 1, searchName: search })
    }

    const handleDisableClick = (e) => {
        e.stopPropagation();
        async function check() {
            const check = await checkValidUser(rowWasEntered);
            setValidDisable(check.data.result);
        }
        check()
        setIsDisableModalVisible(true);
        setIsDisabling(true);
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
            title: 'UserName',
            dataIndex: 'userName',
            sorter: (a, b) => a.userName.localeCompare(b.userName),
        },
        {
            title: 'Joined Date',
            dataIndex: 'joinedDate',
            render: (joinedDate) => (

                <div>{joinedDate.split('T')[0]}</div>
            ),
            sorter: (a, b) => a.joinedDate.localeCompare(b.joinedDate),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            sorter: (a, b) => a.type.localeCompare(b.type),
        },
        {
            title: "Actions",
            size: "large",
            width: '7%',
            render: () => (
                <Space size="large">
                    <Link to={
                        {
                            pathname: `${url}/${rowWasEntered}`
                        }
                    }>
                        <EditTwoTone twoToneColor="#c7c7c7"
                            style={{ fontSize: '1.5em' }} />
                    </Link>
                    <CloseCircleTwoTone twoToneColor="#ff5454"
                        onClick={handleDisableClick}
                        style={{ fontSize: '1.5em' }} />
                </Space>
            )

        }
    ];

    if (isLoading) {
        return <Spin size="large" style={{ position: 'absolute', top: '50%', left: '50%', translate: '-50%,-50%' }} />
    }
    return (
        <div>
            <ModalDisableUser
                user={rowWasEntered}
                setUser={setRowWasEntered}
                valid={validDisable}
                visible={isDisableModalVisible}
                setVisible={setIsDisableModalVisible}
                setIsDisabling={setIsDisabling}
            />

            <ModalDetailUser
                user={selectUser}
                visible={isDetailModalVisible}
                setVisible={setIsDetaiModalVisible}
            />
            <div style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignContent: 'left' }}>
                    <span style={{ display: 'flex', marginRight: '2em' }}>
                        <Select placeholder="Type" style={{ width: 120 }} onChange={changeFilterType}>
                            <Option value="all">All</Option>
                            <Option value="staff">Staff</Option>
                            <Option value="admin">Admin</Option>
                        </Select>
                    </span>
                    <span>
                        <ModalAddingUser
                            users={users}
                            setUsers={setUsers}
                            setPageTotal={setPageTotal}
                        />
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
                loading={loading}
                dataSource={users}
                bordered style={{ margin: '20px 0' }}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                onRow={(record) => {
                    return {
                        onMouseEnter: () => { setRowWasEntered(record.id) },
                        onClick: () => {
                            setIsDetaiModalVisible(true)
                            setSelectUser(record)
                        }
                    }
                }}
                pagination={{ total: pageTotal, showSizeChanger: true, defaultCurrent: 1, defaultPageSize: 5, pageSizeOptions: [5, 10, 50], current: pageParams.pageNumber, pageSize: pageParams.pageSize, onChange: changePage }}
            />
        </div>
    )
}
export default User;