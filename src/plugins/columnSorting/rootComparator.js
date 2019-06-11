/* eslint-disable import/prefer-default-export */

import { getCompareFunctionFactory } from './sortService';

/**
 * Sort comparator handled by conventional sort algorithm.
 *
 * @param {Array} sortOrders Sort orders (`asc` for ascending, `desc` for descending).
 * @param {Array} columnMetas Column meta objects.
 * @returns {Function}
 */
export function rootComparator(sortingOrders, columnMetas) {
  return function(rowIndexWithValues, nextRowIndexWithValues) {
    // We sort array of arrays. Single array is in form [rowIndex, ...values].
    // We compare just values, stored at second index of array.
    const [index, ...values] = rowIndexWithValues;
    const [nextIndex, ...nextValues] = nextRowIndexWithValues;

    return (function getCompareResult(column) {
      const sortingOrder = sortingOrders[column];
      const columnMeta = columnMetas[column];
      const value = values[column];
      const nextValue = nextValues[column];
      const pluginSettings = columnMeta.columnSorting;
      const compareFunctionFactory = pluginSettings.compareFunctionFactory ? pluginSettings.compareFunctionFactory : getCompareFunctionFactory(columnMeta.type);
      const compareResult = compareFunctionFactory(column, sortingOrders, columnMetas, pluginSettings)(value, nextValue, index, nextIndex);

      // DIFF - MultiColumnSorting & ColumnSorting: removed iteration through next sorted columns.

      return compareResult;
    }(0));
  };
}
