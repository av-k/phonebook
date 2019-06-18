import React from 'react';
import { Table, Pagination, Icon, Tooltip, Popconfirm } from 'antd';

/**
 * Get columns structure
 * @param {object} props - list of properties
 * @returns {*[]} - columns structure
 */
export function getColumns(props = {}) {
  const { type = 'view', onEdit, onDelete, options = {} } = props;
  const data = {};

  return [
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      render: (text, record = {}) => {
        if (!data[record._id]) { data[record._id] = {}; }

        let input = null;
        if (type === 'edit' && options.id === record._id) {
          input = <input defaultValue={text} onChange={(e) => data[record._id].phoneNumber = e.target.value} />;
        } else {
          input = <a href={`callto://${text}`}>{text}</a>;
        }
        return <div className="cell cell-phone">{input}</div>;
      }
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      render: (text, record = {}) => {
        if (!data[record._id]) { data[record._id] = {}; }
        data[record._id].firstName = text;

        let input = null;
        if (type === 'edit' && options.id === record._id) {
          input = <input defaultValue={text} onChange={(e) => data[record._id].firstName = e.target.value} />;
        } else {
          input = <a href={null}>{text}</a>; // eslint-disable-line
        }
        return <div className="cell cell-fname">{input}</div>;
      }
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      render: (text, record = {}) => {
        if (!data[record._id]) { data[record._id] = {}; }
        data[record._id].lastName = text;

        let input = null;
        if (type === 'edit' && options.id === record._id) {
          input = <input defaultValue={text} onChange={(e) => data[record._id].lastName = e.target.value} />;
        } else {
          input = <a href={null}>{text}</a>; // eslint-disable-line
        }
        return <div className="cell cell-lname">{input}</div>;
      }
    },
    {
      title: '#',
      dataIndex: '_id',
      render: (id, record) => {
        const isEditMode = type === 'edit' && options.id === id;
        const deleteText = 'Are you sure delete this contact?';
        return (
          <div className="cell cell-actions">

            <Tooltip placement="bottomRight" title="Edit">
              <Icon type="edit" theme="twoTone" twoToneColor={isEditMode ? '#2b8a3e' : '#000000'}
                    style={{ fontSize: '24px' }} onClick={(e) => onEdit({ ...e, id })} />
            </Tooltip>

            {isEditMode && (
              <Tooltip placement="bottomRight" title="Save">
                <Icon type="save" theme="twoTone" twoToneColor="#1c7ed6"
                      onClick={(e) => onEdit({ ...e, id, record, update: data[id] })} />
              </Tooltip>
            )}

            <Popconfirm placement="bottomRight" title={deleteText}
                        onConfirm={(e) => onDelete({ ...e, id })} okText="Yes" cancelText="No">
              <Tooltip placement="bottomRight" title="Delete">
                <Icon type="delete" theme="twoTone" twoToneColor="#c92a2a" />
              </Tooltip>
            </Popconfirm>

          </div>
        );
      }
    }
  ];
}

/**
 * Get contacts table view
 * @param {object} props - list of properties
 * @returns {*} - table view
 */
export function ContactsTable(props = {}) {
  const {
    page, limit, totalCount, columns, data, onChangePagination, rowSelection, deletable,
    onDelete, onAdd
  } = props;
  const deleteText = 'Are you sure delete these contacts?';

  return (
    <div className="table-wrapper">
      {deletable && (
        <Popconfirm placement="bottomRight" title={deleteText}
                    onConfirm={onDelete} okText="Yes" cancelText="No">
          <span className="anticon-wrapper delete">
            <Icon type="delete" theme="twoTone" twoToneColor="#c92a2a" />
            <span className="ant-badge">Delete Contacts</span>
          </span>
        </Popconfirm>
      )}

      <span className="anticon-wrapper plus-circle">
        <Icon type="plus-circle" theme="twoTone" onClick={onAdd} />
        <span className="ant-badge">Add Contact</span>
      </span>

      <Table style={{ marginTop: '30px' }}
            rowSelection={rowSelection}
             columns={columns}
             dataSource={data}
             rowKey="_id"
             pagination={false} />
      {totalCount > 0 && (
        <Pagination style={{ marginTop: '30px', textAlign: 'center' }}
                    defaultCurrent={page + 1}
                    pageSize={limit}
                    total={totalCount}
                    onChange={onChangePagination} />
      )}
    </div>
  );
}
