type PostmarkProps = {
  className?: string
}

export function Postmark({ className = '' }: PostmarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/postmark/kenzie-postmark.svg"
      alt=""
      width={120}
      height={120}
      draggable={false}
      className={`pointer-events-none h-auto w-full select-none object-contain ${className}`}
    />
  )
}
