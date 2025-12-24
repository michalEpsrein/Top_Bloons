import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import ImageCard from "./ImageCard";
import { ImageOff } from "lucide-react";

type Image = {
  id: string;
  // add other image properties as needed, e.g. url: string;
};

interface ImageGridProps {
  images: Image[];
  isAdmin: boolean;
  onDelete: (id: string | number) => void;
  isLoading: boolean;
}

export default function ImageGrid({
  images,
  isAdmin,
  onDelete,
  isLoading,
}: ImageGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mb-4">
          <ImageOff className="w-10 h-10 text-pink-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          אין תמונות בקטגוריה זו
        </h3>
        <p className="text-gray-500">נסו לבחור קטגוריה אחרת</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      <AnimatePresence mode="popLayout">
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image as any}
            isAdmin={isAdmin}
            onDelete={onDelete}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
