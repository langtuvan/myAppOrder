// This is a re-export hook for convenience
export { useToastDialog } from "@/contexts/toast-dialog-context";

/**
 * Example usage:
 *
 * 'use client';
 * import { useToastDialog } from '@/hooks/useToastDialog';
 *
 * export function MyComponent() {
 *   const { confirm, alert, warning, error, info } = useToastDialog();
 *
 *   const handleDelete = async () => {
 *     const result = await confirm(
 *       'Delete Item',
 *       'Are you sure you want to delete this item?',
 *       {
 *         actions: [
 *           {
 *             id: 'cancel',
 *             label: 'Cancel',
 *             variant: 'secondary',
 *             onClick: () => {}
 *           },
 *           {
 *             id: 'delete',
 *             label: 'Delete',
 *             variant: 'danger',
 *             onClick: async () => {
 *               // Handle delete logic
 *               await deleteItem();
 *             }
 *           }
 *         ]
 *       }
 *     );
 *     console.log('Action selected:', result);
 *   };
 *
 *   const handleInfo = async () => {
 *     await info('Information', 'This is an info dialog');
 *   };
 *
 *   const handleWarning = async () => {
 *     await warning(
 *       'Warning',
 *       'Please be careful with this action'
 *     );
 *   };
 *
 *   return (
 *     <div className="flex gap-4">
 *       <button onClick={handleDelete}>Delete</button>
 *       <button onClick={handleInfo}>Info</button>
 *       <button onClick={handleWarning}>Warning</button>
 *     </div>
 *   );
 * }
 */
