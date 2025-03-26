"use client"

import type React from "react"

import { ImageUploader } from "@/components/image-uploader"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useState, useRef } from "react"

export default function Home() {
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [templateName, setTemplateName] = useState("Cyberglyph")
  const resultInputRef = useRef<HTMLInputElement>(null)

  const handleResultUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setResultImage(result)
      // Store in localStorage for the mockup page and image uploader
      localStorage.setItem("processedImage", result)
    }
    reader.readAsDataURL(file)
  }

  const handleResultClick = () => {
    resultInputRef.current?.click()
  }

  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateName(e.target.value)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0f0f0f]">
      <div className="w-full max-w-3xl">
        {!resultImage && (
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              className="bg-[#1C1C1C] text-[#F8F8F8] hover:bg-[#505050] border-[#505050] flex items-center gap-2"
              onClick={handleResultClick}
            >
              <Upload size={16} />
              UPLOAD TRANSPARENT PNG RESULT
            </Button>
            <input type="file" ref={resultInputRef} onChange={handleResultUpload} accept="image/*" className="hidden" />
          </div>
        )}

        <h1 className="text-3xl mb-6 text-[#F8F8F8]">PIXELWEAVER</h1>
        <div className="mb-4 relative">
          <input
            type="text"
            value={templateName}
            onChange={handleTemplateChange}
            className="w-full bg-transparent text-[#E0E0E0] border-b border-[#505050] focus:border-[#E0E0E0] outline-none pb-1 transition-colors"
          />
        </div>

        <div className="mb-8">
          <textarea
            id="prompt"
            rows={3}
            placeholder="Enter your prompt here..."
            className="w-full bg-[#1C1C1C] text-[#F8F8F8] border border-[#505050] rounded-lg p-3 focus:border-[#E0E0E0] outline-none transition-colors resize-none text-left placeholder:text-[#A0A0A0]"
          ></textarea>
        </div>

        <ImageUploader resultImage={resultImage} templateName={templateName} />
      </div>
    </main>
  )
}

