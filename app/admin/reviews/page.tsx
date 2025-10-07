'use client';

import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Flag, Star, Eye, AlertTriangle } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { ReviewModeration } from '@/lib/types/admin';
import Button from '@/components/ui/Button';

const AdminReviewsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'flagged' | 'approved' | 'rejected'>('flagged');
  const [selectedReview, setSelectedReview] = useState<ReviewModeration | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Mock flagged reviews
  const [reviews, setReviews] = useState<ReviewModeration[]>([
    {
      reviewId: 'rev_1',
      propertyId: 'prop_1',
      reviewerId: 'user_1',
      reviewerName: 'John Doe',
      rating: 1,
      comment: 'This place was terrible! The host was rude and the apartment was dirty. Complete waste of money. I would never recommend this to anyone. Absolutely the worst experience I\'ve ever had!',
      status: 'flagged',
      flags: [
        {
          type: 'offensive',
          confidence: 85,
          detectedBy: 'auto',
        },
      ],
      reports: [
        {
          reporterId: 'host_1',
          reporterName: 'Ahmed Al-Rashid',
          reason: 'False accusations',
          description: 'Guest is making false claims. We have proof property was clean.',
          reportedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      reviewId: 'rev_2',
      propertyId: 'prop_2',
      reviewerId: 'user_2',
      reviewerName: 'Spam Account',
      rating: 5,
      comment: 'Best place ever!!!! Visit my website www.scam-site.com for cheap properties!!!',
      status: 'flagged',
      flags: [
        {
          type: 'spam',
          confidence: 95,
          detectedBy: 'auto',
        },
      ],
      reports: [],
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = searchQuery === '' || 
      review.reviewerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (reviewId: string) => {
    setReviews(prev => 
      prev.map(r => r.reviewId === reviewId ? { ...r, status: 'approved' as const } : r)
    );
    setShowModal(false);
    alert('Review approved and published!');
  };

  const handleReject = (reviewId: string) => {
    setReviews(prev => 
      prev.map(r => r.reviewId === reviewId ? { ...r, status: 'rejected' as const } : r)
    );
    setShowModal(false);
    alert('Review rejected and hidden from public view.');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      flagged: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      
      <main className="flex-1 overflow-x-hidden">
        <AdminHeader 
          title="Review Moderation" 
          subtitle="Review flagged and reported content"
        />

        <div className="p-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Flagged</p>
              <p className="text-2xl font-bold text-orange-600">{reviews.filter(r => r.status === 'flagged').length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{reviews.filter(r => r.status === 'pending').length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-green-600">{reviews.filter(r => r.status === 'approved').length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{reviews.filter(r => r.status === 'rejected').length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search reviews..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="flagged">Flagged</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.reviewId} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-2 border-orange-200 dark:border-orange-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{review.reviewerName}</h3>
                      <div className="flex items-center space-x-1 bg-[#006699] px-2 py-1 rounded">
                        <Star className="h-4 w-4 text-white fill-white" />
                        <span className="text-white font-bold">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Review ID: {review.reviewId}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(review.status)}`}>
                    {review.status}
                  </span>
                </div>

                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-900 dark:text-white">{review.comment}</p>
                </div>

                {/* Flags */}
                {review.flags.length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-900 dark:text-red-100">Auto-detected Issues</p>
                        {review.flags.map((flag, index) => (
                          <p key={index} className="text-xs text-red-700 dark:text-red-300">
                            • {flag.type} ({flag.confidence}% confidence)
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reports */}
                {review.reports.length > 0 && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                      User Reports ({review.reports.length})
                    </p>
                    {review.reports.map((report, index) => (
                      <div key={index} className="text-sm text-yellow-700 dark:text-yellow-300 mb-1">
                        <p className="font-medium">{report.reporterName}: {report.reason}</p>
                        <p className="text-xs">{report.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {review.status === 'flagged' && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(review.reviewId)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleReject(review.reviewId)}
                      className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedReview(review);
                        setShowModal(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-md border border-gray-200 dark:border-gray-700 text-center">
              <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No flagged reviews found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminReviewsPage;
