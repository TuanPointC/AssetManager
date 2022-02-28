import { useState, useEffect } from "react";
import { GetAssets } from "../../../Api/AssetApi";
import { GetCategories } from "../../../Api/CategoryApi";
import {Table, Modal, Input } from 'antd';

const ModalSearchAsset = (props) => {
    const [assets, setAssets] = useState([])
    const [isLoading, setisLoading] = useState(false)
    const [pageParams, setPageParams] = useState({ pageSize: 5, pageNumber: 1, filterState:'available', locationUser: localStorage.getItem("userLocation") })
    const [pageTotal, setPageTotal] = useState(0)
    const [categories, setCategories] = useState([])
    const [selectedRow, setSelectedRow] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function getAsset() {
            setLoading(true)
            const assetResult = await GetAssets({ ...pageParams })
            const categorieResult = await GetCategories()
            if (assetResult.data.listAssets.length > 0) {
                setLoading(false)
                setAssets([...assetResult.data.listAssets])
                if (categorieResult.data.length > 0) {
                    setCategories([...categorieResult.data])
                }
                setPageTotal(assetResult.data.count)
                setisLoading(false);

            }
            else {
                setLoading(false)
                setAssets([])
                setPageTotal(0)
                if (categorieResult.data.length > 0) {
                    setCategories([...categorieResult.data])
                }
                setisLoading(false);
            }
        }
        getAsset()
    }, [pageParams]);

    const handleOk = () => {
        props.setAsset(selectedRow)
        props.setVisible(false);
    };

    const handleCancel = () => {
        props.setVisible(false);
    };

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
            title: 'state',
            dataIndex: 'state',
            sorter: (a, b) => a.category.name.localeCompare(b.category.name),
        }
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
                <h3 style={{ color: 'white' }}>Select Asset</h3>
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
            okButtonProps={{ disabled: !selectedRow }}
        >

            <Table
                rowSelection={{
                    type: 'radio',
                    ...rowSelection
                }}
                columns={columns}
                loading={loading}
                dataSource={assets}
                bordered style={{ margin: '20px 0' }}
                rowKey="id"
                pagination={{ total: pageTotal, showSizeChanger: true, defaultCurrent: 1, defaultPageSize: 5, pageSizeOptions: [5, 10, 50], current: pageParams.pageNumber, pageSize: pageParams.pageSize, onChange: changePage }}
            />
        </Modal>

    )
}

export default ModalSearchAsset