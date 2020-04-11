import React, { Component } from "react";
import { Layout, Input, Form, Select, List, Button, DatePicker } from "antd";
import Web3 from "web3";

const { Content } = Layout
const { Option } = Select
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class Newsheet extends Component{

    constructor(props){
        super(props)

        this.state={
            term: 0,
            class: 0,
            task: 0,
            location: 0,
            Items: [],
            Contractor: "",
            Timing: null,
            itemsState: []
        }
    }

    setContractor = ({target}) => {
        window.web3 = new Web3(window.ethereum)
        this.setState({ Contractor: window.web3.utils.fromUtf8(target.value) })
    }

    importItem = async() => {
        let itemId = 10000000*this.state.term + 100000*this.state.class + 1000*this.state.task
        if(itemId == 0){
            alert("請選擇工項")
        }
        else{
            let hash = await this.props.inspectionItems(itemId)
            if(hash == ""){
                alert("此工項尚未匯入查驗項目")
            }
            else{
                let url = "https://ipfs.infura.io/ipfs/" + hash
                const items = await fetch(url).then(response => response.json())
                this.setState({ Items: items })
                const itemsState = []
                for(var i = 0; i< this.state.Items.length; i++){
                    itemsState.push(0)
                }
                this.setState({ itemsState })
            }
        }
    }

    create = async(event) => {
        event.preventDefault()
        let sheetId = 10000000*this.state.term + 100000*this.state.class + 1000*this.state.task + this.state.location
        if(sheetId == 0){
            alert("請選擇工項")
        }
        if(this.state.Items.length == 0){
            alert("請匯入查驗項目")
        }
        if(this.state.Contractor == ""){
            alert("請輸入承包商名稱")
        }
        if(this.state.Timing == null){
            alert("請選擇查驗時機")
        }
        else{
            let sc = await this.props.sheetContent(sheetId)
            if(sc._executor != "0x0000000000000000000000000000000000000000"){
                alert("表單已建立")
            }
            else{
                this.props.createSheet(sheetId, this.state.itemsState, this.state.Timing, this.state.Contractor)
            }
        }
    }
    
    render(){
        return(
            <Content>
                <p></p>
                <h1 style={{ fontSize: 20, textAlign: "center"}}>新增查驗表單</h1>
                <p></p>
                { (this.props.Term == null || this.props.Class == null || this.props.Task == null || this.props.Location == null)
                    ? <h1 style={{ fontSize: 16, textAlign: "center" }}>請先至首頁選擇專案</h1>
                    : <Content>
                        <span style={{ fontSize: 16}}>基本資訊</span>
                        <p></p>
                        <span style={{ fontSize: 18}}>表單編號: </span>
                        <Input style={{ width: 100 }} disabled={true} value={10000000*this.state.term + 100000*this.state.class + 1000*this.state.task + this.state.location}/>
                        <span> </span>
                        <span style={{ fontSize: 18}}>工程名稱: </span>
                        <Input style={{ width: 300 }} disabled={true} value={this.props.projectName}/>
                        <p></p>
                        <span style={{ fontSize: 18}}>工程類別: </span>
                        <Select
                            style={{ width: 200 }}
                            onChange={(value) => this.setState({ term: value, class: 0, task: 0, location: 0 })}
                            defaultValue={this.state.term}
                        >
                            {this.props.Term.map((_Term, key) => 
                                <Option value={key} key={key}>{_Term}</Option>
                            )}
                        </Select>
                        <span style={{ fontSize: 18}}> 工程項目: </span>
                        <Select
                            style={{ width: 200 }}
                            onChange={(value) => this.setState({ class: value, task: 0, location: 0 })}
                            defaultValue={this.state.class}
                        >
                            {this.props.Class[this.props.Term[this.state.term]].map((_Class, key) =>
                                <Option value={key} key={key}>{_Class}</Option>
                            )}
                        </Select>
                        <span style={{ fontSize: 18}}> 細部工項: </span>
                        <Select
                            style={{ width: 200 }}
                            onChange={(value) => this.setState({ task: value })}
                            defaultValue={this.state.task}
                        >
                            {this.props.Task[this.props.Class[this.props.Term[this.state.term]][this.state.class]].map((_Task, key) =>
                                <Option value={key} key={key}>{_Task}</Option>
                            )}
                        </Select>
                        <span style={{ fontSize: 18}}> 施工位置: </span>
                        <Select
                            style={{ width: 200 }}
                            onChange={(value) => this.setState({ location: value })}
                            defaultValue={this.state.task}
                        >
                            {this.props.Location[this.props.Task[this.props.Class[this.props.Term[this.state.term]][this.state.class]][this.state.task]].map((_Location, key) =>
                                <Option value={key} key={key}>{_Location}</Option>
                            )}
                        </Select>
                        <p></p>
                        <span style={{ fontSize: 18}}> 承攬廠商: </span>
                        <Input style={{width: 500}} onChange={this.setContractor}/>
                        <p></p>
                        <span style={{ fontSize: 18}}> 檢查時機: </span>
                        <Select style={{ width: 200 }} onChange={(value) => this.setState({ Timing: value })}>
                            <Option value="0" key="0">檢驗停留點</Option>
                            <Option value="1" key="1">施工中檢查</Option>
                            <Option value="2" key="2">施工完成檢查</Option>
                        </Select>
                        <p></p>
                        <span style={{ fontSize: 18}}>查驗項目: </span>
                        <Button onClick={this.importItem}>
                            匯入
                        </Button>
                        <p></p>
                        <List dataSource={this.state.Items} renderItem={item => (
                            <List.Item>{item}</List.Item>
                        )}/>
                        <p></p>
                        <Button onClick={this.create}>
                            新增
                        </Button>
                      </Content>
                    }
            </Content>
        );
    }
}

export default Newsheet;