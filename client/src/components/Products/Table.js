import React, {Component} from 'react';
import axios from 'axios';
import { Table, Input, InputNumber, Popconfirm, Form,Divider,Modal,Button, Icon } from 'antd';

import { PRODUCTS, HEADERS, ACTIONS } from '../../constants/defaults';
import Select from '../_partials/Select';

const { NAME, CODE, FIRM, COST, SHOP_QTY, STORE_QTY } = HEADERS;
const { ADD, EDIT, DELETE, SELL } = ACTIONS;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = (data) => {
    switch (this.props.inputType) {
      case 'number': return <InputNumber />;
      case 'select': return <Select options={data} />;
      default:
        return <Input />;
    }
  };

  renderCell = ({ getFieldDecorator }) => {
    const { editing, dataIndex, title, record, children, data, ...restProps } = this.props;
    if (dataIndex === 'firm') {
      console.log(children, record[dataIndex], 777)
    }
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
            })(this.getInput(data))}
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
  state = {
    filteredInfo: {},
    columnKey: undefined,
    order: undefined,
    offset: 0,
    current: 1,
  };

  // getColumnSortProps = dataIndex => ({
  //   sorter: true,
  //   sortOrder: this.state.columnKey === dataIndex && this.state.order,
  // });
  //
  // getColumnSearchProps = dataIndex => ({
  //   filterDropdown: <div style={{ paddingTop: 3 }}>
  //     <Input
  //       placeholder='Enter at least three letters'
  //       // value={this.state.filteredInfo[dataIndex]}
  //       onChange={e => this.onChange(dataIndex, e.target.value)}
  //       style={{ width: 200 }}
  //     />
  //     <div style={{ marginLeft: 2 }}>
  //       <Button size='small' onClick={() => this.clear(dataIndex)}>
  //         Clear
  //       </Button>
  //     </div>
  //   </div>,
  //   filterIcon: () => <Icon icon='search' style={{ color: this.isFiltered(dataIndex) ? '#1890ff' : undefined }} />,
  //   // After FilterDropdown close, unset filter if filtered keyword length is less than minKeywordLength
  //   onFilterDropdownVisibleChange: (visible) => {
  //     if (!visible && this.state.filteredInfo[dataIndex] && this.state.filteredInfo[dataIndex].length < this.props.minKeywordLength) {
  //       this.setState({ filteredInfo: this.getFilteredInfo(dataIndex) });
  //     }
  //   },
  // });


  request = ({ columnKey, order, filters: filterData } = {}) => {
    const {
      request, data, adminId, setFilter,
    } = this.props;
    const filters = filterData === null ? undefined : (filterData || this.state.filteredInfo);
    setFilter({ filters });
    request({
      ...data,
      adminId,
      filters,
      orderBy: columnKey || this.state.columnKey,
      order: (order || this.state.order) === 'ascend' ? 'asc' : 'desc',
      offset: this.state.offset,
    });
  };

  isFiltered = dataIndex => this.state.filteredInfo[dataIndex]
    && this.state.filteredInfo[dataIndex].length >= this.props.minKeywordLength;

  hideClearFilter = () => Object.keys(this.state.filteredInfo).some(item => this.isFiltered(item));

  getFilteredInfo = (dataIndex, value) => ({
    ...this.state.filteredInfo,
    [dataIndex]: value || undefined,
  });

  onChange = (dataIndex, value) => {
    const filteredInfo = this.getFilteredInfo(dataIndex, value);
    this.props.setOffset(0);
    this.setState({ filteredInfo, offset: 0, current: 1 }, () => {
      if (value.length >= this.props.minKeywordLength) {
        this.request({ filters: filteredInfo });
      } else { // unset filter if input value's length is less than minKeywordLength
        this.request({ filters: this.getFilteredInfo(dataIndex) });
      }
    });
  };

  clear = (dataIndex) => {
    const filteredInfo = this.getFilteredInfo(dataIndex);
    this.setState({ filteredInfo });
    this.request({ filters: filteredInfo });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: {} });
    this.request({ filters: null });
  };


  constructor(props) {
    super(props);
    this.state = { firms: [], data: [], editingKey: '' };
    this.columns = [
      {
        title: NAME,
        dataIndex: 'name',
        width: '25%',
        editable: true,
        sortable: true,
        // filterable: true,
      },
      {
        title: CODE,
        dataIndex: 'code',
        editable: true,
        sortable: true,
        // filterable: true,
      },
      {
        title: FIRM,
        dataIndex: 'firm',
        editable: true,
        // sortable: true,
      },
      {
        title: COST,
        dataIndex: 'cost',
        editable: true,
      },
      {
        title: SHOP_QTY,
        dataIndex: 'shop_qty',
        width: '15%',
        editable: true,
      },
      {
        title: STORE_QTY,
        dataIndex: 'store_qty',
        width: '15%',
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
                    form => <a href="#" onClick={() => this.save(form, record._id)} style={{ marginRight: 8 }}><Icon type="save" /></a>
                  }
                </EditableContext.Consumer>
                <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record._id)}>
                  <a>Cancel</a>
                </Popconfirm>
              </span>
          : <span>
              <a disabled={editingKey !== ''} onClick={(event) => {event.stopPropagation(); this.edit(record._id);}}><Icon type="edit" /></a>
              <a disabled={editingKey !== ''}>
                <Popconfirm title="Sure to delete?" onConfirm={event => {console.log(111); event.stopPropagation(); this.delete(record._id);}}>
                  <Icon type="delete" />
                </Popconfirm>
              </a>
            </span>;
        },
      },
    ];
  }

  componentDidMount() {
    const self = this;
    axios.get('http://s-parts.herokuapp.com/api/products')
      .then(function (response) {
        const { data: { data } } = response;
        self.setState({ data: data.map(item => ({ ...item, firm: item.firm.name })) });
      })
      .catch(function (error) {
        console.log(error);
      });
    axios.get('http://s-parts.herokuapp.com/api/firms')
      .then(function (response) {
        const { data: { data } } = response;
        self.setState({ firms: data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.pagination.total < this.props.pagination.total) {
  //     this.setState({ current: 1 });
  //   }
  // }

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
          // update_date: new Date(),
        };


        const self = this;
        axios.put(`http://s-parts.herokuapp.com/api/products/${_id}`, updatedRow)
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
      code: '',
      firm: '',
      cost: '',
      store_qty: '',
      shop_qty: '',
    };
    const newData = [newRow, ...this.state.data];
    this.setState({ data: newData, editingKey: -1 });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  delete(_id) {
    const self = this;
    axios.delete(`http://s-parts.herokuapp.com/api/products/${_id}`)
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
    const { ...otherProps } = this.props;

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
            inputType: col.dataIndex === 'firm' ? 'select' : (col.dataIndex === 'shop_qty' || col.dataIndex === 'store_qty' ? 'number' : 'text'),
            dataIndex: col.dataIndex,
            data:  col.dataIndex === 'firm' ? this.state.firms : undefined,
            title: col.title,
            editing: this.isEditing(record),
        }),
      };

      // const sortedFilteredColumns = col.sortable ? {
      //   ...col,
      //   onCell: record => ({
      //     record,
      //     inputType: col.dataIndex === 'shop_qty' || col.dataIndex === 'store_qty' ? 'number' : 'text',
      //     dataIndex: col.dataIndex,
      //     title: col.title,
      //     editing: this.isEditing(record),
      //   }),
      //   ...this.getColumnSortProps(col.dataIndex),
      // } : col;
      //
      // return col.filterable ? {
      //   ...sortedFilteredColumns,
      //   ...this.getColumnSearchProps(col.dataIndex),
      // } : sortedFilteredColumns;
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
        onRow={(record, rowIndex) => {
          return {
            onClick: () => this.edit(record._id),
          };
        }}
      />
    </EditableContext.Provider>;
  }
}

export default Form.create()(EditableTable);
