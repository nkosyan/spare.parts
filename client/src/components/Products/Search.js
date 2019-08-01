import React, { Fragment } from 'react';
import { Input, Button } from 'antd';

export default (dataIndex) => <Fragment style={{ padding: 8 }}>
  <Input
    placeholder={`Search ${dataIndex}`}
    onChange={e => console.log(e.target.value)}
    onPressEnter={() => console.log('Enter')}
    style={{ width: 188, marginBottom: 8, display: 'block' }}
  />
  <Button
    type="primary"
    onClick={() => console.log('Search click')}
    icon="search"
    size="small"
    style={{ width: 90, marginRight: 8 }}
  >
    Search
  </Button>
  <Button onClick={() => console.log('Reset click')} size="small" style={{ width: 90 }}>
    Reset
  </Button>
</Fragment>;