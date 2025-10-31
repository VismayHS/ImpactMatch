import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, User, Mail, MapPin, FileText, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173';

const NGOSettings = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    officeAddress: ''
  });
  const [certificateFile, setCertificateFile] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    setFormData({
      name: userData?.name || '',
      email: userData?.email || '',
      city: userData?.city || '',
      officeAddress: userData?.officeAddress || ''
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCertificateChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setCertificateFile(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = user._id || user.id;
      const response = await axios.put(`${API_BASE_URL}/api/users/${userId}`, {
        name: formData.name,
        email: formData.email,
        city: formData.city,
        officeAddress: formData.officeAddress
      });

      // Update local storage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCertificate = async (e) => {
    e.preventDefault();
    if (!certificateFile) {
      toast.warning('Please select a certificate file');
      return;
    }

    setLoading(true);
    try {
      const userId = user._id || user.id;
      const formDataToSend = new FormData();
      formDataToSend.append('certificate', certificateFile);
      formDataToSend.append('userId', userId);
      formDataToSend.append('registrationNumber', `RE-${Date.now()}`);

      await axios.post(`${API_BASE_URL}/api/users/upload-certificate`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Certificate uploaded successfully! Awaiting admin verification.');
      setCertificateFile(null);
      
      // Update user status
      const updatedUser = { ...user, certificateUploaded: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Upload certificate error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
          NGO Settings
        </h1>
        <p className="text-gray-600">Manage your organization profile and verification documents</p>
      </div>

      {/* Verification Status */}
      {!user?.verified && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">Verification Pending</h3>
            <p className="text-sm text-yellow-800">
              Your NGO is awaiting admin verification. Upload your registration certificate if you haven't already.
            </p>
          </div>
        </motion.div>
      )}

      {user?.verified && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900 mb-1">✅ Verified NGO</h3>
            <p className="text-sm text-green-800">
              Your organization has been verified by the admin. You have full access to all features.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h2>
          
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* NGO Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                NGO Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Office Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Office Address
              </label>
              <textarea
                name="officeAddress"
                value={formData.officeAddress}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Certificate Upload */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Verification Documents</h2>
          
          <form onSubmit={handleUploadCertificate} className="space-y-4">
            {/* Certificate Status */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Certificate Status:</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user?.certificateUploaded 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {user?.certificateUploaded ? 'Uploaded' : 'Not Uploaded'}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium text-gray-700">Verification Status:</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user?.verified 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {user?.verified ? '✓ Verified' : 'Pending'}
                </span>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                {user?.certificateUploaded ? 'Re-upload Certificate' : 'Upload Registration Certificate'}
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleCertificateChange}
                  className="hidden"
                  id="certificate-upload"
                />
                <label
                  htmlFor="certificate-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-8 rounded-lg border-2 border-dashed border-gray-300 hover:border-teal-500 cursor-pointer transition-colors bg-gray-50"
                >
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-gray-600">
                    {certificateFile ? certificateFile.name : 'Click to upload (PDF, JPG, PNG)'}
                  </span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Maximum file size: 5MB. Accepted formats: PDF, JPG, PNG
              </p>
            </div>

            {/* Upload Button */}
            <button
              type="submit"
              disabled={loading || !certificateFile}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>Uploading...</>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Certificate
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Upload your NGO's official registration certificate. 
              The admin will review and verify your organization within 24-48 hours.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NGOSettings;
