import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined, ContainerOutlined } from '@ant-design/icons';
import "./Nav.scss"
import React from 'react';
import { useLocation } from 'react-router';

const Nav = () => {
    const location = useLocation().pathname.split('/');
    return (

        <Menu mode="inline" theme="light" >
            <Menu.Item
                key="home"
                icon={<HomeOutlined />}
                style={{ backgroundColor: location[location.length - 1] === 'user' ? 'red' : '', color: location[location.length - 1] === 'user' ? 'white' : '' }}
            >
                <Link to="/user" style={{ color: location[location.length - 1] === 'user' ? 'white' : '' }}>Home</Link>
            </Menu.Item>

        </Menu>
    );
};

export default Nav;