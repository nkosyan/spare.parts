import React from 'react';
import { Table, Input, Popconfirm, Form, Button, Icon } from 'antd';

import { HEADERS, ACTIONS } from '../../constants/defaults';
import { loadFirms, saveFirm, deleteFirm } from '../../actions/firms';

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
    this.state = {
      filteredInfo: {},
      data: [],
      editingKey: '',
    };
    const name = {
      title: HEADERS.NAME,
      dataIndex: 'name',
      editable: true,
      sortable: true,
      filterable: true,
    };
    this.columns = localStorage.getItem('isAdmin') === 'true' ? [
      name,
      {
        dataIndex: 'operation',
        render: (text, record) => this.isEditing(record)
          ? <span>
              <EditableContext.Consumer>
                {
                  form => <span onClick={ e => { e.stopPropagation(); this.save(form, record._id) }} style={{ marginRight: 8 }}>
                    <Icon type="save" theme="twoTone" />
                  </span>
                }
              </EditableContext.Consumer>
              <span onClick={e => { e.stopPropagation(); this.cancel(record._id) }}>
                <Icon type="stop" theme="twoTone" />
              </span>
            </span>
          : <span>
              <Icon type="edit" theme="twoTone" />
              <span onClick={e => e.stopPropagation()}>
                <Popconfirm title="Ջնջել?" onConfirm={() => this.delete(record._id)}>
                  <Icon type="delete" theme="twoTone" />
                </Popconfirm>
              </span>
            </span>
      },
    ] : [name];
  }

  componentDidMount = async () => {
    const { data } = await loadFirms();
    this.setState({ data });
  };

  // componentDidUpdate(prevProps) {
  //   if (prevProps.pagination.total < this.props.pagination.total) {
  //     this.setState({ current: 1 });
  //   }
  // }

  getColumnSortProps = dataIndex => ({
    sorter: true,
    sortOrder: this.state.columnKey === dataIndex && this.state.order,
  });


  getColumnSearchProps = dataIndex => ({
    filterDropdown: <div style={{ paddingTop: 3 }}>
      <Input
        placeholder='Enter at least three letters'
        value={this.state.filteredInfo[dataIndex]}
        onChange={e => this.onChange(dataIndex, e.target.value)}
        style={{ width: 200 }}
      />
      <div style={{ marginLeft: 2 }}>
        <Button size='small' onClick={() => this.clear(dataIndex)}>
          Clear
        </Button>
      </div>
    </div>,
    filterIcon: () => <Icon icon='search' style={{ color: this.isFiltered(dataIndex) ? '#1890ff' : undefined }} />,
    // After FilterDropdown close, unset filter if filtered keyword length is less than minKeywordLength
    onFilterDropdownVisibleChange: (visible) => {
      if (!visible && this.state.filteredInfo[dataIndex] && this.state.filteredInfo[dataIndex].length < this.props.minKeywordLength) {
        this.setState({ filteredInfo: this.getFilteredInfo(dataIndex) });
      }
    },
  });

  request = async ({ columnKey, order, filters: filterData } = {}) => {
    // const {
    //   request, data, adminId, setFilter,
    // } = this.props;
    const filters = filterData === null ? undefined : (filterData || this.state.filteredInfo);
    // setFilter({ filters });
    // request({
    //   ...data,
    //   adminId,
    //   filters,
    //   orderBy: columnKey || this.state.columnKey,
    //   order: (order || this.state.order) === 'ascend' ? 1 : -1,
    //   offset: this.state.offset,
    // });

    const { data } = await loadFirms({
      orderBy: columnKey || this.state.columnKey,
      order: (order || this.state.order) === 'ascend' ? 1 : -1,
      filters,
      offset: this.state.offset,
    });
    this.setState({ data });
  };

  isFiltered = dataIndex => this.state.filteredInfo[dataIndex]
    && this.state.filteredInfo[dataIndex].length >= this.props.minKeywordLength;

  hideClearFilter = () => Object.keys(this.state.filteredInfo).some(item => this.isFiltered(item));

  getFilteredInfo = (dataIndex, value) => ({
    ...this.state.filteredInfo,
    [dataIndex]: value || undefined,
  });

  onChange = (dataIndex, value) => {
    const filteredInfo = this.getFilteredInfo(dataIndex, value); console.log(filteredInfo, dataIndex, value, 111)
    // this.props.setOffset(0);
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
      const aa = await saveFirm(updatedRow);console.log(aa)
      newData.splice(index, 1, aa.data);
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
      const sortedFilteredColumns = col.sortable ? {
        ...col,
        onCell: record => ({
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
        ...this.getColumnSortProps(col.dataIndex),
      } : col;

      return col.filterable ? {
        ...sortedFilteredColumns,
        ...this.getColumnSearchProps(col.dataIndex),
      } : sortedFilteredColumns;
    });

    return <EditableContext.Provider value={this.props.form}>
      {localStorage.getItem('isAdmin') === 'true' && <Button type="primary" onClick={this.add}>{ACTIONS.ADD}</Button>}
      <Table
        components={components}
        bordered
        dataSource={this.state.data}
        columns={columns}
        rowClassName="editable-row"
        pagination={{ onChange: this.cancel }}
        onRow={({ _id }) => ({ onClick: () => this.edit(_id) })}
        onChange={(pagination, filters, sorter) => {
          const { columnKey, order } = sorter;
          console.log(columnKey, order, pagination.current, 111)
          this.setState({
            columnKey,
            order,
            // offset: this.props.pagination.onChange(pagination.current),
            current: pagination.current,
          }, this.request);
        }}
      />
    </EditableContext.Provider>;
  }
}

EditableTable.defaultProps = {
  minKeywordLength: 3
};

export default Form.create()(EditableTable);
