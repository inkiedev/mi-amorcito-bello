import imageCompression from "browser-image-compression"

const TARGET_MAX_SIZE_MB = 0.45
const TARGET_MAX_WIDTH_OR_HEIGHT = 1600
const TARGET_INITIAL_QUALITY = 0.72
const HEIC_JPEG_QUALITY = 0.82

type HeicConverter = (options: {
  blob: Blob
  toType: string
  quality?: number
}) => Promise<Blob | Blob[]>

export type OptimizedImageResult = {
  file: File
  originalSize: number
  optimizedSize: number
  outputType: "image/webp" | "image/jpeg"
}

function getBaseName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-") || "foto"
}

function isHeicFile(file: File) {
  return /image\/hei(c|f)/i.test(file.type) || /\.(hei(c|f))$/i.test(file.name)
}

function supportsWebp() {
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 1

  return canvas.toDataURL("image/webp").startsWith("data:image/webp")
}

async function convertHeicToJpeg(file: File) {
  const heicModule = await import("heic2any")
  const heic2any = heicModule.default as HeicConverter
  const converted = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: HEIC_JPEG_QUALITY,
  })
  const blob = Array.isArray(converted) ? converted[0] : converted

  return new File([blob], `${getBaseName(file.name)}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  })
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const kilobytes = bytes / 1024
  if (kilobytes < 1024) return `${kilobytes.toFixed(0)} KB`

  return `${(kilobytes / 1024).toFixed(2)} MB`
}

export async function optimizeImageForUpload(file: File): Promise<OptimizedImageResult> {
  const isSupportedImage = file.type.startsWith("image/") || isHeicFile(file)

  if (!isSupportedImage) {
    throw new Error("El archivo seleccionado no parece ser una imagen.")
  }

  const originalSize = file.size
  const sourceFile = isHeicFile(file) ? await convertHeicToJpeg(file) : file
  const outputType = supportsWebp() ? "image/webp" : "image/jpeg"
  const extension = outputType === "image/webp" ? "webp" : "jpg"
  const compressed = await imageCompression(sourceFile, {
    maxSizeMB: TARGET_MAX_SIZE_MB,
    maxWidthOrHeight: TARGET_MAX_WIDTH_OR_HEIGHT,
    initialQuality: TARGET_INITIAL_QUALITY,
    fileType: outputType,
    useWebWorker: true,
    preserveExif: false,
  })
  const optimizedFile = new File([compressed], `${getBaseName(file.name)}.${extension}`, {
    type: outputType,
    lastModified: Date.now(),
  })

  return {
    file: optimizedFile,
    originalSize,
    optimizedSize: optimizedFile.size,
    outputType,
  }
}
