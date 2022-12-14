export type ContextMenu = { mouseX: number; mouseY: number; data: Record<string, string | number> | null } | null;
export type ContextMenuProps = {
  contextMenu: ContextMenu;
  onClose: (isEdited: boolean) => void;
};
