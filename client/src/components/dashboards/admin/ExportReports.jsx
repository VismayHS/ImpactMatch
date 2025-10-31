import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, TrendingUp, Users, Heart, CheckCircle } from 'lucide-react';
import api, { API_BASE_URL } from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportReports = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    // Set default date range (last 30 days)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
    
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [usersRes, causesRes, matchesRes, verificationsRes] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/causes'),
        api.get('/api/matches'),
        api.get('/api/verifications')
      ]);

      const allUsers = usersRes.data.users || usersRes.data || [];
      setStats({
        totalUsers: allUsers.filter(u => u.role === 'user').length,
        totalNGOs: allUsers.filter(u => u.role === 'organisation' || u.role === 'ngo').length,
        totalCauses: causesRes.data.length,
        activeCauses: causesRes.data.filter(c => c.status === 'active').length,
        totalMatches: matchesRes.data.length,
        totalVerifications: verificationsRes.data.length,
        usersData: allUsers,
        causesData: causesRes.data,
        matchesData: matchesRes.data,
        verificationsData: verificationsRes.data
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Failed to load statistics');
    }
  };

  const generatePlatformReport = () => {
    setLoading(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      // Header
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('ImpactMatch Platform Report', pageWidth / 2, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
      
      // Platform Overview
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text('Platform Overview', 14, 55);
      
      doc.autoTable({
        startY: 60,
        head: [['Metric', 'Value']],
        body: [
          ['Total Users', stats.totalUsers.toString()],
          ['Total NGOs', stats.totalNGOs.toString()],
          ['Total Causes', stats.totalCauses.toString()],
          ['Active Causes', stats.activeCauses.toString()],
          ['Total Volunteer Joins', stats.totalMatches.toString()],
          ['Blockchain Verifications', stats.totalVerifications.toString()]
        ],
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      });
      
      // Top NGOs by Causes
      const ngoStats = {};
      stats.causesData.forEach(cause => {
        const ngoId = cause.ngoId?._id || cause.ngoId;
        if (ngoId) {
          ngoStats[ngoId] = (ngoStats[ngoId] || 0) + 1;
        }
      });
      
      const topNGOs = Object.entries(ngoStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([ngoId, count]) => {
          const ngo = stats.usersData.find(u => u._id === ngoId);
          return [ngo?.name || 'Unknown', count.toString()];
        });
      
      doc.addPage();
      doc.setFontSize(16);
      doc.text('Top NGOs by Causes', 14, 20);
      
      doc.autoTable({
        startY: 25,
        head: [['NGO Name', 'Number of Causes']],
        body: topNGOs,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      });
      
      // Most Popular Causes
      const causeVolunteers = stats.causesData.map(cause => {
        const volunteers = stats.matchesData.filter(m => m.causeId === cause._id).length;
        return {
          title: cause.title,
          volunteers,
          ngo: cause.ngoId?.name || 'Unknown'
        };
      }).sort((a, b) => b.volunteers - a.volunteers).slice(0, 10);
      
      doc.setFontSize(16);
      doc.text('Top 10 Causes by Volunteers', 14, doc.lastAutoTable.finalY + 15);
      
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Cause Title', 'NGO', 'Volunteers']],
        body: causeVolunteers.map(c => [c.title, c.ngo, c.volunteers.toString()]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      });
      
      // Recent Activity
      const recentMatches = stats.matchesData
        .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
        .slice(0, 15)
        .map(match => {
          const user = stats.usersData.find(u => u._id === match.userId);
          const cause = stats.causesData.find(c => c._id === match.causeId);
          return [
            user?.name || 'Unknown',
            cause?.title || 'Unknown',
            new Date(match.joinDate).toLocaleDateString()
          ];
        });
      
      doc.addPage();
      doc.setFontSize(16);
      doc.text('Recent Activity (Last 15 Joins)', 14, 20);
      
      doc.autoTable({
        startY: 25,
        head: [['User', 'Cause', 'Join Date']],
        body: recentMatches,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      });
      
      // Footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
      }
      
      doc.save(`ImpactMatch_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const generateUserReport = () => {
    setLoading(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      // Header
      doc.setFillColor(139, 92, 246);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('User Analytics Report', pageWidth / 2, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
      
      // User Statistics
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text('User Engagement Statistics', 14, 55);
      
      const activeUsers = stats.usersData.filter(u => u.role === 'user' && !u.suspended).length;
      const suspendedUsers = stats.usersData.filter(u => u.role === 'user' && u.suspended).length;
      
      doc.autoTable({
        startY: 60,
        head: [['Metric', 'Value']],
        body: [
          ['Total Users', stats.totalUsers.toString()],
          ['Active Users', activeUsers.toString()],
          ['Suspended Users', suspendedUsers.toString()],
          ['Average Causes per User', (stats.totalMatches / stats.totalUsers).toFixed(2)],
          ['Users with Verifications', new Set(stats.verificationsData.map(v => v.userId)).size.toString()]
        ],
        theme: 'striped',
        headStyles: { fillColor: [139, 92, 246] }
      });
      
      // Top Active Users
      const userActivity = {};
      stats.matchesData.forEach(match => {
        userActivity[match.userId] = (userActivity[match.userId] || 0) + 1;
      });
      
      const topUsers = Object.entries(userActivity)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([userId, count]) => {
          const user = stats.usersData.find(u => u._id === userId);
          const verifications = stats.verificationsData.filter(v => v.userId === userId).length;
          return [user?.name || 'Unknown', count.toString(), verifications.toString()];
        });
      
      doc.setFontSize(16);
      doc.text('Top 10 Active Users', 14, doc.lastAutoTable.finalY + 15);
      
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [['User Name', 'Causes Joined', 'Verifications']],
        body: topUsers,
        theme: 'striped',
        headStyles: { fillColor: [139, 92, 246] }
      });
      
      // Footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
      }
      
      doc.save(`ImpactMatch_UserReport_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('User report generated successfully');
    } catch (error) {
      console.error('Error generating user report:', error);
      toast.error('Failed to generate user report');
    } finally {
      setLoading(false);
    }
  };

  const generateNGOReport = () => {
    setLoading(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      // Header
      doc.setFillColor(236, 72, 153);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('NGO Performance Report', pageWidth / 2, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
      
      // NGO Statistics
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text('NGO Overview', 14, 55);
      
      const verifiedNGOs = stats.usersData.filter(u => u.role === 'organisation' && u.verified).length;
      const pendingNGOs = stats.usersData.filter(u => u.role === 'organisation' && !u.verified).length;
      
      doc.autoTable({
        startY: 60,
        head: [['Metric', 'Value']],
        body: [
          ['Total NGOs', stats.totalNGOs.toString()],
          ['Verified NGOs', verifiedNGOs.toString()],
          ['Pending Approval', pendingNGOs.toString()],
          ['Total Causes Created', stats.totalCauses.toString()],
          ['Average Causes per NGO', (stats.totalCauses / stats.totalNGOs).toFixed(2)]
        ],
        theme: 'striped',
        headStyles: { fillColor: [236, 72, 153] }
      });
      
      // NGO Performance Details
      const ngoPerformance = stats.usersData
        .filter(u => u.role === 'organisation')
        .map(ngo => {
          const causes = stats.causesData.filter(c => c.ngoId?._id === ngo._id || c.ngoId === ngo._id);
          const volunteers = stats.matchesData.filter(m => 
            causes.some(c => c._id === m.causeId)
          ).length;
          return {
            name: ngo.name,
            causes: causes.length,
            volunteers,
            verified: ngo.verified ? 'Yes' : 'No'
          };
        })
        .sort((a, b) => b.volunteers - a.volunteers);
      
      doc.addPage();
      doc.setFontSize(16);
      doc.text('NGO Performance Details', 14, 20);
      
      doc.autoTable({
        startY: 25,
        head: [['NGO Name', 'Causes', 'Volunteers', 'Verified']],
        body: ngoPerformance.map(ngo => [ngo.name, ngo.causes.toString(), ngo.volunteers.toString(), ngo.verified]),
        theme: 'striped',
        headStyles: { fillColor: [236, 72, 153] }
      });
      
      // Footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
      }
      
      doc.save(`ImpactMatch_NGOReport_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('NGO report generated successfully');
    } catch (error) {
      console.error('Error generating NGO report:', error);
      toast.error('Failed to generate NGO report');
    } finally {
      setLoading(false);
    }
  };

  if (!stats) {
    return <div className="flex items-center justify-center h-96"><div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Export Reports
        </h1>
        <p className="text-gray-600">Generate comprehensive PDF reports for platform analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-blue-600">{stats.totalUsers}</h3>
          <p className="text-gray-600 text-sm">Total Users</p>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-purple-600">{stats.totalNGOs}</h3>
          <p className="text-gray-600 text-sm">NGOs</p>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-pink-600">{stats.totalCauses}</h3>
          <p className="text-gray-600 text-sm">Causes</p>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-green-600">{stats.totalVerifications}</h3>
          <p className="text-gray-600 text-sm">Verifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white cursor-pointer"
          onClick={generatePlatformReport}
        >
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-12 h-12" />
            <FileText className="w-8 h-8 opacity-50" />
          </div>
          <h3 className="text-xl font-bold mb-2">Platform Report</h3>
          <p className="text-blue-100 text-sm mb-4">
            Comprehensive overview of platform metrics, top NGOs, popular causes, and recent activity
          </p>
          <button
            disabled={loading}
            className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Generate PDF
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-8 text-white cursor-pointer"
          onClick={generateUserReport}
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-12 h-12" />
            <FileText className="w-8 h-8 opacity-50" />
          </div>
          <h3 className="text-xl font-bold mb-2">User Analytics</h3>
          <p className="text-purple-100 text-sm mb-4">
            Detailed user engagement statistics, top active users, and participation metrics
          </p>
          <button
            disabled={loading}
            className="w-full bg-white text-purple-600 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Generate PDF
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg p-8 text-white cursor-pointer"
          onClick={generateNGOReport}
        >
          <div className="flex items-center justify-between mb-4">
            <Heart className="w-12 h-12" />
            <FileText className="w-8 h-8 opacity-50" />
          </div>
          <h3 className="text-xl font-bold mb-2">NGO Performance</h3>
          <p className="text-pink-100 text-sm mb-4">
            NGO statistics, performance details, verification status, and cause impact metrics
          </p>
          <button
            disabled={loading}
            className="w-full bg-white text-pink-600 py-2 rounded-lg font-medium hover:bg-pink-50 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Generate PDF
          </button>
        </motion.div>
      </div>

      {loading && (
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 text-center border border-white/20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Generating report...</p>
        </div>
      )}
    </div>
  );
};

export default ExportReports;
