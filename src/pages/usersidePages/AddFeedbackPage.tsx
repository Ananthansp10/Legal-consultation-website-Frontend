import React, { useEffect, useState } from 'react';
import { Star, Check, User, Heart, Award, Shield } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { addReview, getLawyerChatProfile } from '../../services/user/userService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

function AddFeedbackPage() {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const navigate = useNavigate()

  const userName = useSelector((state: RootState) => state.auth.user?.name)

  const maxCharacters = 500;
  const characterCount = feedback.length;

  interface LawyerData {
    name: string;
    profileImage: string;
    specialization: string;
    courtName: string;
  }

  const [lawyer, setLawyer] = useState<LawyerData | null>(null)

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex);
  };

  const handleStarHover = (starIndex: number) => {
    setHoverRating(starIndex);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReview(lawyerId!, {
      userName: userName!,
      date: new Date().toISOString().split('T')[0],
      feedback: feedback,
      rating: rating
    }).then((response) => {
      toast.success(response.data.message)
      navigate(-1)
    })
  };

  const handleCancel = () => {
    setRating(0);
    setFeedback('');
    setIsSubmitted(false);
  };

  const { lawyerId } = useParams()

  useEffect(() => {
    getLawyerChatProfile(lawyerId!).then((response) => {
      setLawyer(response.data.data)
    })
  }, [])

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-10 w-full max-w-md text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">Thank you!</h2>
            <p className="text-gray-600 text-lg">Your review has been submitted successfully.</p>
            <div className="flex justify-center space-x-2 mt-4">
              <Heart className="w-5 h-5 text-red-400 animate-pulse" />
              <Heart className="w-5 h-5 text-red-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <Heart className="w-5 h-5 text-red-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-x-36 -translate-y-36 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-200/20 to-pink-200/20 rounded-full translate-x-48 translate-y-48 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-10 w-full max-w-2xl relative overflow-hidden">
        {/* Card decorations */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-yellow-200/20 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full translate-y-16 -translate-x-16"></div>
        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-3">Share Your Experience</h1>
            <p className="text-gray-600 text-lg">Help others by reviewing this attorney</p>
          </div>

          {/* Lawyer Profile */}
          <div className="flex items-center space-x-6 mb-10 p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl border border-blue-100/50 shadow-sm">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-r from-gray-200 to-gray-300 flex-shrink-0 shadow-lg ring-4 ring-white">
              <img
                src={lawyer?.profileImage}
                alt={lawyer?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-500">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{lawyer?.name}</h2>
              <p className="text-gray-600 text-lg mb-2">{lawyer?.specialization}</p>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-600 font-medium">Verified Attorney</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Star Rating */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Rate your experience
              </label>
              <div className="flex justify-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                    className="p-2 transition-all duration-200 hover:scale-125 hover:rotate-12 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded-full"
                  >
                    <Star
                      className={`w-10 h-10 transition-all duration-300 ${star <= (hoverRating || rating)
                          ? 'text-yellow-400 fill-yellow-400 drop-shadow-lg'
                          : 'text-gray-300 hover:text-yellow-200'
                        }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good!' : rating === 3 ? 'Good!' : rating === 2 ? 'Fair' : 'Poor'}
                </p>
              )}
            </div>

            {/* Feedback Text Area */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Your feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience with this attorney. Your feedback helps others make informed decisions..."
                maxLength={maxCharacters}
                rows={5}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-300 text-gray-700 placeholder-gray-400 bg-white/50 backdrop-blur-sm shadow-sm"
              />
            </div>

            {/* Character Counter */}
            <div className="flex justify-end mb-8">
              <span className={`text-sm font-medium ${characterCount > maxCharacters * 0.9 ? 'text-red-500' : 'text-gray-600'
                }`}>
                {characterCount}/{maxCharacters} characters
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={rating === 0 || !feedback.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 hover:shadow-2xl hover:shadow-blue-500/25 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:hover:scale-100 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
              >
                Submit Feedback
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold text-lg transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-gray-300/30"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Trust Badge */}
          <div className="mt-10 text-center">
            <div className="flex justify-center items-center space-x-2 mb-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600">Secure & Confidential</span>
            </div>
            <p className="text-sm text-gray-500">
              Your review will help others make informed decisions while maintaining your privacy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddFeedbackPage;