/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TableSortLabel, Paper
} from '@material-ui/core';

import Spinner from '../Spinner/Spinner';
import DownloadIcon from '../Icons/Download';

import downloadCsv from '../../utils/downloadCsv';

import styles from './EnhancedTable.module.css';

/* This is an example of a table object passed to this Component
  const table = {
    header: [
      {
        title   : 'BRAND',
        align   : 'left',
        func    : (v) => <div onClick>{v}</div>
        expFunc : (v) => transform(v)
        attr    : 'brand',
        sortable: false
      }
    ],
    rows: [
      {
        cells: [
          {
            value       : 'Brand 1',
            displayValue: <div onClick>Brand 1</div>,
            exportValue : 'Brand 1'
            align       : 'left',
            attr        : 'brand'
          }
        ],
        expandedRows: [],   // this is an array of all the grouped rows based on groupBy value
        onClick: () => {}   // what happens when we click on a row
      }
    ]
  };
*/

export default function EnhancedTable({ table, pagination, sortingDisabled, sortBy, emptyMessage, pending, csvExport }) {
  const { header, rows } = table;
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState(sortBy);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pagination ? 100 : 1000);
  const [expandedRow, setExpandedRow] = useState([]);

  useEffect(() => {
    if (page !== 0 || orderBy !== sortBy || expandedRow.length) {
      setPage(0);
      setOrderBy(null);
      setExpandedRow([]);
    }
  }, [table.rows.length]);

  // if (!table.rows.length) return <div className={styles.empty}><Spinner /></div>;

  const handleSort = (property) => {
    if (sortingDisabled) return;
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setExpandedRow([]);
  };

  const isExpandedRow = (index) => expandedRow.includes(index);

  const expandRow = (index) => {
    let newExpandedRow = [];
    if (isExpandedRow(index)) {
      newExpandedRow = expandedRow.filter((item) => index !== item);
    } else {
      newExpandedRow = [...expandedRow, index].sort();
    }
    setExpandedRow(newExpandedRow);
  };

  const sortedData = [...rows];
  if (orderBy) {
    sortedData.sort((a, b) => {
      const cellA = a.cells.find((cell) => cell.attr === orderBy);
      const cellB = b.cells.find((cell) => cell.attr === orderBy);
      const comparison = cellA.value < cellB.value ? 1 : -1;
      return order === 'asc' ? comparison : -1 * comparison;
    });
  }

  const csvData = sortedData.map((row) => {
    const csvRow = {};
    row.cells.forEach(({ exportValue, attr }) => {
      const column = header.filter(({ attr: _attr, expFunc }) => expFunc && (attr === _attr))[0].title;
      csvRow[column] = exportValue;
    });
    return csvRow;
  });

  return (
    <Paper className={styles.root}>
      <div className={styles[pagination ? 'tableWrapper' : 'tableWrapperNoPagination']}>
        <Table classes={{ root: styles.table }}>
          <TableHead classes={{ root: styles.tableHeader }}>
            <TableRow>
              {header.map(({ title, attr, align, sortable }, index) => (
                <TableCell
                  key={`header-${attr}-${index}`}
                  padding='dense'
                  align={align}
                  sortDirection={orderBy === attr ? order : false}
                  classes={{ root: styles.th }}
                >
                  <TableSortLabel
                    active={!sortingDisabled && orderBy === attr}
                    direction={order}
                    onClick={() => sortable ? handleSort(attr) : null}
                    style={{
                      pointerEvents: sortable ? 'auto' : 'none',
                      marginRight  : align === 'center' ? -15 : 0
                    }}
                  >
                    {title || attr}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody classes={{ root: styles.tableBody }}>
            {sortedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(({ cells, expandedRows, onClick }, index) => (
                <>
                  <TableRow
                    key={`row-${index}`}
                    classes={{ root: `${styles.tr} ${isOdd(index) ? styles.white : styles.gray}` }}
                    // eslint-disable-next-line no-confusing-arrow
                    onClick={() => onClick ? onClick() : expandRow(index)}
                    // eslint-disable-next-line no-nested-ternary
                    style={{ pointerEvents: !expandedRows ? 'auto' : expandedRows.length > 1 ? 'auto' : 'none' }}
                  >
                    {cells.map(({ value, displayValue, align, attr }, _index) => (
                      <TableCell key={`cell-${attr}-${index}-${_index}`} align={align}>{displayValue}</TableCell>
                    ))}
                  </TableRow>

                  {expandedRows && isExpandedRow(index) && expandedRows.length > 1 && expandedRows.map((row, _index) => (
                    <TableRow
                      key={`expRow-${_index}`}
                      classes={{ root: `${styles.trExpanded} ${isOdd(index) ? styles.ewhite : styles.egray}` }}
                      onClick={() => expandRow(index)}
                    >
                      {row.map(({ value, displayValue, align, attr }, _index2) => (
                        <TableCell key={`expCell-${attr}-${_index}-${_index2}`} align={align}>{displayValue}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              ))}
            {sortedData.length === 0 && emptyMessage && (
              <TableRow>
                <TableCell colSpan={header.length - 1} className={styles.emptyTableMessage}>{emptyMessage}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className={styles.paginationFooter}>
        {csvExport && (<div className={styles.csvExport} onClick={() => downloadCsv(csvData, 'test.csv')}><DownloadIcon /></div>)}
        {pending && (<div className={styles.pendingContainer}><Spinner size='small' /></div>)}
      </div>
      {pagination && (
        <TablePagination
          classes={{ toolbar: styles.paginationToolbar }}
          rowsPerPageOptions={[10, 20, 50, 100]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{ 'aria-label': 'Previous Page' }}
          nextIconButtonProps={{ 'aria-label': 'Next Page' }}
          onChangePage={(e, _page) => setPage(_page)}
          onChangeRowsPerPage={(e) => setRowsPerPage(e.target.value)}
        />
      )}
    </Paper>
  );
}

function isOdd(x) { return x % 2 === 0; }

EnhancedTable.propTypes = {
  table: PropTypes.shape({
    header: PropTypes.array,
    rows  : PropTypes.array
  }),
  pagination     : PropTypes.bool,
  sortingDisabled: PropTypes.bool,
  sortBy         : PropTypes.string,
  emptyMessage   : PropTypes.string,
  pending        : PropTypes.bool,
  csvExport      : PropTypes.bool
};

EnhancedTable.defaultProps = {
  table: {
    header: [],
    rows  : []
  },
  pagination     : true,
  sortingDisabled: false,
  sortBy         : null,
  emptyMessage   : null,
  pending        : false,
  csvExport      : false
};
