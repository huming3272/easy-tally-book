interface RecordItem {
  id: number;
  tagId: number;
  note: string;
  type: string;
  date: string;
  amount: number;
  search: string;
}
interface CreatedTags {
  name: string;
  src: string;
  id: number;
  type: 'creation'| 'default';
}
// interface IconGroup {
//   name: string;
//   src: string;
//   id: number;
//   type: 'default';
// }
