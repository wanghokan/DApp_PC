import React, { Component } from "react";
import { Layout, Select, Input, Button } from "antd";
import Web3 from "web3";

const { Content } = Layout
const { Option } = Select
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class Photos extends Component {

    constructor(props){
        super(props)
        
        this.state={
            isSearch: false,
            term: 0,
            class: 0,
            task: 0,
            location: 0,
            hashArray: []
        }
    }

    search = async() => {
        window.web3 = new Web3(window.ethereum)
        if(this.state.term == 0 || this.state.class == 0 || this.state.task == 0 || this.state.location == 0){
            alert("please finish the selection!")
        }
        else{
            const sheetId = 10000000*this.state.term + 100000*this.state.class + 1000*this.state.task + this.state.location
            let sheet = await this.props.sheetContent(sheetId)
            this.setState({ hashArray: window.web3.utils.toUtf8(sheet._photo).split("@") })
        }
    }

    render(){
        return(
            <Content>
                <p></p>
                <h1 style={{ fontSize: 20, textAlign: "center" }}>查驗照片</h1>
                <p></p>
                    { (this.props.Term == null || this.props.Class == null || this.props.Task == null || this.props.Location == null)
                        ? <h1 style={{ fontSize:16, textAlign: "center" }}>請先至首頁選擇專案</h1>
                        : <div>
                            <span style={{ fontSize: 16}}>基本資訊</span>
                            <p></p>
                            <span style={{ fontSize: 18}}>表單編號: </span>
                            <Input style={{ width: 100 }} disabled={true} value={10000000*this.state.term + 100000*this.state.class + 1000*this.state.task + this.state.location}/>
                            <span> </span>
                            <span style={{ fontSize: 18}}>工程名稱: </span>
                            <Input style={{ width: 300 }} disabled={true} value={this.props.projectName}/>
                            <p></p>
                            <span style={{ fontSize: 18}}>工程大項: </span>
                            <Select
                                style={{ width: 200 }}
                                onChange={(value) => this.setState({ term: value, class: 0, task: 0, location: 0 })}
                                defaultValue={this.state.term}
                            >
                                {this.props.Term.map((_Term, key) => 
                                    <Option value={key}>{_Term}</Option>
                                )}
                            </Select>
                            <span style={{ fontSize: 18}}> 工程類別: </span>
                            <Select
                                style={{ width: 200 }}
                                onChange={(value) => this.setState({ class: value, task: 0, location: 0 })}
                                defaultValue={this.state.class}
                            >
                                {this.props.Class[this.props.Term[this.state.term]].map((_Class, key) =>
                                    <Option value={key}>{_Class}</Option>
                                )}
                            </Select>
                            <span style={{ fontSize: 18}}> 項目名稱: </span>
                            <Select
                                style={{ width: 200 }}
                                onChange={(value) => this.setState({ task: value })}
                                defaultValue={this.state.task}
                            >
                                {this.props.Task[this.props.Class[this.props.Term[this.state.term]][this.state.class]].map((_Task, key) =>
                                    <Option value={key}>{_Task}</Option>
                                )}
                            </Select>
                            <span style={{ fontSize: 18}}> 查驗位置: </span>
                            <Select
                                style={{ width: 200 }}
                                onChange={(value) => this.setState({ location: value })}
                                defaultValue={this.state.task}
                            >
                                {this.props.Location[this.props.Task[this.props.Class[this.props.Term[this.state.term]][this.state.class]][this.state.task]].map((_Location, key) =>
                                    <Option value={key}>{_Location}</Option>
                                )}
                            </Select>
                            <span> </span>
                            <Button onClick={this.search}>
                                確認
                            </Button>
                        </div>
                    }
                <p></p>
                {this.state.hashArray.map((ha, k) =>
                    <img src={"https://ipfs.infura.io/ipfs/"+ha} style={{ width: 360, height: 240 }}/>
                )}
            </Content>
        );
    }
}

export default Photos