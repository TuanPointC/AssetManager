import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Layout, Button } from "antd";
import Nav from "./Nav/Nav";
import User from "./User/User";
import { useState } from "react";
import HeaderComponent from "../../Component/HeaderComponent";
import Assignment from "./Assignment/Assignment";
import Asset from "./Asset/Asset";
import Report from "./Report/Report";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import UpdateUser from "./User/UpdateUser";
import { failed } from "../../Component/Message";
import UpdateAsset from "./Asset/UpdateAsset";

import AddingAssignment from "./Assignment/AddingAssignment";
import Returning from "./Returning/Returning";
import UpdatingAssignment from "./Assignment/UpdateAssignment";
import Home from "../User/Home/Home";

const { Header, Content, Sider } = Layout;

const AdminContainer = (props) => {
  const [collapsed, setCollapsed] = useState(true);
  const screenHeight = window.innerHeight - 80;
  const screenWidth = window.innerWidth;
  const styleContent = {
    padding: screenWidth < 768 ? "0 5px" : "0 50px",
    marginTop: 10,
    minHeight: screenHeight + "px",
    marginTop: 10,
    minHeight: screenHeight + "px",
  }

  const View = () => {
    return (
      <Layout className="layout App">
        <Router>
          <Header style={{ background: "red" }}>
            <HeaderComponent setUserLogin={props.setUserLogin} />
          </Header>
          <Layout>
            <Sider collapsed={collapsed} theme="light">
              <Button
                danger
                type="primary"
                onClick={() => setCollapsed((prev) => !prev)}
                style={{ margin: 16 }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </Button>
              <Nav />
            </Sider>

            <Content
              className="site-layout"
              style={styleContent}
            >
              <Switch style={{ padding: 24, minHeight: 380 }}>
                <Route exact path="/admin/">
                  <Home />
                </Route>

                <Route exact path="/admin/user">
                  <User />
                </Route>
                <Route exact path="/admin/user/:id">
                  <UpdateUser />
                </Route>
                <Route exact path="/admin/asset">
                  <Asset />
                </Route>
                <Route exact path="/admin/asset/:id">
                  <UpdateAsset />
                </Route>
                <Route exact path="/admin/assignment">
                  <Assignment />
                </Route>
                <Route exact path="/admin/assignment/create">
                  <AddingAssignment />
                </Route>
                <Route exact path="/admin/assignment/:id">
                  <UpdatingAssignment />
                </Route>
                <Route exact path="/admin/report">
                  <Report />
                </Route>
                <Route exact path="/admin/returning">
                  <Returning />
                </Route>
              </Switch>
            </Content>
          </Layout>
        </Router>

      </Layout>
    );
  };

  const ViewUnThorization = () => {
    failed("You need login before access the website");
    return <Redirect to="/login" />;
  };

  return (
    <>
      {localStorage.getItem("userRole") === "admin"
        ? View()
        : ViewUnThorization()}
    </>
  );
};
export default AdminContainer;
