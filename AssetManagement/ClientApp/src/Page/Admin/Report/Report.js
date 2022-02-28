import React, { useEffect, useState } from "react";
import { Button, Table, Layout } from "antd";
import { GetReportApi } from "../../../Api/ReportApi";
import "./Report.css";
import axios from "axios";
import FileDownload from "js-file-download";

const { Content } = Layout;
const location = localStorage.getItem("userLocation");
const Report = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [isDescending, setIsDescending] = useState(false);
  const [order, setOrder] = useState("");

  useEffect(() => {
    GetReportApi({
      sortBy: "categoryName",
      isDescending: false,
      location: location,
    })
      .then((res) => {
        setIsLoading(true);
        setReportData(res.data);
        setIsLoading(false);
        setOrder("ascDefault");
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);
  const columns = [
    {
      key: "1",
      title: "Category",
      dataIndex: "categoryName",
      defaultSortOrder: "ascend",
      sorter: true,
    },
    {
      key: "2",
      title: "Total",
      dataIndex: "total",
      sorter: true,
    },
    {
      key: "3",
      title: "Assigned",
      dataIndex: "assigned",
      sorter: true,
    },
    {
      key: "4",
      title: "Available",
      dataIndex: "available",
      sorter: true,
    },
    {
      key: "5",
      title: "Not Available",
      dataIndex: "notAvailable",
      sorter: true,
    },
    {
      key: "6",
      title: "Waiting for recycling",
      dataIndex: "waitRecycle",
      sorter: true,
    },
    {
      key: "7",
      title: "Recycled",
      dataIndex: "recycled",
      sorter: true,
    },
  ];

  const handleTableChange = (sorter) => {
    var asc = false;
    setSortBy(sorter.field);
    //default
    if (sorter.order === undefined) {
      setOrder("undefined");
    }

    //asc or des
    if (sorter.order === "ascend" || sorter.order === "descend") {
      if (sorter.order === "ascend") {
        asc = false;
        setOrder("asc");
        if (!asc) {
          setIsDescending(false);
        }
      }
      if (sorter.order === "descend") {
        asc = true;
        setOrder("dsc");
        if (asc) {
          setIsDescending(true);
        }
      }
      GetReportApi({
        sortBy: sorter.order,
        isDescending: isDescending,
        location: location,
      })
        .then((res) => {
          setIsLoading(true);
          setReportData(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
        });
    }
    if (sorter.order === undefined) {
      GetReportApi({ location: location })
        .then((res) => {
          setIsLoading(true);
          setReportData(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
        });
    }
  };

  const handleExport = () => {
    if (order === "ascDefault") {
      axios({
        method: "get",
        url: `${window.location.origin}/api/Report/export?sortBy=categoryName&isDescending=false&location=${location}`,
        responseType: "blob",
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(function (response) {
        FileDownload(response.data, `Report_${new Date().toISOString()}.xlsx`);
      });
    } else if (order === "undefined") {
      axios({
        method: "get",
        url: `${window.location.origin}/api/Report/export?sortBy=${sortBy}&isDescending=${isDescending}&location=${location}`,
        responseType: "blob",
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(function (response) {
        FileDownload(response.data, `Report_${new Date().toISOString()}.xlsx`);
      });
    } else {
      axios({
        method: "get",
        url: `${window.location.origin}/api/Report/export?sortBy=${sortBy}&isDescending=${isDescending}&location=${location}`,
        responseType: "blob",
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(function (response) {
        FileDownload(response.data, `Report_${new Date().toISOString()}.xlsx`);
      });
    }
  };

  return (
    <Content>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
        }}
      >
        <Button type="primary" danger onClick={handleExport}>
          Export
        </Button>
      </div>

      <Table
        scroll={{ x: 'max-content' }}
        bordered
        loading={isLoading}
        dataSource={reportData}
        columns={columns}
        onChange={handleTableChange}
      />
    </Content>
  );
};

export default Report;
