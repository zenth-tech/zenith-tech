function youtubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return m?.[1]
}

export function VideoEmbed({url, title}: {url?: string | null; title: string}) {
  if (!url) return null
  const id = youtubeId(url)
  if (!id) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
        Voir la vidéo
      </a>
    )
  }
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-ink">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
