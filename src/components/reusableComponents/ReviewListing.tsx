import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getReview } from '../../services/user/userService';
import Pagination from './Pagination';
import UserNavbar from '../userside/Navbar';
import LawyerNavbar from '../lawyer/Navbar';

interface Review {
  userName: string;
  date: string;
  feedback: string;
  rating: number;
}

interface ReviewsData {
  reviewsCount: number;
  rating: number;
  reviews: Review[];
}

function ReviewListing() {
  const { lawyerId, userType } = useParams();
  const [reviews, setReviews] = useState<ReviewsData | null>(null);
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const totalPages = Math.ceil(reviews?.reviews.length ? reviews.reviews.length / itemsPerPage : 0)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const data = reviews?.reviews.slice(startIndex, endIndex)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={18}
          className={`${i <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
            } transition-colors duration-200`}
        />
      );
    }
    return stars;
  };

  useEffect(() => {
    if (lawyerId) {
      getReview(lawyerId).then((response) => {
        setReviews(response.data.data);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {userType == 'user' ? <UserNavbar navLink='Lawyers' /> : <LawyerNavbar />}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 tracking-tight">
            Client Reviews
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            {reviews?.reviewsCount || 0} total reviews
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.map((review, index) => (
            <div
              key={index}
              className="group backdrop-blur-md bg-white/20 rounded-[20px] p-6 shadow-lg border border-white/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/20 hover:bg-white/25"
            >
              {/* Top row: Avatar, Name, Date */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {getInitials(review.userName)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">{review.userName}</h3>
                  <p className="text-gray-500 text-sm">{formatDate(review.date)}</p>
                </div>
              </div>

              {/* Middle row: Star Rating */}
              <div className="flex items-center gap-1 mb-4">
                {renderStars(review.rating)}
                <span className="ml-2 text-gray-600 font-medium">
                  ({review.rating}/5)
                </span>
              </div>

              {/* Bottom row: Feedback */}
              <p className="text-gray-700 leading-relaxed text-base">
                {review.feedback}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}

export default ReviewListing;
