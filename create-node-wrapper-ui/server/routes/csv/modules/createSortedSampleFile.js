// const fs = require('fs').promises;
// const path = require('path');
// const Promise = require('bluebird');
// const { spawn } = require('child_process');

// const { SortCsvOnColumn: sortCsvOnColumn } = require('../../../build/Release/sortCsvOnColumn');

// const SCRIPT_PATH = path.join(__dirname, 'sort_csv_on_column.sh');

module.exports = function() {};

// async function({ sourceFile, destinationFile, sortColumn, sortDirection, sortType }) {
//   // check if we already have the sorted file version
//   try {
//     await fs.stat(destinationFile);
//   } catch (e) {
//     if (e.code !== 'ENOENT') throw e;

//     // if we don't, we generate it
//     await createSortedSampleFile({
//       source     : sourceFile,
//       destination: destinationFile,
//       column     : sortColumn,
//       direction  : sortDirection,
//       type       : sortType
//     });
//   }
// };

// async function createSortedSampleFile({ source, destination, column, direction, type }) {
//   const MODE = process.env.SORT_CSV_ON_COLUMN_MODE || 'bash';

//   if (MODE === 'bash') {
//     return createSortedSampleFileBash({ source, destination, column, direction, type });
//   } else if (MODE === 'c++') {
//     return createSortedSampleFileCPP({ source, destination, column, direction, type });
//   } else if (MODE === 'compare') {
//     return createSortedSampleFileCompare({ source, destination, column, direction, type });
//   }
// }

// async function createSortedSampleFileCompare({ source, destination, column, direction, type }) {
//   console.log('');
//   console.log(column);
//   console.time('C++');
//   await createSortedSampleFileCPP({ source, destination, column, direction, type });
//   console.timeEnd('C++');
//   await fs.unlink(destination);
//   console.time('bash');
//   await createSortedSampleFileBash({ source, destination, column, direction, type });
//   console.timeEnd('bash');
// }

// async function createSortedSampleFileCPP({ source, destination, column, direction, type }) {
//   return sortCsvOnColumn(source, destination, column, direction, type, ',');
// }

// async function createSortedSampleFileBash({ source, destination, column, direction, type }) {
//   return new Promise(function(resolve, reject) {
//     let error;

//     const sortCsvOnColumn = spawn('bash', [
//       SCRIPT_PATH,
//       '-i', source,
//       '-o', destination,
//       '-c', column,
//       '-d', direction,
//       '-t', type,
//       '-s', ','
//     ]);

//     sortCsvOnColumn.stdout.on('data', (data) => {
//       console.log(`stdout: ${data}`);
//       error = data;
//     });

//     sortCsvOnColumn.stderr.on('data', (data) => {
//       console.log(`stderr: ${data}`);
//     });

//     sortCsvOnColumn.on('close', (code) => {
//       if (code !== 0) {
//         return reject(new Error('An error occured while generating the sorted file: ' + error));
//       } else {
//         resolve();
//       }
//     });
//   });
// }
