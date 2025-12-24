import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Star, X, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "../categories";

type Image = {
  id: string | number;
  title: string;
  image_url: string;
  category: string | number;
  description?: string;
};

type ImageCardProps = {
  image: Image;
  isAdmin: boolean;
  onDelete: (id: string | number) => void;
  index: number;
};

export default function ImageCard({
  image,
  isAdmin,
  onDelete,
  index,
}: ImageCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const categoryLabel =
    categories.find(
      (c: { id: string | number; label: string }) => c.id === image.category
    )?.label || image.category;

  const handleDownload = async () => {
    const response = await fetch(image.image_url);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${image.title}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group relative cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 aspect-[4/5] shadow-sm hover:shadow-xl transition-shadow duration-500">
          {/* Shimmer loading effect */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-white to-pink-100 animate-pulse" />
          )}

          <img
            src={image.image_url}
            alt={image.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-semibold text-lg mb-1">
              {image.title}
            </h3>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-0 backdrop-blur-sm"
            >
              {categoryLabel}
            </Badge>
          </div>

          {/* Admin actions */}
          {isAdmin && (
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8 rounded-full shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(image.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Lightbox Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none">
          <DialogTitle className="sr-only">{image.title}</DialogTitle>
          <div className="relative">
            <Button
              size="icon"
              variant="ghost"
              className="absolute -top-12 left-1/2 -translate-x-1/2 text-white hover:bg-white/20 rounded-full z-10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={image.image_url}
              alt={image.title}
              className="w-full rounded-2xl shadow-2xl"
            />

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-white text-2xl font-bold mb-2">
                    {image.title}
                  </h3>
                  {image.description && (
                    <p className="text-white/80 text-sm mb-2">
                      {image.description}
                    </p>
                  )}
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-0"
                  >
                    {categoryLabel}
                  </Badge>
                </div>
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 ml-2" />
                  הורדה
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
