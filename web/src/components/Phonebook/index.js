import React, { useState, useEffect } from 'react';
import { Spin, message } from 'antd';
import { StyledWrapper } from 'components/CommonStyledWrapper';
import { getListOfContacts, updateContact, deleteContact, deleteContactList } from 'utils/api/contacts';
import { getProp } from 'utils/helpers';
import { ContactsTable, getColumns } from './components/Table';
import { AddContactsModal } from './components/AddContactModal'
import './index.scss';

/**
 * Fetch contacts data
 * @param {object} props - list of properties
 * @returns {Promise<any>} - Promise
 */
function fetchContacts(props) {
  return new Promise(async (resolve) => {
    const response = await getListOfContacts(props);
    if (response.status > 299) {
      message.error(response.message || 'Unexpected Error, data not received.');
    } else if (getProp(response, 'results', 0) === 0) {
      message.info('Data is empty!');
    }
    resolve(response);
  });
}

/**
 * XHR Fetch Handler
 * @param {number} page - page number for pagination and fetch
 * @param {number} limit - limit number for pagination and fetch
 * @param {function} setLoading - callback for `setLoading` hook
 * @param {function} setData - callback for `setData` hook
 * @param {function} setTotalCount - callback for `setLoading` hook
 * @returns {Promise<void>} - Promise
 */
async function fetchContactsHandler({ page, limit, setLoading, setData, setTotalCount }) {
  setLoading(true);
  const response = await fetchContacts({ pagination: true, page, limit });
  const results = getProp(response, 'results', []);

  setLoading(false);
  setData(results);
  setTotalCount(getProp(response, 'totalCount', 0));
}

/**
 * Update an contact
 * @param {string} id - contact identification
 * @param {object} data - new contact data
 * @returns {Promise<any>} - Promise
 */
function updateContactHandler(id, data) {
  return new Promise(async (resolve) => {
    const response = await updateContact(id, data);
    if (response.status > 299) {
      message.error(response.message || 'Unexpected Error, contact not updated.');
    }
    resolve(response);
  });
}

/**
 * Delete an contact
 * @param {string} id - contact identification
 * @returns {Promise<any>} - Promise
 */
function deleteContactHandler(id) {
  return new Promise(async (resolve) => {
    const response = await deleteContact(id);
    if (response.status > 299) {
      message.error(response.message || 'Unexpected Error, contact not deleted.');
    }
    resolve(response);
  });
}

/**
 * Update contact handler
 * @param {object} event - extended event source
 * @returns {Promise<MessageType>} - Promise
 */
async function onUpdate(event = {}) {
  const { id, record, update, columnMode, setColumnMode, setColumnOptions } = event;

  if (record && update) {
    const anyChanges = (
      record.phoneNumber !== update.phoneNumber
      || record.firstName !== update.firstName
      || record.lastName !== update.lastName
    );
    if (anyChanges) {
      const response = await updateContactHandler(id, update);
      if (response.error) {
        return message.error(response.message || 'Unexpected Error, Contact has been not updated.');
      }
      message.success('Contact was updated!');
      await fetchContactsHandler(event);
    }
  }

  if (columnMode === 'view') {
    setColumnMode('edit');
  } else {
    setColumnMode('view');
  }
  setColumnOptions({ id });
}

/**
 * Delete contact handler
 * @param {object} event - extended event source
 * @returns {Promise<MessageType>} - Promise
 */
async function onDelete(event = {}) {
  const { id } = event;
  const response = await deleteContactHandler(id);

  if (response.error) {
    return message.error(response.message || 'Unexpected Error, Contact has been not deleted.');
  }

  message.success('Contact was deleted!');
  await fetchContactsHandler(event);
}

/**
 * Multiple delete contact handler
 * @param {object} event - extended event source
 * @returns {Promise<MessageType>} - Promise
 */
async function onDeleteList(event = {}) {
  const { deletableItems, setDeletableItems } = event;
  const response = await deleteContactList(deletableItems);
  setDeletableItems([]);

  if (response.error) {
    return message.error(response.message || 'Unexpected Error, Contact list has been not deleted.');
  }

  message.success('Contacts was deleted!');
  await fetchContactsHandler(event);
}

/**
 * Add an new contact handler
 * @param {object} event - extended event source
 * @returns {Promise<MessageType>} - Promise
 */
function onAdd(event = {}) {

}

/**
 * XHR Fetch Handler - change page
 * @param {number} page - page number
 * @param {function} setDeletableItems - callback for `setDeletableItems` hook
 * @param {function} setPage - callback for `setPage` hook
 * @returns {Promise<void>} - Promise
 */
async function onChangePagination({ page, setDeletableItems, setPage }) {
  setDeletableItems([]);
  setPage(page - 1);
}

/**
 * Row selection handler (on select all / directly)
 * @param {object} props - list of properties
 * @returns {{onChange: (function(*=))}} - callbacks
 */
function getRowSelection(props = {}) {
  const { setDeletableItems } = props;

  return {
    onChange: (selectedRowKeys = []) => setDeletableItems(selectedRowKeys)
  };
}

/**
 * Phonebook view
 * @returns {*} - Phonebook view
 * @constructor
 */
export function Phonebook() {
  const limit = 10;
  const [ loading, setLoading ] = useState(false);
  const [ page, setPage ] = useState(0);
  const [ totalCount, setTotalCount ] = useState(0);
  const [ addPopupVisibility, setAddPopupVisibility ] = useState(false);
  const [ data, setData ] = useState([]);
  const [ columnMode, setColumnMode ] = useState('view');
  const [ columnOptions, setColumnOptions ] = useState({});
  const [ deletableItems, setDeletableItems ] = useState(false);
  const rabbitHole = {
    setLoading: (props) => setLoading(props),
    setPage: (props) => setPage(props),
    setData: (props) => setData(props),
    setColumnMode: (props) => setColumnMode(props),
    setColumnOptions: (props) => setColumnOptions(props),
    setDeletableItems: (props) => setDeletableItems(props),
    setTotalCount: (props) => setTotalCount(props),
    setAddPopupVisibility: (props) => setAddPopupVisibility(props)
  };
  const columns = getColumns({
    type: columnMode,
    options: columnOptions,
    onDelete: (event) => onDelete({ ...event, page, limit, ...rabbitHole }),
    onEdit: (event) => onUpdate({ ...event, page, limit, columnMode, ...rabbitHole })
  });
  const tableProps = {
    page, limit, totalCount, columns, data,
    deletable: deletableItems.length > 0,
    rowSelection: getRowSelection(rabbitHole),
    onChangePagination: (page) => onChangePagination({ page, ...rabbitHole }),
    onDelete: (event) => onDeleteList({ ...event, deletableItems, page, limit, ...rabbitHole }),
    onAdd: () => setAddPopupVisibility(true)
  };

  //
  useEffect(() => {
    (async () => {
      await fetchContactsHandler({ page, limit, ...rabbitHole });
    })();
  }, [page]);

  return (
    <StyledWrapper className="phonebook">
      <h1>My Phonebook</h1>
      <AddContactsModal visible={addPopupVisibility}
                        onOk={() => { setAddPopupVisibility(false) }}
                        onCancel={() => { setAddPopupVisibility(false) }} />
      {loading && (<Spin size="large" tip="Loading Contacts..."><ContactsTable {...tableProps} /></Spin>)}
      {!loading && (<ContactsTable {...tableProps} />)}
    </StyledWrapper>
  );
}
