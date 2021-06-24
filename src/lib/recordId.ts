let  maxId: number = parseInt(localStorage.getItem('_recordId') || '1', 10) || 1;
function recordId() {
  maxId++;
  localStorage.setItem('_recordId', JSON.stringify(maxId));
  return maxId;
}
export default recordId;
