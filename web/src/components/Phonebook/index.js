import React, { useState, useEffect } from 'react';
import { Spin, message } from 'antd';
import { StyledWrapper } from 'components/CommonStyledWrapper';
import {
  getListOfContactsXHR, createContactXHR, updateContactXHR, deleteContactXHR, deleteContactListXHR
} from 'utils/api/contacts';
import { getProp } from 'utils/helpers';
import { ContactsTable, getColumns } from './components/Table';
import { AddContactModal } from './components/AddContactModal'
import './index.scss';

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

  const response = await getListOfContactsXHR({ pagination: true, page, limit });
  const results = getProp(response, 'results', []);

  if (response.status > 299 || response.error) {
    message.error(response.message || 'Unexpected Error, data not received.');
  } else if (getProp(response, 'results', 0) === 0) {
    message.info('Data is empty!');
  }

  setLoading(false);
  setData(results);
  setTotalCount(getProp(response, 'totalCount', 0));
}

/**
 * Update contact handler
 * @param {object} event - extended event source
 * @returns {Promise<MessageType>} - Promise
 */
async function updateContactHandler(event = {}) {
  const { id, record, update, columnMode, setColumnMode, setColumnOptions } = event;

  if (record && update) {
    const anyChanges = (
      record.phoneNumber !== update.phoneNumber
      || record.firstName !== update.firstName
      || record.lastName !== update.lastName
    );
    if (anyChanges) {
      const response = await updateContactXHR(id, update);

      if (response.status > 299 || response.error) {
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
async function deleteContactHandler(event = {}) {
  const { id } = event;
  const response = await deleteContactXHR(id);

  if (response.status > 299 || response.error) {
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
async function deleteContactListHandler(event = {}) {
  const { deletableItems, setDeletableItems } = event;
  const response = await deleteContactListXHR(deletableItems);
  setDeletableItems([]);

  if (response.status > 299 || response.error) {
    return message.error(response.message || 'Unexpected Error, Contact list has been not deleted.');
  }

  message.success('Contacts was deleted!');
  await fetchContactsHandler(event);
}

/**
 * Add an new contact handler
 * @param {object} props - list of properties
 * @returns {Promise<MessageType>} - Promise
 */
async function createContactHandler(props = {}) {
  const { values } = props;
  const response = await createContactXHR(values);

  if (response.error) {
    return message.error(response.message || 'Unexpected Error, Contact has been not created.');
  }

  message.success('Contact was created!');
  await fetchContactsHandler(props);
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
    onDelete: (event) => deleteContactHandler({ ...event, page, limit, ...rabbitHole }),
    onEdit: (event) => updateContactHandler({ ...event, page, limit, columnMode, ...rabbitHole })
  });
  const tableProps = {
    page, limit, totalCount, columns, data,
    deletable: deletableItems.length > 0,
    rowSelection: getRowSelection(rabbitHole),
    onChangePagination: (page) => onChangePagination({ page, ...rabbitHole }),
    onDelete: (event) => deleteContactListHandler({ ...event, deletableItems, page, limit, ...rabbitHole }),
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
      <AddContactModal visible={addPopupVisibility}
                        onSubmit={(values) => {
                          setAddPopupVisibility(false);
                          createContactHandler({ values, page, limit, ...rabbitHole });
                        }}
                        onCancel={() => { setAddPopupVisibility(false) }} />
      {loading && (<Spin size="large" tip="Loading Contacts..."><ContactsTable {...tableProps} /></Spin>)}
      {!loading && (<ContactsTable {...tableProps} />)}
    </StyledWrapper>
  );
}
