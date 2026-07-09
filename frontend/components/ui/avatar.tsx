import { cn } from "@/lib/utils"

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  const initials = parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0]?.slice(0, 2) ?? ""
  return initials.toUpperCase()
}

function Avatar({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-medium text-white select-none",
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}

export { Avatar }
