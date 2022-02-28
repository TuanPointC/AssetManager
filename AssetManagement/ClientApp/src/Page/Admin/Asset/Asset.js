import { useState, useEffect } from "react";
import { GetAssets } from "../../../Api/AssetApi";
import { GetCategories } from "../../../Api/CategoryApi";
import { Spin, Table, Button, Space, Select, Input } from 'antd';
import { CloseCircleTwoTone, EditTwoTone, ClearOutlined } from '@ant-design/icons';
import { Link, useRouteMatch } from "react-router-dom";
import ModalAddingUser from "./ModalAddingAsset";
import ModalDeleteAsset from "./ModelDeleteAsset";
import ModalDetailAsset from "./ModelDetailAsset";

const { Option } = Select;

const Asset = () => {
    const [assets, setAssets] = useState([])
    const [isLoading, setisLoading] = useState(false)
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [rowWasEntered, setRowWasEntered] = useState(null)
    const [isDetailModalVisible, setIsDetaiModalVisible] = useState(false)
    const [search, setSearch] = useState(null)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)

    // page params
    const [pageParams, setPageParams] = useState({ pageSize: 5, pageNumber: 1, filterState: null, filterCategory: null, searchName: null, locationUser: localStorage.getItem("userLocation") })
    const [pageTotal, setPageTotal] = useState(0)
    let { url } = useRouteMatch();

    useEffect(() => {
        async function getAsset() {
            setLoading(true)
            await GetAssets({ ...pageParams })
                .then(assetResult => {
                    GetCategories()
                        .then(categorieResult => {
                            setLoading(false)
                            const newAssets = checkLocal(assetResult.data.listAssets)
                            setAssets([...newAssets])
                            setCategories([...categorieResult.data])
                            setPageTotal(assetResult.data.count)
                            setisLoading(false);

                        })
                        .catch(e => {
                            setCategories([])
                        })

                })
                .catch(err => {
                    setLoading(false)
                    setAssets([])
                    setPageTotal(0)
                    setisLoading(false);
                })

        }
        getAsset()
    }, [pageParams]);

    const checkLocal = (listAsset) => {
        const assetLocal = JSON.parse(localStorage.getItem("editedAsset"));
        if (assetLocal !== null && typeof assetLocal !== "undefined") {
            var assetsFilter = listAsset.filter(u => u.id !== assetLocal.id);
            assetsFilter.unshift(assetLocal);
            listAsset = assetsFilter

            localStorage.removeItem("editedAsset");

        }
        return listAsset
    }

    const changeFilterState = (value) => {
        if (value !== 'all') {
            setPageParams({ ...pageParams, filterState: value })
        }
        else {
            setPageParams({ ...pageParams, filterState: null })
        }
    }

    const changeFilterCategory = (value) => {
        if (value !== 'all') {
            setPageParams({ ...pageParams, filterCategory: value })
        }
        else {
            setPageParams({ ...pageParams, filterCategory: null })
        }
    }

    const onSearch = () => {
        setPageParams({ ...pageParams, pageNumber: 1, searchName: search })
    }

    const OpenIsDeleteModalVisible = (e) => {
        e.stopPropagation();
        setIsDeleteModalVisible(true)
    }

    const changePage = (pageNumber, pageSize) => {
        setPageParams({ ...pageParams, pageNumber: pageNumber, pageSize: pageSize })
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
            title: 'Asset code',
            dataIndex: 'assetCode',
            sorter: (a, b) => a.assetCode.localeCompare(b.assetCode),
        },
        {
            title: 'Asset Name',
            dataIndex: 'assetName',
            sorter: (a, b) => a.assetName.localeCompare(b.assetName),
        },
        {
            title: 'Category',
            dataIndex: ['category', 'name'],
            sorter: (a, b) => a.category.name.localeCompare(b.category.name),
        },
        {
            title: 'State',
            dataIndex: 'state',
            sorter: (a, b) => a.state.localeCompare(b.state),
            render: (state) => {
                if (state === 'unavailable') return 'Not available'
                if (state === 'available') return 'Available'
                if (state === 'waiting') return 'Waiting for recycling'
                if (state === 'recycled') return 'Recycled'
                if (state === 'assigned') return 'Assigned'
            }
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
                        onClick={OpenIsDeleteModalVisible}
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
            <ModalDeleteAsset
                isDeleteModalVisible={isDeleteModalVisible}
                setIsDeleteModalVisible={setIsDeleteModalVisible}
                rowWasEntered={rowWasEntered}
                setAssets={setAssets}
                assets={assets}
            />

            <ModalDetailAsset
                asset={assets.find(a => a.id === rowWasEntered)}
                visible={isDetailModalVisible}
                setVisible={setIsDetaiModalVisible}
            />

            <div style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignContent: 'left' }}>
                    <span style={{ display: 'flex', marginRight: '2em' }}>
                        <Select placeholder="State" style={{ width: 120 }} onChange={changeFilterState} >
                            <Option value="all">All</Option>
                            <Option value="available">Available</Option>
                            <Option value="unavailable">Not Available</Option>
                            <Option value="assigned">Assigned</Option>
                            <Option value="waiting">Waiting for recycling</Option>
                            <Option value="recycled">Recycled</Option>
                        </Select>
                    </span>

                    <span style={{ display: 'flex', marginRight: '2em' }}>
                        <Select placeholder="Category" style={{ width: 120 }} onChange={changeFilterCategory}>
                            <Option value="all">All</Option>
                            {categories.map(cate => (
                                <Option value={cate.name} key={cate.id}>{cate.name}</Option>
                            ))}
                        </Select>
                    </span>

                    <span>
                        <ModalAddingUser
                            assets={assets}
                            setAssets={setAssets}
                        />
                    </span>

                </div>
                <span style={{ display: 'inline-flex' }}>
                    <Input.Search value={search}
                        placeholder="Input search text"
                        onChange={handleInputChange}
                        onSearch={onSearch}
                        enterButton
                        onCopy={(e) => {
                            e.preventDefault()
                            return false
                        }} />
                    <Button danger onClick={clearSearch}>
                        <ClearOutlined /> Clear
                    </Button>
                </span>

            </div>


            <Table
                columns={columns}
                scroll={{ x: 'max-content' }}
                loading={loading}
                dataSource={assets}
                bordered style={{ margin: '20px 0' }}
                rowKey="id"
                onRow={(record) => {
                    return {
                        onMouseEnter: () => { setRowWasEntered(record.id) },
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
export default Asset;