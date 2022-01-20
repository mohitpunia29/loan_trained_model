export default function downloadFile(response, fileName) {
  // NOTE: only way for now
  // https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
