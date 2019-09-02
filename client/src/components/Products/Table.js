import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button, Icon } from 'antd';

import { HEADERS, ACTIONS } from '../../constants/defaults';
import Select from '../_partials/Select';
import SellModal from '../_partials/SellModal';
import { loadFirms } from '../../actions/firms';
import { loadProducts, saveProduct, deleteProduct } from '../../actions/products';

const { NAME, CODE, FIRM, COST, SHOP_QTY, STORE_QTY } = HEADERS;
const { ADD } = ACTIONS;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = (options) => {
    switch (this.props.inputType) {
      case 'number': return <InputNumber />;
      case 'select': return <Select options={options} />;
      default:
        return <Input />;
    }
  };

  renderCell = ({ getFieldDecorator }) => {
    const { editing, dataIndex, record, children, data, ...restProps } = this.props;
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
    visible: false,
    record: null,
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
    const column = [
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
      }
    ];
    this.columns = localStorage.getItem('isAdmin') === 'true' ? [
      ...column,
      {
        dataIndex: 'operation',
        render: (text, record) => {
          return this.isEditing(record)
            ? <span>
                <EditableContext.Consumer>
                  {
                    form => <span onClick={e => { e.stopPropagation(); this.save(form, record._id) }} style={{ marginRight: 8 }}>
                      <Icon type="save" theme="twoTone" style={{ cursor: 'pointer' }} />
                    </span>
                  }
                </EditableContext.Consumer>
                <span onClick={e => { e.stopPropagation(); this.cancel(record._id) }}>
                  <Icon type="stop" theme="twoTone" style={{ cursor: 'pointer' }} />
                </span>
              </span>
            : <span>
                <Icon type="edit" theme="twoTone" style={{ cursor: 'pointer' }} />
                <span onClick={e => e.stopPropagation()}>
                  <Popconfirm title="Ջնջել?" onConfirm={() => this.delete(record._id)}>
                    <Icon type="delete" theme="twoTone" style={{ cursor: 'pointer' }} />
                  </Popconfirm>
                </span>
                <span onClick={e => { e.stopPropagation(); this.setState({ record }); this.setVisible(true); }}>
                  <Icon type="shopping" theme="twoTone" style={{ cursor: 'pointer' }} />
                </span>
              </span>;
        },
      },
    ] : [
      ...column,
      {
        dataIndex: 'operation',
        render: (text, record) => <span onClick={e => { e.stopPropagation(); this.setState({ record }); this.setVisible(true); }}>
          <Icon type="shopping" theme="twoTone" style={{ cursor: 'pointer' }} />
        </span>,
      },
    ];
  }

  componentDidMount = async () => {
    const { data } = await loadProducts();
    const { data: firms } = await loadFirms();
    this.setState({
      data: data.map(item => ({ ...item, firm: item.firm ? item.firm.name : undefined })),
      firms
    });
  };

  // componentDidUpdate(prevProps) {
  //   if (prevProps.pagination.total < this.props.pagination.total) {
  //     this.setState({ current: 1 });
  //   }
  // }

  isEditing = ({ _id }) => _id === this.state.editingKey;

  cancel = () => this.setState({ editingKey: '' });

  save = (form, id) => form.validateFields(async (error, row) => {
    if (error) return;

    const newData = [...this.state.data];
    const index = newData.findIndex(({ _id }) => id === _id);
    if (index > -1) {
      const updatedRow = {
        ...newData[index],
        ...row,
      };
      const { data } = await saveProduct(updatedRow);
      newData.splice(index, 1, data);
      this.setState({ data: newData, editingKey: '' });
    } else {
      newData.push(row);
      this.setState({ data: newData, editingKey: '' });
    }
  });

  add = () => {
    if (this.state.data.findIndex(({ _id }) => -1 === _id) > -1) return;

    this.setState({ data: [{
        _id: -1,
        name: '',
        code: '',
        firm: '',
        cost: '',
        store_qty: '',
        shop_qty: '',
      },
        ...this.state.data,
      ], editingKey: -1 });
  };

  edit = key => this.setState({ editingKey: key });

  delete = async (id) => {
    await deleteProduct(id);
    const newData = [...this.state.data];
    const index = newData.findIndex(({ _id }) => id === _id);
    if (index > -1) {
      newData.splice(index, 1);
      this.setState({ data: newData });
    }
  };

  setVisible = (visible) => this.setState({ visible });

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
      {localStorage.getItem('isAdmin') === 'true' && <Button type="primary" onClick={this.add}>{ADD}</Button>}
      <Table
        components={components}
        bordered
        dataSource={this.state.data}
        columns={columns}
        rowClassName="editable-row"
        pagination={{ onChange: this.cancel }}
        onRow={({ _id  }) => ({ onClick: () => this.edit(_id) })}
      />
      <SellModal visible={this.state.visible} setVisible={this.setVisible} product={this.state.record} />
    </EditableContext.Provider>;
  }
}

export default Form.create()(EditableTable);
