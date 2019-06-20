import React, { useRef } from 'react';
import { Modal } from 'antd';
import { getProp } from 'utils/helpers';
import { AddContactForm } from '../AddContactForm';

/**
 * On click OK handler
 * @param {object} props - list of properties (form, onSubmit)
 * @return {void}
 */
function onOk(props = {}) {
  const { form, onSubmit } = props;
  form.current.validateFields((errors, values) => {
    const { phoneNumberPrefix, phoneNumber, firstName, lastName } = values;
    const files = getProp(values, 'files', []);

    if (getProp(values, 'files', []).length > 0) {
      onSubmit({ files: files.map(file => file.originFileObj) });
    } else if (errors) {
      return;
    } else {
      onSubmit({
        phoneNumber: `${phoneNumberPrefix}${phoneNumber}`,
        firstName,
        lastName
      });
    }

    form.current.resetFields();
  });
}

/**
 * Get add contact popup
 * @param {object} props - list of properties
 * @returns {*} - popup view
 */
export function AddContactModal(props) {
  const { visible, onSubmit, onCancel } = props;
  const formInstance = useRef(null);

  return (
    <Modal
      title="Create A New Contact"
      visible={visible}
      onOk={() => { onOk({ onSubmit, form: formInstance }); }}
      onCancel={onCancel}
    >
      <AddContactForm ref={formInstance} />
    </Modal>
  );
}
