// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { useQuery } from "@tanstack/react-query";
// import { base44 } from "@/api/base44Client";
// import CategoryFilter from "../components/gallery/CategoryFilter";
// import ImageGrid from "../components/gallery/ImageGrid";

// export default function Gallery() {
//   const [selectedCategory, setSelectedCategory] = useState("all");

//   const { data: images = [], isLoading } = useQuery({
//     queryKey: ["gallery-images"],
//     queryFn: () => base44.entities.GalleryImage.list("-created_date"),
//   });

//   const filteredImages =
//     selectedCategory === "all"
//       ? images
//       : images.filter((img) => img.category === selectedCategory);

//   // Sort featured first
//   const sortedImages = [...filteredImages].sort((a, b) => {
//     if (a.is_featured && !b.is_featured) return -1;
//     if (!a.is_featured && b.is_featured) return 1;
//     return 0;
//   });

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50"
//       dir="rtl"
//     >
//       {/* Decorative elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
//       </div>

//       <div className="relative z-10">
//         {/* Header */}
//         <header className="pt-12 pb-8 px-4 text-center">
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-3">
//               גלריית הבלונים
//             </h1>
//             <p className="text-gray-500 text-lg">עיצוב בלונים לכל אירוע ✨</p>
//           </motion.div>
//         </header>

//         {/* Category Filter */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="mb-10"
//         >
//           <CategoryFilter
//             selectedCategory={selectedCategory}
//             onCategoryChange={setSelectedCategory}
//           />
//         </motion.div>

//         {/* Gallery Grid */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="max-w-7xl mx-auto px-4 pb-20"
//         >
//           <ImageGrid
//             images={sortedImages}
//             isAdmin={false}
//             onDelete={() => {}}
//             isLoading={isLoading}
//           />
//         </motion.div>
//       </div>
//     </div>
//   );
// }
