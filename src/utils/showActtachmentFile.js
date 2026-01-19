export const getFileExtension = (url) => {
  const name = decodeURIComponent(url.split('/').pop())
  return name.split('.').pop().toLowerCase()
}

export const isImageFile = (ext) => {
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)
}
