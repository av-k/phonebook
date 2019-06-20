import React, { Fragment } from 'react';
import { Form, Input, Select, Radio, Alert, Divider } from 'antd';
import './index.scss';

/**
 * Get list of rows - views
 * @param {array} list - list of conflicts (data)
 * @param {function} getFieldDecorator - specific decorator for form fields
 * @param {function} getPhonePrefixSelector - helper for phone prefix (country code)
 * @returns {any[]} - list of rows
 */
export function getConflictRows(list = [], { getFieldDecorator, getPhonePrefixSelector }) {
  return list.map(({ original, conflict }, index) => {
    const countryCode = conflict.phoneNumber.match(/^\+*[0-9]{2}/) || undefined;
    return (
      <Fragment key={index}>
        <Divider><b>{index + 1}</b></Divider>

        <Form.Item label="Phone Number">
          {/* OLD */}
          <span className="aside-input-title aside-input-title-old">old:</span>
          {getFieldDecorator(`phoneNumber`, {
            initialValue: original.phoneNumber.replace(countryCode, '')
          })(<Input addonBefore={getPhonePrefixSelector({ initialValue: countryCode, index })}
                    style={{ width: '100%' }} disabled />)}
          {/* NEW */}
          <span className="aside-input-title aside-input-title-new">new:</span>
          {getFieldDecorator(`${index}.phoneNumber`, {
            initialValue: conflict.phoneNumber.replace(countryCode, '')
          })(<Input addonBefore={getPhonePrefixSelector({ initialValue: countryCode, index })}
                    style={{ width: '100%' }} disabled />)}
        </Form.Item>

        <Form.Item label="First Name">
          {/* OLD */}
          <span className="aside-input-title aside-input-title-old">old:</span>
          {getFieldDecorator(`originalFirstName`, {
            initialValue: original.firstName
          })(<Input disabled />)}
          {/* NEW */}
          <span className="aside-input-title aside-input-title-new">new:</span>
          {getFieldDecorator(`${index}.firstName`, {
            initialValue: conflict.firstName
          })(<Input disabled />)}
        </Form.Item>

        <Form.Item label="Last Name">
          {/* OLD */}
          <span className="aside-input-title aside-input-title-old">old:</span>
          {getFieldDecorator(`originalLastName`, {
            initialValue: original.lastName
          })(<Input disabled />)}
          {/* NEW */}
          <span className="aside-input-title aside-input-title-new">new:</span>
          {getFieldDecorator(`${index}.lastName`, {
            initialValue: conflict.lastName
          })(<Input disabled />)}
        </Form.Item>

        <Form.Item label="Action">
          {getFieldDecorator(`${index}.action`, {
            initialValue: 'replace'
          })(
            <Radio.Group>
              <Radio.Button value="replace">Replace</Radio.Button>
              <Radio.Button value="skip">Skip</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>

      </Fragment>
    );
  });
}

/**
 * Merge Contacts Form View
 * @type {ConnectedComponentClass<function(*=): *, Omit<FormComponentProps<any>, keyof WrappedFormInternalProps>>}
 */
export const MergeContactsForm = Form.create({ name: 'addContact' })((props = {}) => {
  const { ref, form, data = [] } = props;
  const { getFieldDecorator } = form;
  const getPhonePrefixSelector = ({ initialValue = '+49', style = { width: 70 }, index }) => (
    getFieldDecorator(`${index}.phoneNumberPrefix`, {
      initialValue
    })(
      <Select style={style} disabled>
        <Select.Option value="+49">+49</Select.Option>
        <Select.Option value="+31">+31</Select.Option>
      </Select>
    )
  );
  const rows = getConflictRows(data, { getFieldDecorator, getPhonePrefixSelector });

  return (
    <Fragment>
      <Alert message={`${data.length} conflicting records found.`} type="error" style={{ marginBottom: '20px' }} />
      <Form ref={ref} className="merge-contacts-form">
        {rows}
      </Form>
    </Fragment>
  );
});
