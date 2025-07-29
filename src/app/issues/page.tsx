"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { metropolitanCities, issueCategories } from "@/lib/civic-data";

interface Issue {
  _id: string;
  issueNumber: string;
  title: string;
  description: string;
  category: string;
  priority: number; // Changed to number (1-10)
  status: string;
  location: {
    metropolitanCity: string;
    area: string;
    exactAddress: string;
  };
  photos: Array<{
    data: string;
    filename: string;
    mimetype: string;
    size: number;
    uploadedAt: string;
  }>;
  reportedBy: {
    name: string;
    email: string;
    phone: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    specialization: string;
  };
  aiAnalysis?: {
    priorityReason: string;
    severityFactors: Array<{
      factor: string;
      impact: string;
      score: number;
    }>;
    confidence: number;
  };
  reportedAt: string;
  updatedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<Pagination | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    city: "all",
    priority: "all",
    page: 1
  });

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "all") {
          params.append(key, value.toString());
        }
      });
      
      const response = await fetch(`/api/issues?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }
      
      const data = await response.json();
      setIssues(data.issues);
      setPagination(data.pagination);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-100 text-red-800 border-red-200';
    if (priority >= 6) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (priority >= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 8) return 'High Priority';
    if (priority >= 6) return 'Medium-High';
    if (priority >= 4) return 'Medium';
    return 'Low Priority';
  };

  const getCategoryIcon = (category: string) => {
    const cat = issueCategories.find(c => c.value === category);
    return cat?.icon || '📋';
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'reported', label: 'Reported' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                  <span className="text-4xl mr-3">🏛️</span>
                  Civic Issues Dashboard
                </h1>
                <p className="text-blue-100 mt-2">
                  Track and monitor civic issues in your community
                </p>
              </div>
              <Link
                href="/report-issue"
                className="mt-4 md:mt-0 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center"
              >
                <span className="mr-2">📝</span>
                Report New Issue
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {issueCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Cities</option>
                {Object.keys(metropolitanCities).map(city => (
                  <option key={city} value={city}>
                    {city.charAt(0).toUpperCase() + city.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority (8-10)</option>
                <option value="medium-high">Medium-High (6-7)</option>
                <option value="medium">Medium (4-5)</option>
                <option value="low">Low Priority (1-3)</option>
              </select>

              <button
                onClick={() => setFilters({
                  status: "all",
                  category: "all", 
                  city: "all",
                  priority: "all",
                  page: 1
                })}
                className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Stats */}
          {pagination && (
            <div className="px-6 py-4 bg-gray-50">
              <p className="text-gray-600">
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
                {pagination.totalCount} issues
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading issues...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Issues Grid */}
        {!loading && !error && (
          <div className="space-y-6">
            {issues.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Issues Found</h3>
                <p className="text-gray-600 mb-4">
                  No civic issues match your current filters.
                </p>
                <Link
                  href="/report-issue"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <span className="mr-2">📝</span>
                  Report First Issue
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {issues.map((issue) => (
                  <div key={issue._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        {/* Issue Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
                                <h3 className="text-xl font-semibold text-gray-900">
                                  {issue.title}
                                </h3>
                                <span className="text-sm text-gray-500">
                                  #{issue.issueNumber}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-3">
                                {issue.description}
                              </p>
                            </div>
                          </div>

                          {/* Status and Priority */}
                          <div className="flex flex-wrap gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(issue.status)}`}>
                              {issue.status.replace('-', ' ').toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(issue.priority)}`}>
                              🤖 Priority {issue.priority}/10 - {getPriorityLabel(issue.priority)}
                            </span>
                          </div>

                          {/* Location */}
                          <div className="mb-4">
                            <p className="text-sm text-gray-600">
                              📍 {issue.location.area}, {issue.location.metropolitanCity.charAt(0).toUpperCase() + issue.location.metropolitanCity.slice(1)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {issue.location.exactAddress}
                            </p>
                          </div>

                          {/* Reporter Info */}
                          <div className="mb-4">
                            <p className="text-sm text-gray-600">
                              Reported by: {issue.reportedBy.name} on{' '}
                              {new Date(issue.reportedAt || Date.now()).toLocaleString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                                timeZone: 'Asia/Kolkata'
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              Contact: {issue.reportedBy.email} • {issue.reportedBy.phone || 'N/A'}
                            </p>
                          </div>

                          {/* Assigned Tech */}
                          {issue.assignedTo?.name ? (
                            <div className="mb-4">
                              <p className="text-sm text-gray-600">
                                Assigned to: <span className="font-medium text-blue-600">{issue.assignedTo.name}</span>
                                {issue.assignedTo.specialization && (
                                  <span className="text-gray-500"> ({issue.assignedTo.specialization})</span>
                                )}
                              </p>
                            </div>
                          ) : null}

                          {/* AI Analysis */}
                          {issue.aiAnalysis && (
                            <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                              <div className="flex items-center mb-2">
                                <span className="text-lg mr-2">🤖</span>
                                <span className="text-sm font-medium text-purple-900">AI Analysis</span>
                                <span className="ml-auto text-xs text-purple-600">
                                  {Math.round(issue.aiAnalysis.confidence * 100)}% confident
                                </span>
                              </div>
                              <p className="text-xs text-purple-700">
                                {issue.aiAnalysis.priorityReason}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Photos */}
                        {issue.photos && issue.photos.length > 0 && (
                          <div className="lg:w-64">
                            <div className="grid grid-cols-2 gap-2">
                              {issue.photos.slice(0, 4).map((photo, index) => (
                                <img
                                  key={index}
                                  src={`data:${photo.mimetype};base64,${photo.data}`}
                                  alt={`Issue photo ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                              ))}
                              {issue.photos.length > 4 && (
                                <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
                                  +{issue.photos.length - 4} more
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm rounded-lg ${
                          pageNum === pagination.currentPage
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
