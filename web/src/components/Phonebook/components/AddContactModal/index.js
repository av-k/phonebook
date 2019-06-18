import React, { useState } from 'react';
import { Modal } from 'antd';

/**
 * Get add contact popup
 * @param {object} props - list of properties
 * @returns {*} - popup view
 */
export function AddContactsModal(props) {
  const { visible, onOk, onCancel } = props;

  return (
    <Modal
      title="Add Contact"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
    >
      <p>Contact fields...</p>
    </Modal>
  );
}
