let  maxId: number = parseInt(localStorage.getItem('_tagId') || '40', 10) || 40;
function tagId() {
  maxId++;
  localStorage.setItem('_tagId', JSON.stringify(maxId));
  return maxId;
}
export default tagId;

