'use client';

import React, { useState, useEffect } from 'react';
import { X, Camera, User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, uploadProfilePicture } = useAuth();
  console.log('🔵 User in UserProfileModal:', user);``
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState<{
    email: boolean;
    phone: boolean;
    emirateID: boolean;
  }>({
    email: false,
    phone: false,
    emirateID: false
  });
  const [verificationModal, setVerificationModal] = useState<{
    type: 'email' | 'phone' | 'emirateID' | null;
    step: 'input' | 'code' | 'upload' | 'success';
    data: any;
  }>({
    type: null,
    step: 'input',
    data: {}
  });
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    bio: user?.bio || '',
    work: user?.work || '',
    location: user?.location || '',
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        bio: user.bio || '',
        work: user.work || '',
        location: user.location || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Convert phone field to phoneNumber for the User interface
      const userData = {
        ...formData,
        phoneNumber: formData.phone,
        phone: undefined // Remove the phone field
      };
      delete userData.phone; // Remove the phone field
      
      await updateProfile(userData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phoneNumber || '',
      bio: user?.bio || '',
      work: user?.work || '',
      location: user?.location || '',
    });
    setIsEditing(false);
  };

  const handleEmailVerification = () => {
    setVerificationModal({
      type: 'email',
      step: 'input',
      data: { email: user?.email }
    });
  };

  const handlePhoneVerification = () => {
    setVerificationModal({
      type: 'phone',
      step: 'input',
      data: { phoneNumber: user?.phoneNumber || '' }
    });
  };

  const handleEmirateIDVerification = () => {
    setVerificationModal({
      type: 'emirateID',
      step: 'input',
      data: {}
    });
  };

  const closeVerificationModal = () => {
    setVerificationModal({
      type: null,
      step: 'input',
      data: {}
    });
  };

  const handleVerificationSubmit = async (formData: any) => {
    if (!verificationModal.type) return;

    setVerificationLoading(prev => ({ ...prev, [verificationModal.type!]: true }));

    try {
      if (verificationModal.type === 'email') {
        // Simulate sending verification email
        await new Promise(resolve => setTimeout(resolve, 2000));
        setVerificationModal(prev => ({ ...prev, step: 'success' }));
      } else if (verificationModal.type === 'phone') {
        // Simulate sending SMS
        await new Promise(resolve => setTimeout(resolve, 2000));
        setVerificationModal(prev => ({ 
          ...prev, 
          step: 'code',
          data: { ...prev.data, phoneNumber: formData.phoneNumber }
        }));
      } else if (verificationModal.type === 'emirateID') {
        // Simulate ID verification
        await new Promise(resolve => setTimeout(resolve, 2000));
        setVerificationModal(prev => ({ 
          ...prev, 
          step: 'upload',
          data: { ...prev.data, emirateID: formData.emirateID }
        }));
      }
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setVerificationLoading(prev => ({ ...prev, [verificationModal.type!]: false }));
    }
  };

  const handleCodeVerification = async (code: string) => {
    if (!verificationModal.type) return;

    setVerificationLoading(prev => ({ ...prev, [verificationModal.type!]: true }));

    try {
      // Simulate code verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (code.length === 6) {
        setVerificationModal(prev => ({ ...prev, step: 'success' }));
        
        // Update user verification status
        if (user && verificationModal.type === 'phone') {
          const updatedUser = { 
            ...user, 
            isPhoneVerified: true, 
            phoneNumber: verificationModal.data.phoneNumber 
          };
          await updateProfile(updatedUser);
        }
      } else {
        alert('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Code verification failed:', error);
      alert('Failed to verify code. Please try again.');
    } finally {
      setVerificationLoading(prev => ({ ...prev, [verificationModal.type!]: false }));
    }
  };

  const handleDocumentUpload = async (file: File) => {
    if (!verificationModal.type) return;

    setVerificationLoading(prev => ({ ...prev, [verificationModal.type!]: true }));

    try {
      // Simulate document upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      setVerificationModal(prev => ({ ...prev, step: 'success' }));
      
      // Update user verification status
      if (user && verificationModal.type === 'emirateID') {
        const updatedUser = { ...user, emirateID: true };
        await updateProfile(updatedUser);
      }
    } catch (error) {
      console.error('Document upload failed:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setVerificationLoading(prev => ({ ...prev, [verificationModal.type!]: false }));
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('📁 File selected:', file);
    
    if (!file) {
      console.log('❌ No file selected');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('❌ Invalid file type:', file.type);
      alert('Please select an image file');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      console.log('❌ File too large:', file.size);
      alert('File size must be less than 2MB');
      return;
    }

    console.log('✅ File validation passed, creating preview...');

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      console.log('🖼️ Preview created:', result.substring(0, 50) + '...');
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    setUploadSuccess(false);
    try {
      console.log('📤 Starting upload...');
      const imageUrl = await uploadProfilePicture(file);
      console.log('✅ Photo uploaded successfully:', imageUrl);
      setUploadSuccess(true);
      // Don't clear preview immediately - let user see the result
      // The AuthProvider will update the user state automatically
      setTimeout(() => {
        setPreviewImage(null);
        setUploadSuccess(false);
      }, 3000); // Clear preview after 3 seconds
    } catch (error) {
      console.error('❌ Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
      setPreviewImage(null);
      setUploadSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Picture */}
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={previewImage || user.profilePicture}
                alt={user.firstName}
                className="h-24 w-24 rounded-full object-cover mx-auto"
              />
              <label className="absolute -bottom-2 -right-2 p-2 bg-[#006699] text-white rounded-full hover:bg-[#005588] transition-colors cursor-pointer">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {isUploading ? 'Uploading...' : uploadSuccess ? 'Photo updated successfully! ✅' : 'Click to change photo'}
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 disabled:bg-gray-100 dark:disabled:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 disabled:bg-gray-100 dark:disabled:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 disabled:bg-gray-100 dark:disabled:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>


          {/* Verification Status */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Shield className="h-5 w-5 text-[#006699] mr-2" />
              Verification Status
            </h3>
            <div className="space-y-4">
              {/* Email Verification */}
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    user.isEmailVerified ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Email</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    user.isEmailVerified 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-400'
                  }`}>
                    {user.isEmailVerified ? 'Verified' : 'Not verified'}
                  </span>
                  {!user.isEmailVerified && (
                    <button
                      onClick={handleEmailVerification}
                      disabled={verificationLoading.email}
                      className="px-3 py-1 text-xs bg-[#006699] text-white rounded hover:bg-[#005588] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {verificationLoading.email ? 'Sending...' : 'Verify'}
                    </button>
                  )}
                </div>
              </div>

              {/* Phone Verification */}
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    user.isPhoneVerified ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Phone</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.phoneNumber || 'No phone number added'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    user.isPhoneVerified 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-400'
                  }`}>
                    {user.isPhoneVerified ? 'Verified' : 'Not verified'}
                  </span>
                  {!user.isPhoneVerified && (
                    <button
                      onClick={handlePhoneVerification}
                      disabled={verificationLoading.phone}
                      className="px-3 py-1 text-xs bg-[#006699] text-white rounded hover:bg-[#005588] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {verificationLoading.phone ? 'Verifying...' : 'Verify'}
                    </button>
                  )}
                </div>
              </div>

              {/* Emirate ID Verification */}
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    user.emirateID ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Emirate ID</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.emirateID ? 'Government ID verified' : 'Upload your Emirate ID'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    user.emirateID 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-400'
                  }`}>
                    {user.emirateID ? 'Verified' : 'Not verified'}
                  </span>
                  {!user.emirateID && (
                    <button
                      onClick={handleEmirateIDVerification}
                      disabled={verificationLoading.emirateID}
                      className="px-3 py-1 text-xs bg-[#006699] text-white rounded hover:bg-[#005588] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {verificationLoading.emirateID ? 'Processing...' : 'Verify'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Verification Modal */}
      {verificationModal.type && (
        <VerificationModal
          type={verificationModal.type}
          step={verificationModal.step}
          data={verificationModal.data}
          isLoading={verificationLoading[verificationModal.type]}
          onClose={closeVerificationModal}
          onSubmit={handleVerificationSubmit}
          onCodeVerify={handleCodeVerification}
          onDocumentUpload={handleDocumentUpload}
        />
      )}
    </div>
  );
};

// Verification Modal Component
interface VerificationModalProps {
  type: 'email' | 'phone' | 'emirateID';
  step: 'input' | 'code' | 'upload' | 'success';
  data: any;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  onCodeVerify: (code: string) => void;
  onDocumentUpload: (file: File) => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  type,
  step,
  data,
  isLoading,
  onClose,
  onSubmit,
  onCodeVerify,
  onDocumentUpload
}) => {
  const [formData, setFormData] = useState({
    phoneNumber: data.phoneNumber || '',
    emirateID: data.emirateID || '',
    code: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCodeVerify(formData.code);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onDocumentUpload(file);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'email': return 'Verify Email Address';
      case 'phone': return 'Verify Phone Number';
      case 'emirateID': return 'Verify Emirate ID';
      default: return 'Verification';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'email': return 'We\'ll send a verification link to your email address.';
      case 'phone': return 'We\'ll send a verification code to your phone number.';
      case 'emirateID': return 'Upload a clear photo of your Emirate ID for verification.';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{getTitle()}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'input' && (
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{getDescription()}</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {type === 'phone' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+971 50 123 4567"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      required
                    />
                  </div>
                )}

                {type === 'emirateID' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Emirate ID Number
                    </label>
                    <input
                      type="text"
                      name="emirateID"
                      value={formData.emirateID}
                      onChange={handleInputChange}
                      placeholder="784-1234-5678901-2"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Enter your 15-digit Emirate ID number
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Sending...' : 'Send Verification'}
                </button>
              </form>
            </div>
          )}

          {step === 'code' && type === 'phone' && (
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We sent a 6-digit code to <strong>{data.phoneNumber}</strong>. Enter it below:
              </p>
              
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-center text-lg tracking-widest text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || formData.code.length !== 6}
                  className="w-full px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </button>
              </form>
            </div>
          )}

          {step === 'upload' && type === 'emirateID' && (
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Upload a clear photo of your Emirate ID (ID: {data.emirateID})
              </p>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Click to upload or drag and drop
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] cursor-pointer transition-colors"
                >
                  Choose File
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  PNG, JPG up to 10MB
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {type === 'email' && 'Verification Email Sent!'}
                {type === 'phone' && 'Phone Number Verified!'}
                {type === 'emirateID' && 'Document Uploaded Successfully!'}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {type === 'email' && 'Please check your inbox and click the verification link.'}
                {type === 'phone' && 'Your phone number has been successfully verified.'}
                {type === 'emirateID' && 'Your document is under review and will be verified within 24 hours.'}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
