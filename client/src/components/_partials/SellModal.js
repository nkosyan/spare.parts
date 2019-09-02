import React from 'react';
import { InputNumber, Button, Form, Modal } from 'antd';

import {QUANTITY, PRICE, ACTIONS, HEADERS} from '../../constants/defaults';
import { createSell } from "../../actions/sells";

const { NAME, CODE, FIRM, COST} = HEADERS;
export default Form.create()((props) => {
  const handleSubmit = () => {
    props.form.validateFields(async (err, values) => {
      if (!err) {
        props.setVisible(false);
        await createSell({
          product: props.product._id,
          cost: props.product.cost,
          ...values
        });
      }
    });
  };
  const { name, code, firm } = props.product || {};
  const { getFieldDecorator } = props.form;
  return <Modal title='Վաճառք' visible={props.visible} footer={null} onCancel={() => props.setVisible(false)}>
    <Form.Item label={NAME}>{name}</Form.Item>
    <Form.Item label={CODE}>{code}</Form.Item>
    <Form.Item label={FIRM}>{firm}</Form.Item>
    <Form onSubmit={handleSubmit}>
      <Form.Item label={QUANTITY}>
        {getFieldDecorator('qty', {
          initialValue: '1',
          rules: [{ required: true, message: '*' }],
        })(
          <InputNumber placeholder={QUANTITY} min='1' max='100' defaultValue='1' />,
        )}
      </Form.Item>
      <Form.Item label={PRICE}>
        {getFieldDecorator('price', {
          rules: [{ required: true, message: '*' }],
        })(
          <InputNumber placeholder={PRICE} />,
        )}
      </Form.Item>
      <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
        {ACTIONS.SELL}
      </Button>
    </Form>
  </Modal>;
});
