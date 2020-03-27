import React, { Component } from "react";
import { Upload, Button, Icon, Layout, Input } from 'antd';
import Web3 from "web3";

const { Content } = Layout
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values

class NumberUpload extends Component{
    
    
    constructor(props){
        super(props)
        
        this.state={
            buffer: null,
            name: null
        }
    }

    name = ({target}) => {
        window.web3 = new Web3(window.ethereum)
        var name = target.value
        var hex = window.web3.utils.fromUtf8(name)
        this.setState({ name: hex })
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
    
    onSubmit = (event) => {
        event.preventDefault()
        console.log("Submitting file to ipfs...")
        ipfs.add(this.state.buffer, async(error, result) => {
            console.log('Ipfs result', result)
            if(error) {
            console.error(error)
            return
            }
            //let url = "https://ipfs.infura.io/ipfs/" + result[0].hash
            //const wbs = await fetch(url).then(response => response.json())
            //if(wbs.term != undefined && wbs.class != undefined && wbs.task != undefined && wbs.location != undefined){
            //    console.log("ok")
            //}
            //else{
            //    console.log("error")
            //}
            this.props.createProject(this.state.name, result[0].hash)
        })
    }
    
    render(){
        return(
            <Content style={{ textAlign: "center" }}>
                <p></p>
                <h1 style={{ fontSize: 20 }}>建立專案</h1>
                <p></p>
                <span style={{ fontSize: 18 }}>工程名稱: </span>
                <Input id="1" style={{ width: 500 }} onChange={this.name}/>
                <p></p>
                <input type="file" accept=".json" onChange={this.captureFile}/>
                <span> </span>
                <Button onClick={this.onSubmit}>
                    上傳
                </Button>
            </Content>
        );
    }
}

export default NumberUpload;