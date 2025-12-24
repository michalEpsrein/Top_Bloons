import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { categories } from '../gallery/CategoryFilter';

export default function UploadForm({ onSuccess, onClose }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        is_featured: false,
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !formData.title || !formData.category) return;

        setIsUploading(true);

        const { file_url } = await base44.integrations.Core.UploadFile({ file });

        await base44.entities.GalleryImage.create({
            ...formData,
            image_url: file_url,
        });

        setUploadSuccess(true);
        setTimeout(() => {
            onSuccess();
            onClose();
        }, 1500);
    };

    const filteredCategories = categories.filter(c => c.id !== 'all');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg"
            >
                <Card className="border-0 shadow-2xl">
                    <CardHeader className="relative bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-t-lg">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute left-4 top-4 text-white hover:bg-white/20"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                        <CardTitle className="text-center text-xl">העלאת תמונה חדשה</CardTitle>
                    </CardHeader>

                    <CardContent className="p-6">
                        <AnimatePresence mode="wait">
                            {uploadSuccess ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex flex-col items-center py-10"
                                >
                                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                        <CheckCircle className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">התמונה הועלתה בהצלחה!</h3>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Image Upload */}
                                    <div className="space-y-2">
                                        <Label>תמונה</Label>
                                        <div
                                            className={`relative border-2 border-dashed rounded-xl transition-colors ${preview ? 'border-pink-300 bg-pink-50' : 'border-gray-200 hover:border-pink-300'
                                                }`}
                                        >
                                            {preview ? (
                                                <div className="relative aspect-video">
                                                    <img
                                                        src={preview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        className="absolute top-2 left-2 h-8 w-8 rounded-full"
                                                        onClick={() => {
                                                            setFile(null);
                                                            setPreview(null);
                                                        }}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center py-10 cursor-pointer">
                                                    <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-3">
                                                        <ImageIcon className="w-8 h-8 text-pink-400" />
                                                    </div>
                                                    <span className="text-gray-600 font-medium">לחצו לבחירת תמונה</span>
                                                    <span className="text-gray-400 text-sm mt-1">או גררו לכאן</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title">שם העבודה *</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="לדוגמה: קשת בלונים ליום הולדת"
                                            className="text-right"
                                            required
                                        />
                                    </div>

                                    {/* Category */}
                                    <div className="space-y-2">
                                        <Label>קטגוריה *</Label>
                                        <Select
                                            value={formData.category}
                                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                                            required
                                        >
                                            <SelectTrigger className="text-right">
                                                <SelectValue placeholder="בחרו קטגוריה" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filteredCategories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id}>
                                                        {cat.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">תיאור (אופציונלי)</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="תארו את העבודה..."
                                            className="text-right resize-none"
                                            rows={3}
                                        />
                                    </div>

                                    {/* Featured */}
                                    <div className="flex items-center justify-between py-2">
                                        <Label htmlFor="featured" className="cursor-pointer">הצג כמומלץ</Label>
                                        <Switch
                                            id="featured"
                                            checked={formData.is_featured}
                                            onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                                        />
                                    </div>

                                    {/* Submit */}
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white py-6"
                                        disabled={!file || !formData.title || !formData.category || isUploading}
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                                                מעלה...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-5 h-5 ml-2" />
                                                העלאת תמונה
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}