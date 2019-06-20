import React, { useRef } from 'react';
import { Modal } from 'antd';
import { MergeContactsForm } from '../MergeContactsForm';

/**
 * On click OK handler
 * @param {object} props - list of properties (form, onSubmit)
 * @return {void}
 */
function onOk(props = {}) {
  const { form, onSubmit } = props;
  form.current.validateFields((errors, values) => {
    const results = Object.keys(values).reduce((accumulator, key) => {
      if (/^\d+$/.test(key) && values[key].action !== 'skip') {
        const { firstName, lastName, phoneNumber, phoneNumberPrefix } = values[key];
        const item = {
          firstName, lastName,
          phoneNumber: `${phoneNumberPrefix}${phoneNumber}`
        };
        accumulator.push(item);
      }
      return accumulator;
    }, []);

    onSubmit(results);
    form.current.resetFields();
  });
}

/**
 * Merge contacts after upload popup
 * @param {object} props - list of properties
 * @returns {*} - popup view
 */
export function MergeContactsModal(props) {
  const { visible, onSubmit, onCancel, data } = props;
  const formInstance = useRef(null);

  return (
    <Modal
      className="merge-contacts-modal"
      title="Merge Contacts (By Phone Numbers)"
      visible={visible}
      data={data}
      onOk={() => { onOk({ onSubmit, form: formInstance }); }}
      onCancel={onCancel}
    >
      <MergeContactsForm ref={formInstance} data={data} />
    </Modal>
  );
}
