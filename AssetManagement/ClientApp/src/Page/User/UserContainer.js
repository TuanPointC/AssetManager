import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Layout, Button } from 'antd';
import Nav from './Nav/Nav';
import Home from "./Home/Home";
import { useState } from "react";
import HeaderComponent from "../../Component/HeaderComponent";
import { failed } from "../../Component/Message";

const { Header, Content, Sider } = Layout;
const UserContainer = (props) => {
    const screenHeight = window.innerHeight - 70;
    const [collapsed, setCollapsed] = useState(true)
    const styleContent = {
        padding: window.innerWidth < 768 ? "0 5px" : "0 50px",
        marginTop: 10,
        minHeight: screenHeight + "px",
        marginTop: 10,
        minHeight: screenHeight + "px",
    }
    const View = () => {
        return (
            <Layout className="layout App">
                <Router>
                    <Header style={{ height: '60px', background: 'red' }}>
                        <HeaderComponent setUserLogin={props.setUserLogin} />
                    </Header>
                    <Layout style={{ maxHeight: screenHeight + 'px' }}>
                        <Sider collapsed={collapsed} theme="light">
                            <Button danger type="primary" onClick={() => setCollapsed((prev) => !prev)} style={{ margin: 16 }}>
                                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            </Button>
                            <Nav />
                        </Sider>

                        <Content className="site-layout" style={styleContent}>
                            <Switch style={{ padding: 24, minHeight: 380 }}>
                                <Route exact path="/user">
                                    <Home />
                                </Route>

                            </Switch>
                        </Content>

                    </Layout>
                </Router>
            </Layout>
        )
    }

    const ViewUnThorization = () => {
        failed("You need login before access the website")
        return <Redirect to="/login" />
    }
    return (
        <>
            {localStorage.getItem("token") ? View() : ViewUnThorization()}
        </>
    )
}

export default UserContainer;