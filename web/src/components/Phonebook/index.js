import React, { useState, useEffect } from 'react';
import mobileDevice from 'ismobilejs';
import { Table, Pagination, Icon } from 'antd';
import { toast } from 'react-toastify';
import { StyledWrapper } from 'components/CommonStyledWrapper';
import LoadingIndicator from 'components/LoadingIndicator';
import { getListOfContacts, updateContact, deleteContact } from 'utils/api/contacts';
import { getProp } from 'utils/helpers';
import './index.scss';

/**
 * Get columns structure
 * @param {string} type - type of view
 * @param {*} onEdit - event handler for editing
 * @param {*} onDelete - event handler for deleting
 * @param {object} options - list of custom options
 * @returns {*[]} - columns structure
 */
function getColumns(type = 'view', onEdit, onDelete, options = {}) {
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
        return (
          <div className="cell cell-actions">
            <Icon type="edit" theme="twoTone" twoToneColor={isEditMode ? '#2b8a3e' : '#000000'} title="Edit"
                  style={{ fontSize: '24px' }} onClick={(e) => onEdit(e, { id })} />
            {isEditMode && (
              <Icon type="save" theme="twoTone" twoToneColor="#1c7ed6" title="Save"
                    onClick={(e) => onEdit(e, { id, record, update: data[id] })} />
            )}
            <Icon type="delete" theme="twoTone" title="Delete"
                  twoToneColor="#c92a2a" onClick={(e) => onDelete(e, { id })} />
          </div>
        );
      }
    }
  ];
}

/**
 * Fetch contacts data
 * @param {object} props - list of properties
 * @returns {Promise<any>} - promise
 */
function fetchContacts(props) {
  return new Promise(async (resolve) => {
    const response = await getListOfContacts(props);
    if (response.status > 299) {
      toast.error(response.message || 'Unexpected Error, data not received.');
    } else if (getProp(response, 'results', 0) === 0) {
      toast.info('Data is empty!');
    }
    resolve(response);
  });
}

/**
 * Update an contact
 * @param {string} id - contact identification
 * @param {object} data - new contact data
 * @returns {Promise<any>} - promise
 */
function updateContactHandler(id, data) {
  return new Promise(async (resolve) => {
    const response = await updateContact(id, data);
    if (response.status > 299) {
      toast.error(response.message || 'Unexpected Error, contact not updated.');
    }
    resolve(response);
  });
}

/**
 * Delete an contact
 * @param {string} id - contact identification
 * @returns {Promise<any>} - promise
 */
function deleteContactHandler(id) {
  return new Promise(async (resolve) => {
    const response = await deleteContact(id);
    if (response.status > 299) {
      toast.error(response.message || 'Unexpected Error, contact not deleted.');
    }
    resolve(response);
  });
}

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => console.log({selectedRowKeys, selectedRows}) // eslint-disable-line
};


/**
 * Phonebook view
 * @returns {*} - Phonebook view
 * @constructor
 */
export function Phonebook() {
  const limit = 10;
  const isMobile = mobileDevice.any;
  const [ loading, setLoading ] = useState(false);
  const [ page, setPage ] = useState(0);
  const [ totalCount, setTotalCount ] = useState(0);
  const [ data, setData ] = useState([]);
  const [ columnMode, setColumnMode ] = useState('view');
  const [ columnOptions, setColumnOptions ] = useState({});
  const columns = getColumns(columnMode, onEditColumnHandler, onDeleteColumnHandler, columnOptions);
  const style = {
    position: 'relative',
    width: isMobile ? 'calc(100% - 40px)' : '640px'
  };

  useEffect(() => {
    (async () => {
      await fetchContactsHandler()
    })();
  }, [page]);

  // XHR Fetch Handler
  async function fetchContactsHandler(pageNum = page) {
    setLoading(true);
    const response = await fetchContacts({ pagination: true, page: pageNum, limit });
    const results = getProp(response, 'results', []);

    setLoading(false);
    setData(results);
    setTotalCount(getProp(response, 'totalCount', 0));
  }

  // XHR Fetch Handler - change page
  async function onChangePagination(pageNum) {
    setPage(pageNum);
  }

  // Row data edit handler
  async function onEditColumnHandler(event, { id, record, update }) {
    if (record && update) {
      const anyChanges = (
        record.phoneNumber !== update.phoneNumber
        || record.firstName !== update.firstName
        || record.lastName !== update.lastName
      );
      if (anyChanges) {
        const response = await updateContactHandler(id, update);
        if (!response.error) {
          toast.success('Contact was updated!');
          await fetchContactsHandler(page);
        }
      }
    }

    if (columnMode === 'view') {
      setColumnMode('edit');
    } else {
      setColumnMode('view');
    }
    setColumnOptions({ id });
  }

  // Delete row handler
  async function onDeleteColumnHandler(event, { id }) {
    const statement = window.confirm('Are You Sure?');
    if (statement) {
      const response = await deleteContactHandler(id);
      if (!response.error) {
        toast.success('Contact was deleted!');
        await fetchContactsHandler(page);
      }
    }
  }

  return (
    <StyledWrapper className="phonebook" style={style}>
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
      {loading && <LoadingIndicator />}
    </StyledWrapper>
  );
}
