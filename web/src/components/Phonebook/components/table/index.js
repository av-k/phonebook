import React, { Fragment } from 'react';
import { Table, Pagination, Icon, Tooltip, Popconfirm } from 'antd';

/**
 * Get columns structure
 * @param {string} type - type of view
 * @param {*} onEdit - event handler for editing
 * @param {*} onDelete - event handler for deleting
 * @param {object} options - list of custom options
 * @returns {*[]} - columns structure
 */
export function getColumns(type = 'view', onEdit, onDelete, options = {}) {
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
                    style={{ fontSize: '24px' }} onClick={(e) => onEdit(e, { id })} />
            </Tooltip>

            {isEditMode && (
              <Tooltip placement="bottomRight" title="Save">
                <Icon type="save" theme="twoTone" twoToneColor="#1c7ed6"
                      onClick={(e) => onEdit(e, { id, record, update: data[id] })} />
              </Tooltip>
            )}

            <Popconfirm placement="bottomRight" title={deleteText}
                        onConfirm={(e) => onDelete(e, { id })} okText="Yes" cancelText="No">
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
 * Get table view
 * @param {object} props - list of properties
 * @returns {*} - table view
 */
export function getTable(props = {}) {
  const {
    page, limit, totalCount, columns, data, onChangePagination, rowSelection, deletable,
    onDelete, onAdd
  } = props;
  const deleteText = 'Are you sure delete these contacts?';
  return (
    <Fragment>
      {deletable && (
        <Popconfirm placement="bottomRight" title={deleteText}
                    onConfirm={onDelete} okText="Yes" cancelText="No">
          <Tooltip placement="bottom" title="Delete">
            <Icon type="delete" theme="twoTone" twoToneColor="#c92a2a" />
          </Tooltip>
        </Popconfirm>
      )}
      {totalCount > 0 && (
        <Pagination style={{ marginBottom: '30px', textAlign: 'center' }}
                    defaultCurrent={page + 1}
                    pageSize={limit}
                    total={totalCount}
                    onChange={onChangePagination} />
      )}
      <Table rowSelection={rowSelection}
             columns={columns}
             dataSource={data}
             rowKey="_id"
             pagination={false} />
    </Fragment>
  );
}
