"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface ImageUploaderProps {
  resultImage: string | null
  templateName: string
}

export function ImageUploader({ resultImage, templateName }: ImageUploaderProps) {
  const [image, setImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generated, setGenerated] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const dropZone = dropZoneRef.current
    if (!dropZone) return

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!generated && !loading) {
        setIsDragging(true)
      }
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!dropZone.contains(e.relatedTarget as Node)) {
        setIsDragging(false)
      }
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (generated || loading) return

      const files = e.dataTransfer?.files
      if (files && files.length > 0) {
        const file = files[0]
        if (file.type.startsWith("image/")) {
          processFile(file)
        }
      }
    }

    dropZone.addEventListener("dragover", handleDragOver)
    dropZone.addEventListener("dragenter", handleDragEnter)
    dropZone.addEventListener("dragleave", handleDragLeave)
    dropZone.addEventListener("drop", handleDrop)

    return () => {
      dropZone.removeEventListener("dragover", handleDragOver)
      dropZone.removeEventListener("dragenter", handleDragEnter)
      dropZone.removeEventListener("dragleave", handleDragLeave)
      dropZone.removeEventListener("drop", handleDrop)
    }
  }, [generated, loading])

  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setImage(result)
      setProcessedImage(result)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    processFile(file)
  }

  const handleGenerate = () => {
    setLoading(true)
    setProgress(0)

    const startTime = Date.now()
    const duration = 1500

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min(Math.floor((elapsed / duration) * 100), 100)
      setProgress(newProgress)

      if (elapsed < duration) {
        requestAnimationFrame(updateProgress)
      } else {
        setLoading(false)
        setGenerated(true)
      }
    }

    requestAnimationFrame(updateProgress)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const canGenerate = !!image && !!resultImage

  return (
    <div className="space-y-6">
      <div
        ref={dropZoneRef}
        onClick={!generated && !loading ? handleClick : undefined}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-colors",
          "bg-[#1C1C1C]",
          isDragging ? "border-[#E0E0E0] border-4" : "border-[#505050] hover:border-[#E0E0E0]",
          !generated && !loading && "cursor-pointer",
        )}
      >
        <div className="h-[400px] flex items-center justify-center">
          <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" className="hidden" />

          {!image && !loading && !generated && (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-[#E0E0E0] mb-4" />
              <h3 className="text-lg text-[#F8F8F8]">UPLOAD AN IMAGE</h3>
              <p className="mt-2 text-sm text-[#E0E0E0]">Drag and drop or click to browse</p>
            </div>
          )}

          {loading && (
            <div className="w-full space-y-4">
              <div className="flex items-center justify-center">
                <Zap className="h-12 w-12 text-[#E0E0E0] animate-pulse" />
              </div>
              <p className="text-center text-[#F8F8F8]">{templateName.toUpperCase()} AI IS GENERATING...</p>
              <Progress value={progress} className="h-2 bg-[#505050]" />
            </div>
          )}

          {image && !loading && processedImage && !generated && (
            <div className="relative flex items-center justify-center">
              <img
                src={processedImage || "/placeholder.svg"}
                alt="Uploaded image"
                className="max-h-[400px] max-w-full object-contain"
              />
            </div>
          )}

          {generated && resultImage && (
            <div className="relative flex items-center justify-center">
              <img
                src={resultImage || "/placeholder.svg"}
                alt="Generated image"
                className="max-h-[400px] max-w-full object-contain"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        {image && !loading && !generated && (
          <Button
            onClick={handleGenerate}
            className="bg-[#505050] text-[#F8F8F8] hover:bg-[#1C1C1C] px-8"
            disabled={!canGenerate}
          >
            GENERATE
          </Button>
        )}

        {generated && (
          <Button
            onClick={() => router.push("/tshirt-mockup")}
            className="bg-[#505050] text-[#F8F8F8] hover:bg-[#1C1C1C] px-8"
            disabled={!resultImage}
          >
            NEXT
          </Button>
        )}
      </div>
    </div>
  )
}

