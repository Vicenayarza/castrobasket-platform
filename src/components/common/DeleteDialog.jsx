import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

export default function DeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle>

            {title}

          </AlertDialogTitle>

          <AlertDialogDescription>

            {description}

          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel>

            Cancelar

          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
          >
            Eliminar
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
}