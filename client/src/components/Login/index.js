import React, { useEffect } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { withRouter } from 'react-router-dom';

import { loginUser } from '../../actions/users';
const { Item } = Form;

export default withRouter(Form.create({ name: 'normal_login' })(props => {
  useEffect(() => {
    if (localStorage.getItem('token')) {
      props.history.push('/Products');
    }
  });

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { data: { success, token, isAdmin }} = await loginUser(values);
        if (success) {
          localStorage.setItem('token', token)
          localStorage.setItem('isAdmin', isAdmin)
        }
        props.history.push('/Products');
      }
    });
  };

  const {getFieldDecorator} = props.form;

  return <Form onSubmit={handleSubmit} className="login-form" style={{ marginTop: '15px' }}>
    <Item>
      {getFieldDecorator('username', {
        rules: [{required: true, message: 'Please input your username!'}],
      })(
        <Input
          prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
          placeholder="Username"
        />,
      )}
    </Item>
    <Item>
      {getFieldDecorator('password', {
        rules: [{required: true, message: 'Please input your Password!'}],
      })(
        <Input
          prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
          type="password"
          placeholder="Password"
        />,
      )}
    </Item>
    <Item>
      <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
        Log in
      </Button>
    </Item>
  </Form>;
}));
