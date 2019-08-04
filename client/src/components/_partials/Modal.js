import React from 'react';
import { Modal, InputNumber, Button } from 'antd';

import { ACTIONS } from '../../constants/defaults';

class ModalComponent extends React.Component {
  handleOk = () => this.props.setVisible(false);

  handleCancel = () => this.props.setVisible(false);

  render() {
    const { name, code, firm } = this.props.product || {};
    return <Modal
      title='Վաճառ'
      visible={this.props.visible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      footer={[
        <Button key="back" onClick={this.handleCancel}>
          {ACTIONS.CANCEL}
        </Button>,
        <Button key="submit" type="primary" onClick={this.handleOk}>
          {ACTIONS.SELL}
        </Button>,
      ]}
    >
      <p>{name}</p>
      <p>{code}</p>
      <p>{firm}</p>
      <InputNumber placeholder='qanak' />
      <InputNumber placeholder='gin' />
    </Modal>;
  }
}

export default ModalComponent;
