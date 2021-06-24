interface RecordItem {
  id: number;
  tag: string;
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
