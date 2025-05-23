
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { CheckCircle, AlertCircle, Info } from "lucide-react"

// Extended toast props to support our custom variants
type ToastProps = React.ComponentPropsWithoutRef<typeof Toast> & {
  variant?: "default" | "destructive" | "success" | "info"
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const variantProp = (props as ToastProps).variant || "default"
        
        return (
          <Toast 
            key={id} 
            {...props} 
            className={cn(
              "group shadow-lg shadow-primary/5 border-primary/20 animate-enter",
              "backdrop-blur-sm bg-opacity-95 dark:bg-opacity-90",
              "motion-safe:animate-fade-in motion-safe:animate-duration-300",
              variantProp === "success" && "border-green-500/30 bg-green-500/10",
              variantProp === "destructive" && "border-destructive/30 bg-destructive/10",
              variantProp === "info" && "border-primary/30 bg-primary/10",
              props.className
            )}
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="font-semibold text-foreground/90 flex items-center gap-1.5">
                  {variantProp === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                  {variantProp === "destructive" && <AlertCircle className="h-4 w-4 text-destructive" />}
                  {variantProp === "info" && <Info className="h-4 w-4 text-primary" />}
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-foreground/70">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-foreground/50 hover:text-foreground/80" />
          </Toast>
        )
      })}
      <ToastViewport className="gap-2" />
    </ToastProvider>
  )
}
