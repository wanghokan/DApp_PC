import React, { Component } from "react";
import { Table, Layout } from "antd";

const { Content } = Layout

class Sheets extends Component{
    
    async componentWillMount(){
        console.log(this.props.Term)
        if(this.props.Term != null){
            let array = []
            for(var i = 1; i < this.props.Term.length; i++){
                for(var j = 1; j < this.props.Class[this.props.Term[i]].length; j++){
                    for(var k = 1; k < this.props.Task[this.props.Class[this.props.Term[i]][j]].length; k++){
                        for(var l = 1; l < this.props.Location[this.props.Task[this.props.Class[this.props.Term[i]][j]][k]].length; l++){
                            let data = { index: null, state: null }
                            let index = 10000000*i + 100000*j + 1000*k + l
                            let sheetState = await this.props.sheets(index)
                            console.log(sheetState.executeTime)
                            data.index = index
                            if(sheetState.executor == "0x0000000000000000000000000000000000000000"){
                                data.state = "尚未建立"
                            }
                            else{
                                if(sheetState.executed == false){
                                    data.state = "已建立, 未查驗"
                                }
                                else{
                                    let stateArray = await this.props.sheet_state(index)
                                    let falseNum = 0
                                    for(var a = 0; a < stateArray.length; a++){
                                        if(stateArray[a] != true){
                                            falseNum++
                                        }
                                    }
                                    if(falseNum == 0){
                                        data.state = "已建立, 已查驗, 無查驗項目不合格, 查驗時間: " + sheetState.executeTime.toString()
                                    }
                                    else{
                                        data.state = "已建立, 已查驗, " + falseNum.toString() + "個查驗項目不合格, 查驗時間: " + sheetState.executeTime.toString()
                                    }
                                }
                            }
                            array.push(data)
                        }
                    }
                }
            }
            this.setState({ sheets: array })
        }
    }
    
    constructor(props){
        super(props)

        this.state={
            sheetsIndex: [],
            sheets: []
        }
    }

    render(){
        return(
            <Content>
                <h1>Sheets</h1>
                <Table columns={[{ title:"index", dataIndex:"index" }, { title:"state", dataIndex:"state" }]} dataSource={this.state.sheets}/>
            </Content>
        );
    }
}

export default Sheets;