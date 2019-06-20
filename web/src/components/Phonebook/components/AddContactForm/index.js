import React from 'react';
import { Form, Input, Select, Upload, Icon, Divider } from 'antd';
import { VALIDATION } from 'config/constants'

/**
 * Add Contact Form View
 * @type {ConnectedComponentClass<function(*=): *, Omit<FormComponentProps<any>, keyof WrappedFormInternalProps>>}
 */
export const AddContactForm = Form.create({ name: 'addContact' })((props = {}) => {
  const { ref, form } = props;
  const { getFieldDecorator } = form;
  const phonePrefixSelector = getFieldDecorator('phoneNumberPrefix', {
    initialValue: '+49'
  })(
    <Select style={{ width: 70 }}>
      <Select.Option value="+49">+49</Select.Option>
      <Select.Option value="+31">+31</Select.Option>
    </Select>
  );

  return (
    <Form ref={ref}>
      <Form.Item label="Phone Number">
        {getFieldDecorator('phoneNumber', {
          rules: [
            { required: true, message: 'Please input the contact phone number!' },
            { pattern: VALIDATION.PHONE_NUMBER, message: 'Please input the current phone number format!' }
          ]
        })(<Input addonBefore={phonePrefixSelector} style={{ width: '100%' }} />)}
      </Form.Item>

      <Form.Item label="First Name">
        {getFieldDecorator('firstName', {
          rules: [{ required: true, message: 'Please input the contact first name!' }]
        })(<Input />)}
      </Form.Item>

      <Form.Item label="Last Name">
        {getFieldDecorator('lastName', {
          rules: [{ required: true, message: 'Please input the contact last name!' }]
        })(<Input />)}
      </Form.Item>

      <Divider>OR</Divider>
      <p className="text-center">Upload .CSV file with list of contact.</p>

      <Form.Item>
        <div className="dropbox">
          {getFieldDecorator('files', {
            valuePropName: 'fileList',
            getValueFromEvent: e => Array.isArray(e) ? e : e && e.fileList
          })(
            <Upload.Dragger name="files" customRequest={() => { }}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload.</p>
              <p className="ant-upload-hint">Support only CSV format.</p>
            </Upload.Dragger>
          )}
        </div>
      </Form.Item>
    </Form>
  );
});
