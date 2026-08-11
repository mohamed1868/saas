export function PageFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <span
        role="status"
        aria-label="Loading"
        className="size-6 animate-spin rounded-full border-2 border-muted border-t-primary"
      />
    </div>
  )
}
