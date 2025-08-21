import * as React from "react"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  // No specific variants needed for this simple alert, just className for custom styling
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 ${
      className || ""
    }`}
    {...props}
  />
))
Alert.displayName = "Alert"

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={`text-sm [&_p]:leading-relaxed ${className || ""}`} {...props} />
  ),
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }
