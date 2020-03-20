import React, { Component } from "react";
import { Layout, Table } from "antd";
import ReactToExcel from "react-html-table-to-excel";

const { Content } = Layout
const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ]
  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ]

class Test extends Component{

  async componentWillMount(){
    let str = "test1-test2-test3"
    let s = str.split("-")
    console.log(s[0])
  }

    render(){
        return(
            <Content>
                <Table id="test" columns={columns} dataSource={dataSource}/>
                <ReactToExcel
                    table="test"
                    filename="test"
                    sheet="sheet1"
                    buttonText="export"
                />
            </Content>
        );
    }
}

export default Test