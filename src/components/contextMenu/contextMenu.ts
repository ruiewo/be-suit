import { TableDataObj } from '../table/baseTable';

export type ContextMenu = { mouseX: number; mouseY: number; data: TableDataObj | null } | null;
export type ContextMenuProps = {
  contextMenu: ContextMenu;
  onClose: (isEdited: boolean) => void;
};
