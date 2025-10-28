import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AlertDialogue = ({ trigger, title, description, onConfirm, onCancel, triggerClassName, isOpen }) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel?.()}>
            {trigger && (
                <AlertDialogTrigger asChild>
                    <div className={triggerClassName}>
                        {trigger}
                    </div>
                </AlertDialogTrigger>
            )}
            <AlertDialogContent className='bg-black'>
                <AlertDialogHeader>
                    {title && <AlertDialogTitle className="text-white">{title}</AlertDialogTitle>}
                    {description && (
                        <AlertDialogDescription className="text-gray-400">
                            {description}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel 
                        className='bg-black text-white hover:bg-gray-800'
                        onClick={onCancel}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertDialogue;