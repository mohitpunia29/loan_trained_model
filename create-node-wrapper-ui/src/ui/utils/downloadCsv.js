import papaparse from 'papaparse';

export default function downloadCsv(data, name) {
  const csv = papaparse.unparse(data);
  const file = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  file.name = name;
  let url = null;
  if (navigator.msSaveBlob) {
    url = navigator.msSaveBlob(file, name);
  } else {
    url = window.URL.createObjectURL(file);
  }
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
}
