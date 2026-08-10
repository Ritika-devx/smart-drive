/**
 * Maps a full mimetype (e.g. "application/pdf", "image/png") to the
 * short category used for icons and preview logic across the file
 * manager (FileCard, TrashCard, ArchiveCard).
 */
export function categorizeType(mime) {
  if (!mime) return 'file';

  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime === 'application/pdf') return 'pdf';
  if (
    mime === 'application/msword' ||
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) return 'doc';
  if (
    mime === 'application/zip' ||
    mime === 'application/x-rar-compressed' ||
    mime === 'application/x-7z-compressed' ||
    mime === 'application/x-tar' ||
    mime === 'application/gzip'
  ) return 'archive';

  return 'file';
}