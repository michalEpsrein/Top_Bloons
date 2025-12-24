// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { base44 } from "@/api/base44Client";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Plus,
//   Trash2,
//   Download,
//   Star,
//   Image as ImageIcon,
//   Calendar,
// } from "lucide-react";
// import { format } from "date-fns";
// import { he } from "date-fns/locale";
// import UploadForm from "../components/admin/UploadForm";
// import { categories } from "../components/gallery/CategoryFilter";

// export default function AdminGallery() {
//   const [showUploadForm, setShowUploadForm] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const queryClient = useQueryClient();

//   const { data: images = [], isLoading } = useQuery({
//     queryKey: ["gallery-images"],
//     queryFn: () => base44.entities.GalleryImage.list("-created_date"),
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id) => base44.entities.GalleryImage.delete(id),
//     onSuccess: () =>
//       queryClient.invalidateQueries({ queryKey: ["gallery-images"] }),
//   });

//   const filteredImages =
//     selectedCategory === "all"
//       ? images
//       : images.filter((img) => img.category === selectedCategory);

//   const handleDownload = async (imageUrl, title) => {
//     const response = await fetch(imageUrl);
//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${title}.jpg`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   };

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50"
//       dir="rtl"
//     >
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 ניהול הגלריה
//               </h1>
//               <p className="text-gray-500">
//                 {filteredImages.length} תמונות בקטלוג
//               </p>
//             </div>
//             <Button
//               onClick={() => setShowUploadForm(true)}
//               className="bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg"
//               size="lg"
//             >
//               <Plus className="w-5 h-5 ml-2" />
//               העלאת תמונה חדשה
//             </Button>
//           </div>

//           {/* Category Tabs */}
//           <div className="flex flex-wrap gap-2 bg-white p-3 rounded-xl shadow-sm border">
//             {categories.map((cat) => {
//               const Icon = cat.icon;
//               const isActive = selectedCategory === cat.id;
//               const count =
//                 cat.id === "all"
//                   ? images.length
//                   : images.filter((img) => img.category === cat.id).length;

//               return (
//                 <button
//                   key={cat.id}
//                   onClick={() => setSelectedCategory(cat.id)}
//                   className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
//                     isActive
//                       ? "bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-md"
//                       : "bg-gray-50 text-gray-600 hover:bg-gray-100"
//                   }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                   <span className="font-medium">{cat.label}</span>
//                   <span
//                     className={`text-xs px-2 py-0.5 rounded-full ${
//                       isActive ? "bg-white/20" : "bg-gray-200"
//                     }`}
//                   >
//                     {count}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Images List */}
//         {isLoading ? (
//           <div className="grid gap-4">
//             {[...Array(5)].map((_, i) => (
//               <div
//                 key={i}
//                 className="h-32 bg-gray-100 rounded-xl animate-pulse"
//               />
//             ))}
//           </div>
//         ) : filteredImages.length === 0 ? (
//           <Card className="p-12 text-center">
//             <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-4">
//               <ImageIcon className="w-10 h-10 text-pink-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">
//               אין תמונות בקטגוריה זו
//             </h3>
//             <p className="text-gray-500 mb-4">
//               התחילו להעלות תמונות כדי לבנות את הגלריה
//             </p>
//             <Button
//               onClick={() => setShowUploadForm(true)}
//               className="bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500"
//             >
//               <Plus className="w-4 h-4 ml-2" />
//               העלאת תמונה ראשונה
//             </Button>
//           </Card>
//         ) : (
//           <div className="grid gap-4">
//             <AnimatePresence mode="popLayout">
//               {filteredImages.map((image, index) => {
//                 const categoryLabel =
//                   categories.find((c) => c.id === image.category)?.label ||
//                   image.category;

//                 return (
//                   <motion.div
//                     key={image.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{ duration: 0.3, delay: index * 0.03 }}
//                   >
//                     <Card className="overflow-hidden hover:shadow-lg transition-shadow">
//                       <div className="flex flex-col md:flex-row gap-4 p-4">
//                         {/* Thumbnail */}
//                         <div className="relative w-full md:w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50">
//                           <img
//                             src={image.image_url}
//                             alt={image.title}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>

//                         {/* Details */}
//                         <div className="flex-1 flex flex-col justify-between">
//                           <div>
//                             <div className="flex items-start justify-between mb-2">
//                               <h3 className="text-xl font-bold text-gray-900">
//                                 {image.title}
//                               </h3>
//                               <Badge className="bg-pink-100 text-pink-700 border-pink-200">
//                                 {categoryLabel}
//                               </Badge>
//                             </div>

//                             {image.description && (
//                               <p className="text-gray-600 mb-3">
//                                 {image.description}
//                               </p>
//                             )}

//                             <div className="flex items-center gap-4 text-sm text-gray-500">
//                               <div className="flex items-center gap-1">
//                                 <Calendar className="w-4 h-4" />
//                                 <span>
//                                   {format(
//                                     new Date(image.created_date),
//                                     "dd/MM/yyyy",
//                                     { locale: he }
//                                   )}
//                                 </span>
//                               </div>
//                               <div className="text-xs px-2 py-1 bg-gray-100 rounded">
//                                 ID: {image.id.slice(0, 8)}
//                               </div>
//                             </div>
//                           </div>

//                           {/* Actions */}
//                           <div className="flex gap-2 mt-4">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() =>
//                                 handleDownload(image.image_url, image.title)
//                               }
//                               className="flex-1"
//                             >
//                               <Download className="w-4 h-4 ml-2" />
//                               הורדה
//                             </Button>
//                             <Button
//                               variant="destructive"
//                               size="sm"
//                               onClick={() => {
//                                 if (
//                                   confirm(
//                                     `האם אתה בטוח שברצונך למחוק את "${image.title}"?`
//                                   )
//                                 ) {
//                                   deleteMutation.mutate(image.id);
//                                 }
//                               }}
//                               className="flex-1"
//                             >
//                               <Trash2 className="w-4 h-4 ml-2" />
//                               מחיקה
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     </Card>
//                   </motion.div>
//                 );
//               })}
//             </AnimatePresence>
//           </div>
//         )}
//       </div>

//       {/* Upload Form Modal */}
//       <AnimatePresence>
//         {showUploadForm && (
//           <UploadForm
//             onSuccess={() =>
//               queryClient.invalidateQueries({ queryKey: ["gallery-images"] })
//             }
//             onClose={() => setShowUploadForm(false)}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
