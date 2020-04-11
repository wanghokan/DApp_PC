import React, { Component } from "react";
import { Table, Layout, Select, Input, Form, Button } from "antd";
import { HomeOutlined } from '@ant-design/icons';
import ReactToExcel from "react-html-table-to-excel";
import Web3 from "web3";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import Pdf from "react-to-pdf";

const { Content } = Layout
const { Option } = Select
const myRef = React.createRef()
const option = {
    orientation: 'l',
    unit: 'pt',
    format: 'a3'
}

class Sheet extends Component{

    constructor(props){
        super(props)
        
        this.state={
            isSearch: false,
            term: 0,
            class: 0,
            task: 0,
            location: 0,
            items: [],
            itemsState: [],
            time: null,
            executor: null,
            outputAllow: false,
            hashArray: []
        }
    }

    search = async() => {
        window.web3 = new Web3(window.ethereum)
        if(this.state.term == 0 || this.state.class == 0 || this.state.task == 0 || this.state.location == 0){
            alert("請選擇工項")
        }
        else{
            this.setState({ index: (10000000*this.state.term + 100000*this.state.class + 1000*this.state.task + this.state.location) })
            let sheet = await this.props.sheetContent(10000000*this.state.term + 100000*this.state.class + 1000*this.state.task + this.state.location)
            if(sheet._executor == "0x0000000000000000000000000000000000000001"){
                alert("表單尚未填寫")
            }
            if(sheet._executor == "0x0000000000000000000000000000000000000000"){
                alert("表單尚未建立")
            }
            else{
                let falseNum = 0
                this.setState({ hashArray: window.web3.utils.toUtf8(sheet._photo).split("@") })
                for(var i = 0; i < sheet._itemsState.length; i++){
                    if(sheet._itemsState[i] == 2) falseNum++
                }
                if((sheet._executed != 0) && (falseNum == 0)){
                    this.setState({ isSearch: true })
                    const _executeTime = window.web3.utils.toUtf8(sheet._executeTime)
                    this.setState({ time: _executeTime })
                    this.setState({ executor: sheet._executor })
                    const _contractor = window.web3.utils.toUtf8(sheet._contractor)
                    this.setState({ contractor: _contractor })
                    const note = window.web3.utils.toUtf8(sheet._note)
                    this.setState({ note: note.split("@") })
                    let itemsHash = await this.props.inspectionItems(10000000*this.state.term + 100000*this.state.class + 1000*this.state.task)
                    let url = "https://ipfs.infura.io/ipfs/" + itemsHash
                    let items = await fetch(url).then(response => response.json())
                    let is = sheet._itemsState
                    let itemsState = []
                    for(var i = 0; i < is.length; i++){
                        if(is[i] == 0){
                            itemsState.push("空白")
                        }
                        if(is[i] == 1){
                            itemsState.push("合格")
                        }
                        if(is[i] == 2){
                            itemsState.push("有缺失需改正")
                        }
                        if(is[i] == 3){
                            itemsState.push("缺失立即改善")
                        }
                        if(is[i] == 4){
                            itemsState.push("無此查驗項目")
                        }
                    }
                    if(sheet._timing == 0){
                        this.setState({ timing: "檢驗停留點" })
                    }
                    if(sheet._timing == 1){
                        this.setState({ timing: "施工中檢查" })
                    }
                    if(sheet._timing == 2){
                        this.setState({ timing: "施工完成檢查" })
                    }
                    if(sheet._executed == 1){
                        this.setState({ executedState: "初驗合格" })
                    }
                    if(sheet._executed != 1){
                        this.setState({ executedState: "複驗合格" })
                    }
                    this.setState({ items })
                    this.setState({ itemsState })
                }
                else{
                    alert("該項目尚未通過查驗")
                }
            }
        }
    }

    export = () => {

        console.log(document.body)
        console.log(document.getElementById("myTable"))
        html2canvas(document.getElementById("myTable"), { logging: true, letterRendering: 1,  allowTaint: false, useCORS: true }).then((canvas) => {
            var imgData = canvas.toDataURL("image/png")
            var doc = new jsPDF()
            doc.addImage(imgData, "PNG", 6, 5)
            doc.save(this.state.index+".pdf")
            //document.body.appendChild(canvas)
        })
        
/*
        const input = document.getElementById("test")

        console.log(document.body)
        console.log(input)
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/jpeg', 1.0)
            const pdf = new jsPDF('', 'pt', 'a4')
            pdf.addImage(imgData, 'JPEG', 0, 0, 595.28, 592.28/canvas.width * canvas.height )
            pdf.save("test.pdf")
        })
        var doc = new jsPDF();
        var x = document.getElementById("myTable")
        console.log(typeof x)
        // Simple html example
        //doc.autoTable({ html: "#myTable" });
        //doc.save('test.pdf');

        doc.html(x, {
            callback: function (doc) {
              doc.save("test.pdf");
            }
         });
         */
    }

    render(){
        return(
            <Content>
                <p></p>
                <h1 style={{ fontSize: 20, textAlign: "center" }}>匯出查驗表單</h1>
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
                            <span> </span>
                            <Button onClick={this.search}>
                                確認
                            </Button>
                        </div>
                    }
                <p></p>
                { ((this.state.isSearch))
                   ?<div>
                       <Button onClick={this.export}>匯出PDF</Button>
                       <p></p>
                       <div>
                        <table border="1" id="myTable" ref={myRef} style={{ width: 600 }}>
                                <tr>
                                    <td colSpan="5" align="center">{this.props.Task[this.props.Class[this.props.Term[this.state.term]][this.state.class]][this.state.task]+"自主查驗表單 ("+this.state.index+")"}</td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center" }}>工程名稱</td>
                                    <td colSpan="3">{this.props.projectName}</td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center" }}>承攬廠商</td>
                                    <td colSpan="3">{this.state.contractor}</td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center" }}>查驗人員</td>
                                    <td colSpan="3">{this.state.executor}</td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center" }}>查驗時間</td>
                                    <td colSpan="3">{this.state.time}</td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center" }}>查驗位置</td>
                                    <td colSpan="3">{this.props.Location[this.props.Task[this.props.Class[this.props.Term[this.state.term]][this.state.class]][this.state.task]][this.state.location]}</td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center" }}>查驗時機</td>
                                    <td colSpan="3">{this.state.timing}</td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center" }}>查驗狀態</td>
                                    <td colSpan="3">{this.state.executedState}</td>
                                </tr>
                                <tr>
                                    <td colSpan="5" align="center">查驗結果</td>
                                </tr>
                                <tr>
                                    <td colSpan="2" align="center">查驗項目</td>
                                    <td align="center">查驗結果</td>
                                    <td align="center">備註</td>
                                    <td align="center">照片</td>
                                </tr>
                                {this.state.items.map((i, key) => {
                                    return(
                                        <tr key={key} height="125">
                                            <td colSpan="2" style={{ width: 200 }}>{i}</td>
                                            <td style={{ width: 100 }} align="center">{this.state.itemsState[key]}</td>
                                            <td style={{ width: 130 }} align="center">{this.state.note[key]}</td>
                                            <td style={{ width: 170 }} align="center">
                                                {(this.state.hashArray[key] == "")
                                                ? <a></a>
                                                : <img src={"https://ipfs.infura.io/ipfs/"+this.state.hashArray[key]} style={{ width: 160, height: 120 }}></img>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })}
                                <tfoot>
                                    <tr>
                                        <td colSpan="5"></td>
                                    </tr>
                                </tfoot>
                        </table>
                       </div>
                    </div>
                   :<div></div>
                }
            </Content>
        );
    }
}

export default Sheet

/*
                       <Pdf targetRef={myRef} filename={this.state.index} x={6} y={5}>
                        {({ toPdf }) => <Button onClick={toPdf}>匯出PDF</Button>}
                       </Pdf>

                        <ReactToExcel
                            table="inspection sheet"
                            filename={(10000000*this.state.term + 100000*this.state.class + 1000*this.state.task + this.state.location).toString()}
                            buttonText="Export"
                        />
*/