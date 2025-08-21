"use client"

import * as React from "react"

interface CollapsibleProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

interface CollapsibleContextType {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CollapsibleContext = React.createContext<CollapsibleContextType | undefined>(undefined)

const Collapsible = ({ children, defaultOpen = false }: CollapsibleProps) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const value = React.useMemo(() => ({ isOpen, setIsOpen }), [isOpen])

  return <CollapsibleContext.Provider value={value}>{children}</CollapsibleContext.Provider>
}

interface CollapsibleTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const CollapsibleTrigger = React.forwardRef<HTMLDivElement, CollapsibleTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext)
    if (!context) {
      throw new Error("CollapsibleTrigger must be used within a Collapsible")
    }
    const { isOpen, setIsOpen } = context

    return (
      <div
        ref={ref}
        className={`cursor-pointer ${className || ""}`}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        data-state={isOpen ? "open" : "closed"}
        {...props}
      >
        {children}
      </div>
    )
  },
)
CollapsibleTrigger.displayName = "CollapsibleTrigger"

interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext)
    if (!context) {
      throw new Error("CollapsibleContent must be used within a Collapsible")
    }
    const { isOpen } = context

    return (
      <div
        ref={ref}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        } ${className || ""}`}
        {...props}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    )
  },
)
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
