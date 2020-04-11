import React, { Component } from "react";
import  { HashRouter, Route } from "react-router-dom";
import { Layout, Menu, Select, Button } from "antd";
import Navbar from "./Navbar";
import Toolbar from "./Toolbar";
import "./App.css";
import Contract from "./contracts/TheContract.json";
import Web3 from "web3";
import NewProject from "./NewProject";
import Newsheet from "./Newsheet";
import ItemUpload from "./ItemUpload";
import Inspect from "./Inspect";
import Sheet from "./Sheet";
import State from "./State";

const { Header, Footer, Sider, Content } = Layout
const { SubMenu } = Menu
const { Option } = Select

class App extends Component {
  
  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
    //var str = window.web3.utils.fromUtf8("@@@測試@這是測試@@")
    //console.log(str)
    //console.log(window.web3.utils.toUtf8(str))
    //console.log(window.location.href.toString())
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networksId = await web3.eth.net.getId()
    const networkData = Contract.networks[networksId]
    if(networkData) {
      const contract = new web3.eth.Contract(Contract.abi, networkData.address)
      const len = await contract.methods.projectIndex().call()
      const projects = []
      for(var i = 0; i < len; i++){
        let p = await contract.methods.projects(i).call()
        projects.push(web3.utils.toUtf8(p.name))
      }
      this.setState({ contract })
      this.setState({ projects })
    } else{
      window.alert('AutonomousInspectIon contract not deployed to detected network.')
    }
    //const sheet = await this.state.contract.methods.sheetContent(0, 10101001).call()
    //console.log(sheet)
  }

  importWBS = async() => {
    if(this.state.project == null){
      alert("請先選擇專案")
    }
    else{
      let proj = await this.state.contract.methods.projects(this.state.project).call()
      let wbshash = proj.wbs
      let url = "https://ipfs.infura.io/ipfs/" + wbshash
      const wbs = await fetch(url).then(response => response.json())
      this.setState({ Term: wbs.term })
      this.setState({ Class: wbs.class })
      this.setState({ Task: wbs.task })
      this.setState({ Location: wbs.location })
      this.setState({ projectName: window.web3.utils.toUtf8(proj.name) })
    }
  }

  constructor(props){
    super(props)

    this.state={
      account: null,
      contract: null,
      projects: [],
      Term: null,
      Class: null,
      Task: null,
      Location: null,
      project: null,
      projectName: ""
    }

    this.createSheet = this.createSheet.bind(this)
    this.createProject = this.createProject.bind(this)
    this.uploadItem = this.uploadItem.bind(this)
    this.inspectionItems = this.inspectionItems.bind(this)
    this.sheetContent = this.sheetContent.bind(this)
    this.sheet_state = this.sheet_state.bind(this)
    this.fillSheet = this.fillSheet.bind(this)
  }

  //智能合約中的function或data
  //於區塊鏈上建立新的查驗表單，記錄表單編號及查驗項目個數
  createSheet(sheetId, itemsState, timing, contractor){
    this.state.contract.methods.createSheet(this.state.project, sheetId, itemsState, timing, contractor).send({ from: this.state.account }).once("receipt", (receipt) => { console.log("receipt") })
  }
  //於區塊鏈上紀錄已上傳至IPFS的WBS之HASH值
  createProject(name, ipfshash){
    this.state.contract.methods.createProject(name, ipfshash).send({ from: this.state.account }).once("receipt", (receipt) => { console.log("receipt") })
  }
  //於區塊鏈上紀錄已上傳至IPFS的查驗項目，紀錄對應工項及HASH值
  uploadItem(itemId, ipfshash){
    this.state.contract.methods.uploadItem(this.state.project, itemId, ipfshash).send({ from: this.state.account }).once("receipt", (receipt) => { console.log("receipt") })
  }
  //取得區塊鏈上某工項之查驗項目的HASH值
  inspectionItems(itemId){
    return this.state.contract.methods.inspectionItems(this.state.project, itemId).call()
  }
  //取得區塊鏈上某查驗表單的內容
  sheetContent(sheetId){
    return this.state.contract.methods.sheetContent(this.state.project, sheetId).call()
  }
  //取得區塊鏈上某查驗表單的各查驗項目之狀態
  sheet_state(sheetId){
    return this.state.contract.methods.sheet_state(sheetId).call()
  }
  //對區塊鏈上某查驗表單的內容進行修改(填表)
  fillSheet(sheetId, state, date, note){
    this.state.contract.methods.fillSheet(this.state.project, sheetId, state, date, note).send({ from: this.state.account }).once("receipt", (receipt) => { console.log("receipt") })
  }

  render() {
    return (
      <Layout>
        <Navbar account={this.state.account} projectName={this.state.projectName}/>
        <HashRouter basename="/">
        <Layout>
          <Sider theme="light">
            <Toolbar/>
          </Sider>
          <Content style={{ marginLeft: 20, marginRight: 20 }} className="content">
            <div>
                <Route exact path="/">
                  <p></p>
                  <section style={{ textAlign: "center" }}>
                    <h1 style={{ fontSize: 20 }}>首頁</h1>
                    <span style={{ fontSize: 18 }}>請選擇專案: </span>
                    <Select style={{ width: 500 }} onChange={(value) => this.setState({ project: value })}>
                      {this.state.projects.map((p, k) =>
                          <Option key={k} value={k}>{p}</Option>
                      )}
                    </Select>
                    <span> </span>
                    <Button style={{ width: 100 }} onClick={this.importWBS}>確認</Button>
                  </section>
                </Route>
                <Route path="/newproject">
                  <NewProject createProject={this.createProject}/>
                </Route>
                <Route path="/itemupload">
                  <ItemUpload projectName={this.state.projectName} 
                              Term={this.state.Term} 
                              Class={this.state.Class} 
                              Task={this.state.Task} 
                              uploadItem={this.uploadItem}
                              inspectionItems={this.inspectionItems}/>
                </Route>
                <Route path="/newsheet">
                  <Newsheet projectName={this.state.projectName} 
                            Term={this.state.Term} 
                            Class={this.state.Class} 
                            Task={this.state.Task} 
                            Location={this.state.Location} 
                            inspectionItems={this.inspectionItems}
                            sheetContent={this.sheetContent}
                            createSheet={this.createSheet}/>
                </Route>
                <Route path="/inspect">
                  <Inspect projectName={this.state.projectName}
                          Term={this.state.Term}
                          Class={this.state.Class} 
                          Task={this.state.Task} 
                          Location={this.state.Location} 
                          inspectionItems={this.inspectionItems}
                          sheetContent={this.sheetContent}
                          fillSheet={this.fillSheet}/>
                </Route>
                <Route path="/sheet">
                  <Sheet projectName={this.state.projectName}
                        Term={this.state.Term} 
                        Class={this.state.Class}
                        Task={this.state.Task} 
                        Location={this.state.Location} 
                        sheetContent={this.sheetContent}
                        inspectionItems={this.inspectionItems}/>
                </Route>
                <Route path="/state">
                  <State Term={this.state.Term} 
                        Class={this.state.Class} 
                        Task={this.state.Task} 
                        Location={this.state.Location} 
                        sheetContent={this.sheetContent}
                        projectName={this.state.projectName}/>
                </Route>
            </div>
          </Content>          
        </Layout>
        </HashRouter>
      </Layout>
    );
  }
}

export default App;

/*
            <Route path="/photos">
              <Photos Term={this.state.Term} 
                      Class={this.state.Class} 
                      Task={this.state.Task} 
                      Location={this.state.Location}
                      projectName={this.state.projectName}
                      sheetContent={this.sheetContent}/>
            </Route>
            */
