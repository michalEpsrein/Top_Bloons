import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { categories } from "../categories";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 px-4">
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategory === category.id;

        return (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300",
              "text-sm font-medium border",
              isSelected
                ? "bg-gradient-to-r from-rose-400 to-pink-400 text-white border-transparent shadow-lg shadow-pink-200/50"
                : "bg-white/80 text-gray-600 border-gray-200 hover:border-pink-300 hover:text-pink-600"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{category.label}</span>
            {isSelected && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
