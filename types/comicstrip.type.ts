export type ComicStrip = {
  title: string,
  panels: ComicPanel[],
  createdAt?: string,
  updatedAt?: string,
  thumbnail: string
}

export type ComicPanel = {
  nodes: any[],
  thumbnail: string,
  thumbPubId: string
}