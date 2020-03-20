import React, { Component } from "react";
import { PageHeader, Descriptions } from 'antd';

class Navbar extends Component {
    render(){
        return(
            <div
                style={{
                backgroundColor: "#f0f2f5",
                }}
            >
                <PageHeader
                ghost={false}
                title="區塊鏈自主查驗系統"
                subTitle="prototype"
                >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="使用者">{this.props.account}</Descriptions.Item>
                    <Descriptions.Item label="工程名稱">{this.props.projectName}</Descriptions.Item>
                </Descriptions>
                </PageHeader>
            </div>
        );
    }
}

export default Navbar;