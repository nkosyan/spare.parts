import React, { useEffect, useState } from 'react';
import { Table, Popconfirm, Icon } from 'antd';

import { HEADERS } from '../../constants/defaults';
import { loadSells, deleteSell } from '../../actions/sells';

const { NAME, CODE, FIRM, COST, PRICE, DATE } = HEADERS;

const getColumns = (dataSource, setDataSource) => {
  return [
    {
      title: NAME,
      dataIndex: 'name',
      width: '25%',
    },
    {
      title: CODE,
      dataIndex: 'code',
    },
    {
      title: FIRM,
      dataIndex: 'firm',
    },
    {
      title: COST,
      dataIndex: 'cost',
    },
    {
      title: PRICE,
      dataIndex: 'price',
      width: '20%',
    },
    {
      title: DATE,
      dataIndex: 'date',
      width: '15%',
    },
    // {
    //   dataIndex: 'operation',
    //   render: (text, record) => {
    //     return <span onClick={e => e.stopPropagation()}>
    //       <Popconfirm
    //         title="Ջնջել?"
    //         onConfirm={async () => {
    //           await deleteSell(record._id);
    //           const newData = [...dataSource];
    //           newData.splice(newData.findIndex(({_id}) => record._id === _id), 1);
    //           setDataSource({ data: newData });
    //         }}>
    //         <Icon type="delete" theme="twoTone" style={{ cursor: 'pointer' }} />
    //       </Popconfirm>
    //     </span>;
    //   },
    // },
  ];
};

export default () => {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    async function requestSells() {
      const sells = await loadSells();
      console.log(sells, 3333);
      if (sells) {
        const { data: { data } } = sells;
        setDataSource(data);
      }
    }
    requestSells();
  });
  const columns = getColumns(dataSource, setDataSource);

  return <Table bordered columns={columns} dataSource={dataSource} />
};
