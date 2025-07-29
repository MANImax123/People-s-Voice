"use client";
const ASSEMBLY_AI_API_KEY = "c6f0ee01ffa1431ab158cfa085826ee1"; // <-- Put your API key here
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { metropolitanCities, issueCategories } from "@/lib/civic-data";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  title: string;
  description: string;
  category: string;
  metropolitanCity: string;
  area: string;
  exactAddress: string;
  reporterName: string;
  reporterEmail: string;
  reporterPhone: string;
}

interface AIAnalysisResult {
  priority: number;
  priorityReason: string;
  confidence: number;
}

export default function ReportIssue() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    metropolitanCity: "",
    area: "",
    exactAddress: "",
    reporterName: "",
    reporterEmail: "",
    reporterPhone: ""
  });
  
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset area when city changes
      ...(name === 'metropolitanCity' ? { area: '' } : {})
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + photos.length > 5) {
      setError("Maximum 5 photos allowed");
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError("Only image files are allowed");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Each image must be less than 5MB");
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setPhotos(prev => [...prev, ...validFiles]);
      
      // Create preview URLs
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setPhotoPreviews(prev => [...prev, ...newPreviews]);
      setError("");
    }
  };

  const removePhoto = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(photoPreviews[index]);
    
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || 
          !formData.metropolitanCity || !formData.area || !formData.exactAddress ||
          !formData.reporterName || !formData.reporterEmail || !formData.reporterPhone) {
        throw new Error("All fields are required");
      }

      if (photos.length === 0) {
        throw new Error("At least one photo is required");
      }

      // Convert photos to Base64
      const base64Photos = [];
      for (const photo of photos) {
        const base64Data = await convertToBase64(photo);
        base64Photos.push({
          data: base64Data,
          filename: photo.name,
          mimetype: photo.type,
          size: photo.size
        });
      }

      // Submit the issue with current timestamp
      const now = new Date();
      const issueData = {
        ...formData,
        photos: base64Photos,
        reportedAt: now.toISOString(), // Current date in ISO format
        reportedBy: {
          name: formData.reporterName,
          email: formData.reporterEmail,
          phone: formData.reporterPhone
        }
      };

      const response = await fetch('/api/issues/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issueData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit issue');
      }

      const result = await response.json();
      
      // Store AI analysis result
      if (result.aiAnalysis) {
        setAiAnalysis(result.aiAnalysis);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/issues');
      }, 3000); // Extended time to show AI analysis

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert file to Base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to Base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const availableAreas = formData.metropolitanCity ? 
    metropolitanCities[formData.metropolitanCity as keyof typeof metropolitanCities] || [] : [];

  // Add your AssemblyAI API key here
  const ASSEMBLY_AI_API_KEY = "YOUR_ASSEMBLYAI_API_KEY_HERE"; // <-- Put your API key here

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Issue Reported Successfully!</h1>
            <p className="text-gray-600">
              Thank you for reporting this civic issue. Our AI has analyzed your submission.
            </p>
          </div>

          {/* AI Analysis Results */}
          {aiAnalysis && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">🤖</div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-900">AI Priority Analysis</h3>
                  <p className="text-purple-700 text-sm">Based on photo analysis and description</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {aiAnalysis.priority}/10
                    </div>
                    <div className="text-sm text-gray-600">Priority Level</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                      aiAnalysis.priority >= 8 ? 'bg-red-100 text-red-800' :
                      aiAnalysis.priority >= 6 ? 'bg-orange-100 text-orange-800' :
                      aiAnalysis.priority >= 4 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {aiAnalysis.priority >= 8 ? 'High Priority' :
                       aiAnalysis.priority >= 6 ? 'Medium-High' :
                       aiAnalysis.priority >= 4 ? 'Medium' : 'Low Priority'}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Analysis Confidence</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${aiAnalysis.confidence * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-purple-600 font-medium">
                    {Math.round(aiAnalysis.confidence * 100)}% confident
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Reasoning</div>
                <p className="text-gray-800">{aiAnalysis.priorityReason}</p>
              </div>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/issues"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Issues
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <span className="text-4xl mr-3">📋</span>
              Report Civic Issue
            </h1>
            <p className="text-blue-100 mt-2">
              Help improve your community by reporting civic issues
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Issue Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Issue Details</h2>
              
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Title *
                </label>
                <Input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Brief description of the issue"
                  required
                  enableVoice
                  language="en-IN"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {issueCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* AI Priority Analysis Notice */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🤖</div>
                  <div>
                    <h4 className="font-semibold text-purple-900">AI Priority Analysis</h4>
                    <p className="text-purple-700 text-sm">
                      Our AI will analyze your photos and description to automatically determine the priority level (1-10) based on safety, impact, and urgency factors.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide detailed information about the issue..."
                  required
                  rows={4}
                  enableVoice
                  language="en-IN"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Location Details</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="metropolitanCity" className="block text-sm font-medium text-gray-700 mb-2">
                    Metropolitan City *
                  </label>
                  <select
                    id="metropolitanCity"
                    name="metropolitanCity"
                    value={formData.metropolitanCity}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select city</option>
                    {Object.keys(metropolitanCities).map(city => (
                      <option key={city} value={city}>
                        {city.charAt(0).toUpperCase() + city.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                    Area *
                  </label>
                  <select
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.metropolitanCity}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Select area</option>
                    {availableAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="exactAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Exact Address/Landmark *
                </label>
                <Input
                  id="exactAddress"
                  type="text"
                  name="exactAddress"
                  value={formData.exactAddress}
                  onChange={handleInputChange}
                  placeholder="Provide specific address or landmark"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Photo Evidence</h2>
              
              <div>
                <label htmlFor="photos" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photos * (Max 5 photos, 5MB each)
                </label>
                <input
                  id="photos"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors"
                />
              </div>

              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reporter Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Contact Information</h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="reporterName" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <Input
                    id="reporterName"
                    type="text"
                    name="reporterName"
                    value={formData.reporterName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="reporterEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="reporterEmail"
                    type="email"
                    name="reporterEmail"
                    value={formData.reporterEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="reporterPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    id="reporterPhone"
                    type="tel"
                    name="reporterPhone"
                    value={formData.reporterPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                {loading ? "Submitting..." : "Submit Issue Report"}
              </button>
              
              <Link
                href="/"
                className="flex-1 py-3 px-6 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
