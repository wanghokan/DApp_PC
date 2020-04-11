import React, { Component } from 'react';
import { Layout, Button, Input, Select, } from 'antd';

const { Content } = Layout
const { Option } = Select
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class ItemUpload extends Component{
    
    constructor(props) {
        super(props)  

        this.state = {
            term: 0,
            class: 0,
            task: 0,
            buffer: null,
        }
    }


    captureFile = (event) => {
        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
          this.setState({ buffer: Buffer(reader.result) })
          console.log('buffer', this.state.buffer)
        }
    }

    onSubmit = async(event) => {
        event.preventDefault()
        const itemsId = 10000000*this.state.term + 100000*this.state.class + 1000*this.state.task
        let ii = await this.props.inspectionItems(itemsId)
        if(this.state.buffer == null){
            alert("請上傳查驗項目檔案")
        }
        else{
            if(ii != ""){
                if(window.confirm("此工項查驗項目已上傳，是否取代？")){
                    console.log("Submitting file to ipfs...")
                    ipfs.add(this.state.buffer, (error, result) => {
                    console.log('Ipfs result', result)
                    if(error) {
                        console.error(error)
                        return
                    }
                    this.props.uploadItem(itemsId, result[0].hash)
                    })
                }
                else{
                    return
                }
            }
            else{
                console.log("Submitting file to ipfs...")
                ipfs.add(this.state.buffer, (error, result) => {
                console.log('Ipfs result', result)
                if(error) {
                    console.error(error)
                    return
                }
                    this.props.uploadItem(itemsId, result[0].hash)
                })
            }
        }
    }
    
    render(){
        return(
            <Content style={{ textAlign: "center" }}>
                <p></p>
                <h1 style={{ fontSize: 20 }}>匯入查驗項目</h1>
                <p></p>
                { (this.props.projectName == "")
                ? 
                <div>
                    <span style={{ fontSize: 16 }}>請先至首頁選擇專案</span>
                </div>
                :
                <Content style={{ textAlign: "center" }}>
                    <span style={{ fontSize: 18 }}>工程名稱: </span>
                    <Input style={{ width: 300 }} disabled={true} value={this.props.projectName}/>
                    <p></p>
                    <span style={{ fontSize: 18 }}>工程類別: </span>
                    <Select
                        style={{ width: 300 }}
                        onChange={(value) => this.setState({ term: value, class: 0, task: 0 })}
                        defaultValue={this.state.term}
                    >
                        {this.props.Term.map((_Term, key) => 
                            <Option value={key} key={key}>{_Term}</Option>
                        )}
                    </Select>
                    <p></p>
                    <span style={{ fontSize: 18 }}>工程項目: </span>
                    <Select
                        style={{ width: 300 }}
                        onChange={(value) => this.setState({ class: value, task: 0 })}
                        defaultValue={this.state.class}
                    >
                        {this.props.Class[this.props.Term[this.state.term]].map((_Class, key) =>
                            <Option value={key} key={key}>{_Class}</Option>
                        )}
                    </Select>
                    <p></p>
                    <span style={{ fontSize: 18 }}>細部工項: </span>
                    <Select
                        style={{ width: 300 }}
                        onChange={(value) => this.setState({ task: value })}
                        defaultValue={this.state.task}
                    >
                        {this.props.Task[this.props.Class[this.props.Term[this.state.term]][this.state.class]].map((_Task, key) =>
                            <Option value={key} key={key}>{_Task}</Option>
                        )}
                    </Select>
                    <p></p>
                    <input type="file" onChange={this.captureFile}/>
                    <Button onClick={this.onSubmit}>上傳</Button>
                </Content>
                }
            </Content>
        );
    }
}

export default ItemUpload;