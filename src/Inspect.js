import React, { Component } from "react";
import { Layout, Input, Form, Select, Table, Button } from "antd";
import Web3 from "web3";

const { Content } = Layout
const { Option } = Select
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class Inspect extends Component{

    importItem = async() => {
        this.setState({ confirmed: true })
        let itemId = 10000000*this.state.term + 100000*this.state.class + 1000*this.state.task
        let hash = await this.props.inspectionItems(itemId)
        let url = "https://ipfs.infura.io/ipfs/" + hash
        const items = await fetch(url).then(response => response.json())
        let sheetId = 10000000*this.state.term + 100000*this.state.class + 1000*this.state.task + this.state.location
        const sheet = await this.props.sheetContent(sheetId)
        window.web3 = new Web3(window.ethereum)
        this.setState({ contractor: window.web3.utils.toUtf8(sheet._contractor) })
        if(sheet._timing == 0){
            this.setState({ timing: "檢驗停留點" })
        }
        if(sheet._timing == 1){
            this.setState({ timing: "施工中檢查" })
        }
        if(sheet._timing == 2){
            this.setState({ timing: "施工完成檢查" })
        }
        const itemsState = sheet._itemsState
        if(sheet._executed == 0) {
            this.setState({ executed: "初驗"})
        }
        if(sheet._executed >= 1) {
            this.setState({ executed: "複驗"})
        }
        for(var i = 0; i < sheet._itemsState.length; i++){
            itemsState[i] = parseInt(sheet._itemsState[i])
        }
        const Items = []
        const itemsNote = []
        for(var i = 0; i < items.length; i++){
            itemsNote.push("")
            let data = {key: null, inspectionItem: null, state: null}
            data.key = i
            data.inspectionItem = items[i]
            if(itemsState[i] == 0){
                data.state = "空白"
            }
            if(itemsState[i] == 1){
                data.state = "合格"
            }
            if(itemsState[i] == 2){
                data.state = "有缺失需改正"
            }
            if(itemsState[i] == 3){
                data.state = "缺失立即改善"
            }
            if(itemsState[i] == 4){
                data.state = "無此查驗項目"
            }
            Items.push(data)
        }
        this.setState({ itemsNote })
        this.setState({ Items })
        this.setState({ inspectedState: itemsState })
        
    }

    inspectState = (value) => {
        const _inspectedState = this.state.inspectedState
        _inspectedState[value[0]] = value[1]
        this.setState({ inspectedState: _inspectedState })
    }

    inspectNote = ({ target: { id, value } }) => {
        let iN = this.state.itemsNote
        iN[id] = value
        this.setState({ itemsNote: iN })
        console.log(this.state.itemsNote)
    }
/*
    uploadAnnex = (event) => {
        let id = event.target.id
        let buffer = null
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            buffer = Buffer(reader.result)
            console.log(buffer)
            ipfs.add(buffer, (error, result) => {
                console.log('Ipfs result', result)
                if(error) {
                console.error(error)
                return
                }
                console.log(result[0].hash)
                let iA = this.state.itemsAnnex
                iA[id] = result[0].hash
            })
        }
    }
    */

    send = () => {
        window.web3 = new Web3(window.ethereum)
        let sheetId = 10000000*this.state.term + 100000*this.state.class + 1000*this.state.task + this.state.location
        let d = new Date()
        let year = d.getFullYear().toString()
        let month = (d.getMonth() + 1).toString()
        let day = d.getDate().toString()
        let hour = d.getHours().toString()
        let min = d.getMinutes().toString()
        let sec = d.getSeconds().toString()
        let date = (year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec)
        let note = ""
        for(var i = 0; i < this.state.itemsNote.length; i++){
            if(i == (this.state.itemsNote.length-1)){
                note += this.state.itemsNote[i]
            }
            else{
                let s = this.state.itemsNote[i] + "@"
                note += s
            }
        }
        const _note = window.web3.utils.fromUtf8(note)
        this.props.fillSheet(sheetId, this.state.inspectedState, date, _note)
    }


    constructor(props){
        super(props)

        this.state={
            term: 0,
            class: 0,
            task: 0,
            location: 0,
            Items: [],
            executed: "",
            confirmed: false
        }
    }

    render(){
        return(
            <Content>
                <p></p>
                <h1 style={{ fontSize: 20, textAlign: "center" }}>執行查驗</h1>
                <p></p>
                { (this.props.Term == null || this.props.Class == null || this.props.Task == null || this.props.Location == null)
                    ? <h1 style={{ fontSize: 16, textAlign: "center" }}>請先至首頁選擇專案</h1>
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
                        <Button onClick={this.importItem}>
                            確認
                        </Button>
                        <p></p>
                        {(this.state.confirmed == false)
                        ? <div></div>
                        : <div>
                            <span style={{ fontSize: 18}}> 承攬廠商: {this.state.contractor}</span>
                            <p></p>
                            <span style={{ fontSize: 18 }}>查驗時機: {this.state.timing}</span>
                            <p></p>
                            <span style={{ fontSize: 18 }}>查驗次數: {this.state.executed}</span>
                            <p></p>
                            <Table pagination={false}
                                columns={[{title: "查驗項目", dataIndex: "inspectionItem"},
                                        {title: "查驗狀態", dataIndex: "state"},
                                        {title: "查驗結果", render: (item) => (
                                            <Select style={{ width: 160 }} onChange={this.inspectState}>
                                                <Option value={[item.key, 0]}>空白</Option>
                                                <Option value={[item.key, 1]}>合格</Option>
                                                <Option value={[item.key, 2]}>有缺失需改正</Option>
                                                <Option value={[item.key, 3]}>缺失立即改善</Option>
                                                <Option value={[item.key, 4]}>無此查驗項目</Option>
                                            </Select>
                                        )},
                                        {title: "備註", render: (item) => (
                                            <Input id={item.key} onChange={this.inspectNote}></Input>
                                        )}]}
                                dataSource={this.state.Items}/>
                            <p></p>
                            <Button onClick={this.send}>
                                上傳
                            </Button>
                          </div>
                        }
                    </div>
                }
            </Content>
        );
    }
}

export default Inspect