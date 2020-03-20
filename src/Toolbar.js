import React, { Component } from "react";
import { Menu, Icon, Switch } from "antd";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;

class Toolbar extends Component{
    render(){
        return(
            <Menu
                mode="inline"
                defaultSelectedKeys="home"
            >
                <Menu.Item key="home" style={{ fontSize: 16 }}>
                    <Link to="">
                        首頁
                    </Link>
                </Menu.Item>
                <Menu.Item style={{ fontSize: 16 }}>
                    <Link to="/newproject">
                    建立專案
                    </Link>
                </Menu.Item>
                <Menu.Item style={{ fontSize: 16 }}>
                    <Link to="/itemupload">
                    匯入查驗項目
                    </Link>
                </Menu.Item>
                <Menu.Item style={{ fontSize: 16 }}>
                    <Link to="/newsheet">
                    新增查驗表單
                    </Link>
                </Menu.Item>
                <Menu.Item style={{ fontSize: 16 }}>
                    <Link to="/state">
                    檢視查驗狀態
                    </Link>
                </Menu.Item>
                <Menu.Item style={{ fontSize: 16 }}>
                    <Link to="/sheet">
                    匯出查驗表單
                    </Link>
                </Menu.Item>
            </Menu>
        );
    }
}
export default Toolbar