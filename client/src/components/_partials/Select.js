import React from 'react';
import { Select } from 'antd';

const { Option } = Select;
export default (props) => <Select style={{ width: 120 }} placeholder='Ընտրել' labelInValue {...props}>
  {props.options.map(item => <Option value={item._id}>{item.name}</Option>)}
</Select>;
