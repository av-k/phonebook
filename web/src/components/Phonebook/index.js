import React, { useState, useEffect } from 'react';
import mobileDevice from 'ismobilejs';
import { Spin, message } from 'antd';
import { StyledWrapper } from 'components/CommonStyledWrapper';
import { getListOfContacts, updateContact, deleteContact, deleteContactList } from 'utils/api/contacts';
import { getProp } from 'utils/helpers';
import { getTable, getColumns } from './components/table';
import './index.scss';

/**
 * Fetch contacts data
 * @param {object} props - list of properties
 * @returns {Promise<any>} - promise
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
 * Update an contact
 * @param {string} id - contact identification
 * @param {object} data - new contact data
 * @returns {Promise<any>} - promise
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
 * @returns {Promise<any>} - promise
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
  const [ deletableItems, setDeletableItems ] = useState(false);
  const columns = getColumns(columnMode, onEditHandler, onDeleteHandler, columnOptions);
  const table = getTable({
    page, limit, totalCount, columns, data, deletable: deletableItems.length > 0,
    onChangePagination, rowSelection: getRowSelection(), onDelete: onDeleteListHandler
  });
  const style = {
    position: 'relative',
    width: isMobile ? 'calc(100% - 40px)' : '640px'
  };

  //
  useEffect(() => {
    (async () => {
      await fetchContactsHandler();
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
    setDeletableItems([]);
    setPage(pageNum - 1);
  }

  // Row data edit handler
  async function onEditHandler(event, { id, record, update }) {
    if (record && update) {
      const anyChanges = (
        record.phoneNumber !== update.phoneNumber
        || record.firstName !== update.firstName
        || record.lastName !== update.lastName
      );
      if (anyChanges) {
        const response = await updateContactHandler(id, update);
        if (response.error) {
          return message.error(response.message || 'Unexpected Error, Contact has been not edited.');
        }
        message.success('Contact was updated!');
        await fetchContactsHandler(page);
      }
    }

    if (columnMode === 'view') {
      setColumnMode('edit');
    } else {
      setColumnMode('view');
    }
    setColumnOptions({ id });
  }

  // Delete handler
  async function onDeleteHandler(event, { id }) {
    const response = await deleteContactHandler(id);
    if (response.error) {
      return message.error(response.message || 'Unexpected Error, Contact has been not deleted.');
    }

    message.success('Contact was deleted!');
    await fetchContactsHandler(page);
  }

  // Multiple delete handler
  async function onDeleteListHandler() {
    const response = await deleteContactList(deletableItems);
    setDeletableItems([]);

    if (response.error) {
      return message.error(response.message || 'Unexpected Error, Contact list has been not deleted.');
    }

    message.success('Contacts was deleted!');
    await fetchContactsHandler(page);
  }

  // Row selection handler
  function getRowSelection() {
    return {
      onChange: (selectedRowKeys = []) => setDeletableItems(selectedRowKeys)
    };
  }

  return (
    <StyledWrapper className="phonebook" style={style}>
      {loading && (<Spin size="large" tip="Loading Contacts...">{table}</Spin>)}
      {!loading && (table)}
    </StyledWrapper>
  );
}
