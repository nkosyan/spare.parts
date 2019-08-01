import React from 'react';
import axios from "axios";
import { Table, Input, InputNumber, Popconfirm, Form, Button, Icon } from 'antd';

import { HEADERS, ACTIONS } from '../../constants/defaults';

const { NAME, CODE, FIRM, COST, SHOP_QTY, STORE_QTY } = HEADERS;
const { ADD, CANCEL, EDIT, DELETE, SELL } = ACTIONS;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => this.props.inputType === 'number' ? <InputNumber /> : <Input />;

  renderCell = ({ getFieldDecorator }) => {
    const { editing, dataIndex, title, record, children, ...restProps } = this.props;
    return <td {...restProps}>
      {
        editing
          ? <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
            </Form.Item>
          : children
      }
    </td>;
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], editingKey: '' };
    this.columns = [
      {
        title: NAME,
        dataIndex: 'name',
        // width: '25%',
        editable: true,
      },
      {
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable
            ? <span>
                <EditableContext.Consumer>
                  {
                    form => <a href="#" onClick={() => this.save(form, record._id)} style={{ marginRight: 8 }}>
                      <Icon type="save" theme="twoTone" twoToneColor="red" />
                    </a>
                  }
                </EditableContext.Consumer>
                <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record._id)}>
                  <Icon type="stop" theme="twoTone" twoToneColor="red" />
                </Popconfirm>
              </span>
          : <span>
              <a disabled={editingKey !== ''} onClick={() => this.edit(record._id)}>
                <Icon type="edit" theme="twoTone" twoToneColor="red" />
              </a>
              <a disabled={editingKey !== ''}>
                <Popconfirm title="Sure to delete?" onConfirm={() => this.delete(record._id)}>
                  <Icon type="delete" theme="twoTone" twoToneColor="red" />
                </Popconfirm>
              </a>
            </span>;
        },
      },
    ];
  }

  componentDidMount() {
    const self = this;
    axios.get('http://s-parts.herokuapp.com/api/firms')
      .then(function (response) {
        const { data: { data } } = response;
        self.setState({ data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  isEditing = record => record._id === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, _id) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => _id === item._id);
      if (index > -1) {
        const updatedRow = {
          ...newData[index],
          ...row,
        };


        const self = this;
        axios.put(`http://s-parts.herokuapp.com/api/firms/${_id}`, updatedRow)
          .then(function (response) {
            const { data: { data } } = response;
            newData.splice(index, 1, data);
            self.setState({ data: newData, editingKey: '' });
          })
          .catch(function (error) {
            console.log(error);
          });


      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  add() {
    const index = this.state.data.findIndex(item => -1 === item._id);
    if (index > -1) {
      return;
    }
    const newRow = {
      _id: -1,
      name: '',
    };
    const newData = [newRow, ...this.state.data];
    this.setState({ data: newData, editingKey: -1 });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  delete(_id) {
    const self = this;
    axios.delete(`http://s-parts.herokuapp.com/api/firms/${_id}`)
      .then(function (response) {
        const newData = [...self.state.data];
        const index = newData.findIndex(item => _id === item._id);
        if (index > -1) {
          newData.splice(index, 1);
          self.setState({ data: newData });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const components = {
      body: {
          cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
            record,
            inputType: col.dataIndex === 'shop_qty' || col.dataIndex === 'store_qty' ? 'number' : 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: this.isEditing(record),
        }),
      };
    });

    return <EditableContext.Provider value={this.props.form}>
      <Button onClick={() => this.add()}>
        {ADD}
      </Button>
      <Table
        components={components}
        bordered
        dataSource={this.state.data}
        columns={columns}
        rowClassName="editable-row"
        pagination={{
            onChange: this.cancel,
        }}
      />
    </EditableContext.Provider>;
  }
}

export default Form.create()(EditableTable);
