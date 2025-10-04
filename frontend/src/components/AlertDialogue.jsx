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


const AlertDialogue = ({ trigger, title, description, onConfirm, triggerClassName }) => {
    return (
        <AlertDialog>
            {/* asChild = This tells the trigger to use its child element as the trigger instead of creating a new button */}
        <AlertDialogTrigger asChild >
            <div className={triggerClassName}>
                {trigger}
            </div>
        </AlertDialogTrigger>  
        <AlertDialogContent className='bg-black'>
            <AlertDialogHeader>
            {title && <AlertDialogTitle>{ title }</AlertDialogTitle>}
            {description && <AlertDialogDescription>
                {description}
            </AlertDialogDescription>}
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel className='bg-black'>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertDialogue;