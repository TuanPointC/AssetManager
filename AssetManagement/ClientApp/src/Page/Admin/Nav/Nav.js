import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined, PullRequestOutlined, UserOutlined, CarryOutOutlined, GoldOutlined, LineChartOutlined } from '@ant-design/icons';
import "./Nav.scss"
import React from 'react';
import { useLocation } from 'react-router';
const Nav = () => {
    const location = useLocation().pathname.split('/');

    return (
        <Menu mode="inline" theme="light" className="menu">

            <Menu.Item
                key="home"
                icon={<HomeOutlined />}
                style={{ backgroundColor: (location[2] === '' || location[2] === undefined) ? 'red' : '', color: location[2] === '' ? 'white' : '' }}
            >
                <Link to="/admin/" style={{ color: (location[2] === '' || location[2] === undefined) ? 'white' : '' }}>Home</Link>
            </Menu.Item>
            <Menu.Item
                key="user"
                icon={<UserOutlined />}
                style={{ backgroundColor: location[2] === 'user' ? 'red' : '', color: location[2] === 'user' ? 'white' : '' }}
            >
                <Link to="/admin/user" style={{ color: location[2] === 'user' ? 'white' : '' }}>Manage User</Link>
            </Menu.Item>
            <Menu.Item
                key="asset"
                icon={<GoldOutlined />}
                style={{ backgroundColor: location[2] === 'asset' ? 'red' : '', color: location[2] === 'asset' ? 'white' : '' }}
            >
                <Link to="/admin/asset" style={{ color: location[2] === 'asset' ? 'white' : '' }}>Manage  Asset</Link>
            </Menu.Item>
            <Menu.Item
                key="assignment"
                icon={<CarryOutOutlined />}
                style={{ backgroundColor: location[2] === 'assignment' ? 'red' : '', color: location[2] === 'assignment' ? 'white' : '' }}
            >
                <Link to="/admin/assignment" style={{ color: location[2] === 'assignment' ? 'white' : '' }}>Manage Assignment</Link>
            </Menu.Item>
            <Menu.Item
                key="return"
                icon={<PullRequestOutlined />}
                style={{ backgroundColor: location[2] === 'returning' ? 'red' : '', color: location[2] === 'returning' ? 'white' : '' }}
            >
                <Link to="/admin/returning" style={{ color: location[2] === 'returning' ? 'white' : '' }}>Request for Returning</Link>
            </Menu.Item>

            <Menu.Item
                key="report"
                icon={<LineChartOutlined />}
                style={{ backgroundColor: location[2] === 'report' ? 'red' : '', color: location[2] === 'report' ? 'white' : '' }}
            >
                <Link to="/admin/report" style={{ color: location[2] === 'report' ? 'white' : '' }}>Report</Link>
            </Menu.Item>

        </Menu>
    );
};

export default Nav;