import React from 'react';
import axios from "axios";
import { Table, Input, Popconfirm, Form, Button, Icon } from 'antd';

import { HEADERS, ACTIONS } from '../../constants/defaults';
import { loadFirms, saveFirm, deleteFirm } from '../../actions/firms';

const { NAME } = HEADERS;
const { ADD } = ACTIONS;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  renderCell = ({ getFieldDecorator }) => {
    const { editing, dataIndex, record, children, ...restProps } = this.props;
    return <td {...restProps}>
      {
        editing
          ? <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: '*',
                },
              ],
              initialValue: record[dataIndex],
            })(<Input />)}
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
          return this.isEditing(record)
            ? <span>
                <EditableContext.Consumer>
                  {
                    form => <a onClick={ e => { e.stopPropagation(); this.save(form, record._id) }} style={{ marginRight: 8 }}>
                      <Icon type="save" theme="twoTone" />
                    </a>
                  }
                </EditableContext.Consumer>
                <a onClick={e => { e.stopPropagation(); this.cancel(record._id) }}>
                  <Icon type="stop" theme="twoTone" />
                </a>
              </span>
          : <span>
              <Icon type="edit" theme="twoTone" />
              <a onClick={e => e.stopPropagation()}>
                <Popconfirm title="Ջնջել?" onConfirm={() => this.delete(record._id)}>
                  <Icon type="delete" theme="twoTone" />
                </Popconfirm>
              </a>
            </span>;
        },
      },
    ];
  }

  componentDidMount = async () => {
    const { data: { data } } = await loadFirms();
    this.setState({ data });
  };

  isEditing = ({ _id }) => _id === this.state.editingKey;

  cancel = () => this.setState({ editingKey: '' });

  add = () => {
    if (this.state.data.findIndex(({ _id }) => -1 === _id) > -1) return;

    this.setState({ data: [{
        _id: -1,
        name: '',
      },
      ...this.state.data,
    ], editingKey: -1 });
  };

  edit = key => this.setState({ editingKey: key });

  save = (form, id) => form.validateFields(async (error, row) => {
    if (error) return;

    const newData = [...this.state.data];
    const index = newData.findIndex(({ _id }) => id === _id);
    if (index > -1) {
      const updatedRow = {
        ...newData[index],
        ...row,
      };
      const { data: { data } } = await saveFirm(updatedRow);
      newData.splice(index, 1, data);
      this.setState({ data: newData, editingKey: '' });
    } else {
      newData.push(row);
      this.setState({ data: newData, editingKey: '' });
    }
  });

  delete = async (id) => {
    await deleteFirm(id);
    const newData = [...this.state.data];
    const index = newData.findIndex(({ _id }) => id === _id);
    if (index > -1) {
      newData.splice(index, 1);
      this.setState({ data: newData });
    }
  };

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
        onRow={(record) => {
          return {
            onClick: () => this.edit(record._id),
          };
        }}
      />
    </EditableContext.Provider>;
  }
}

export default Form.create()(EditableTable);
