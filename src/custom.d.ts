interface RecordItem {
  id: number;
  tagId: number;
  tag: string;
  name: string;
  note: string;
  type: string;
  date: string;
  amount: number;
}
interface CreatedTags {
  name: string;
  src: string;
  id: number;
  type: 'creation';
}
interface IconGroup {
  name: string;
  src: string;
  id: number;
  type: 'default';
}
