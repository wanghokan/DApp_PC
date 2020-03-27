import React, { Component } from "react";
import { Table, Layout, Input } from "antd";

const { Content } = Layout

class State extends Component{
    async componentWillMount(){
        if(this.props.projectName != ""){
            let array = []
            for(var i = 1; i < this.props.Term.length; i++){
                let first  = { key: null, name: null, state: null, children: [] }
                first.key = 10000000*i
                first.name = this.props.Term[i]
                for(var j = 1; j < this.props.Class[this.props.Term[i]].length; j++){
                    let second = { key: null, name: null, state: null, children: [] }
                    second.key = 10000000*i + 100000*j
                    second.name = this.props.Class[this.props.Term[i]][j]
                    for(var k = 1; k < this.props.Task[this.props.Class[this.props.Term[i]][j]].length; k++){
                        let third = { key: null, name: null, state: null, children: [] }
                        third.key = 10000000*i + 100000*j + 1000*k
                        third.name = this.props.Task[this.props.Class[this.props.Term[i]][j]][k]
                        for(var l = 1; l < this.props.Location[this.props.Task[this.props.Class[this.props.Term[i]][j]][k]].length; l++){
                            let forth = { key: null, name: null, state: null }
                            let sheets = await this.props.sheetContent(10000000*i + 100000*j + 1000*k + l)
                            //console.log(this.props.Term[i])
                            //console.log(this.props.Class[this.props.Term[i]][j])
                            //console.log(this.props.Task[this.props.Class[this.props.Term[i]][j]][k])
                            //console.log(this.props.Location[this.props.Task[this.props.Class[this.props.Term[i]][j]][k]][l])
                            if(sheets._executor == "0x0000000000000000000000000000000000000000"){
                                forth.state = "表單尚未建立"
                            }
                            else{
                                if(sheets._executed == 0){
                                    forth.state = "表單已建立, 尚未執行查驗"
                                }
                                else{
                                    let falseNum = 0
                                    for(var a = 0; a < sheets._itemsState.length; a++){
                                        if(sheets._itemsState[a] == 2){
                                            falseNum++
                                        }
                                    }
                                    if(falseNum == 0){
                                        forth.state = "表單已建立, 已查驗, 無查驗項目不合格, 查驗時間: " + window.web3.utils.toUtf8(sheets._executeTime) + ", 查驗人員: " + sheets._executor.toString()
                                    }
                                    else{
                                        forth.state = "表單已建立, 已查驗, " + falseNum.toString() + "個查驗項目不合格, 查驗時間: " + window.web3.utils.toUtf8(sheets._executeTime) + ", 查驗人員: " + sheets._executor.toString()
                                    }
                                }
                            }
                            forth.key = 10000000*i + 100000*j + 1000*k + l
                            forth.name = this.props.Location[this.props.Task[this.props.Class[this.props.Term[i]][j]][k]][l]
                            third.children.push(forth)
                        }
                        second.children.push(third)
                    }
                    first.children.push(second)
                }
                array.push(first)
            }
            this.setState({ dataSource: array })
            this.setState({ loaded: false })
        }
    }

    constructor(props){
        super(props)

        this.state={
            dataSource: [],
            loaded: true
        }
    }
    
    render(){
        return(
            <Content>
                <p></p>
                <h1 style={{ fontSize: 20, textAlign: "center" }}>檢視查驗狀態</h1>
                <p></p>
                {(this.props.projectName == "")
                ? <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: 16 }}>請先至首頁選擇專案</span>
                  </div>
                : <div>
                    <span style={{ fontSize: 18}}>工程名稱: </span>
                    <Input style={{ width: 300 }} disabled={true} value={this.props.projectName}/>
                    <p></p>
                    {(this.state.loaded)
                    ? <div style={{ textAlign: "center" }}>
                        <span style={{ fontSize: 16 }}>載入中...</span>
                      </div>
                    : <div>
                        <Table columns={[{title: "工項", dataIndex: "name"}, {title: "狀態", dataIndex: "state"}]} dataSource={this.state.dataSource}/>
                      </div>
                    }
                  </div>
                }
            </Content>
        );
    }
}

export default State