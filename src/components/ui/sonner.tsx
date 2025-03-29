"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({
  ...props
}: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      closeButton
      richColors
      className="toaster dark:group"
      toastOptions={{
        classNames: {
          toast: "dark:bg-zinc-950 dark:text-white border dark:border-zinc-700",
          title: "dark:text-white",
          description: "dark:text-zinc-300",
          closeButton: "dark:bg-zinc-800 dark:text-zinc-200"
        },
        duration: 4000,
      }}
      {...props}
    />
  )
}

export { Toaster }
