"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, ZoomIn, ZoomOut, RotateCw, Check } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type TShirtColor = "Black" | "White"

export default function TshirtMockup() {
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<TShirtColor>("White")
  const [isAdded, setIsAdded] = useState(false)

  // T-shirt images for different colors
  const tshirtImages = {
    Black:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4d906c4e-9b5c-4507-bbba-e508b30a8af3-BAfZ5XXZq66I2iMV0fCCFbcGHNsQmo.png", // Replace with actual black t-shirt image
    White:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download%20-%20Edited-eG2tZ3the6l0j90Hrc2F0SSXZcgwBS.png",
  }

  useEffect(() => {
    const storedImage = localStorage.getItem("processedImage")
    if (storedImage) {
      setProcessedImage(storedImage)
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 15) % 360)
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
  }

  const handleColorSelect = (color: TShirtColor) => {
    setSelectedColor(color)
  }

  const handleAddToCart = () => {
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0f0f0f]"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button
              variant="outline"
              className="bg-[#1C1C1C] text-[#F8F8F8] hover:bg-[#505050] border-[#505050] flex items-center gap-2"
            >
              <ArrowLeft size={16} /> BACK
            </Button>
          </Link>
          <h1 className="text-3xl text-[#F8F8F8]">T-SHIRT MOCKUP</h1>
          <div className="w-[100px]"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 bg-[#1C1C1C] rounded-lg p-4">
            <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
              <img
                src={tshirtImages[selectedColor] || "/placeholder.svg"}
                alt={`${selectedColor} t-shirt mockup`}
                className="max-h-full max-w-full object-contain"
              />

              {processedImage && (
                <div
                  className="absolute pointer-events-auto cursor-move"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                    transformOrigin: "center",
                    maxWidth: "60%",
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    src={processedImage || "/placeholder.svg"}
                    alt="Your design"
                    className="max-w-full border-2 border-[#505050]"
                    draggable="false"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-64 space-y-6 bg-[#1C1C1C] rounded-lg p-4">
            <div>
              <h2 className="text-xl mb-2 text-[#F8F8F8]">DESIGN CONTROLS</h2>
              <p className="text-sm text-[#E0E0E0] mb-4">Adjust your design on the t-shirt</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#E0E0E0] text-sm">SIZE</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 bg-[#505050]"
                      onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
                    >
                      <ZoomOut size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 bg-[#505050]"
                      onClick={() => setScale((prev) => Math.min(2, prev + 0.1))}
                    >
                      <ZoomIn size={14} />
                    </Button>
                  </div>
                </div>
                <Slider
                  value={[scale * 50]}
                  min={25}
                  max={100}
                  step={1}
                  onValueChange={(value) => setScale(value[0] / 50)}
                  className="bg-[#505050]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#E0E0E0] text-sm">ROTATION</span>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-[#505050]" onClick={handleRotate}>
                    <RotateCw size={14} />
                  </Button>
                </div>
                <Slider
                  value={[rotation]}
                  min={0}
                  max={360}
                  step={15}
                  onValueChange={(value) => setRotation(value[0])}
                  className="bg-[#505050]"
                />
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div>
                <p className="text-sm text-[#E0E0E0] mb-2">COLOR</p>
                <div className="grid grid-cols-3 gap-2">
                  {(["Black", "White"] as const).map((color) => (
                    <Button
                      key={color}
                      variant="outline"
                      className={cn(
                        "bg-[#1C1C1C] border-[#505050] hover:bg-[#505050]",
                        selectedColor === color && "bg-[#505050] border-[#E0E0E0]",
                      )}
                      onClick={() => handleColorSelect(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-[#E0E0E0] mb-2">SIZE</p>
                <div className="grid grid-cols-4 gap-2">
                  {["S", "M", "L", "XL"].map((size) => (
                    <Button
                      key={size}
                      variant="outline"
                      className={cn(
                        "bg-[#1C1C1C] border-[#505050] hover:bg-[#505050]",
                        selectedSize === size && "bg-[#505050] border-[#E0E0E0]",
                      )}
                      onClick={() => handleSizeSelect(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                className={cn(
                  "w-full transition-all duration-200",
                  isAdded ? "bg-[#707070] hover:bg-[#808080]" : "bg-[#505050] text-[#F8F8F8] hover:bg-[#1C1C1C]",
                )}
                onClick={handleAddToCart}
              >
                {isAdded ? (
                  <span className="flex items-center gap-2">
                    <Check size={16} /> ADDED
                  </span>
                ) : (
                  "ADD TO CART"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
