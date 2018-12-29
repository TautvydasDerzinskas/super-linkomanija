export default interface IMeta {
  id: string;
  description: string;
  title: string;
  isInHistoryTab: boolean;
  actionTitle: string;
  defaultStatus?: boolean;
  defaultData?: any;
  videoPageOnly?: boolean;
}
