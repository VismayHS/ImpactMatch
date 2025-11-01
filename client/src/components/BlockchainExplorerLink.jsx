import React from 'react';
import { ExternalLink, Copy } from 'lucide-react';
import { toast } from 'react-toastify';

// Blockchain explorer URLs by network
const EXPLORERS = {
  localhost: null, // No explorer for local Hardhat
  mumbai: 'https://mumbai.polygonscan.com',
  polygon: 'https://polygonscan.com',
};

// Get explorer URL from environment or default to Mumbai testnet
const getExplorerBaseUrl = () => {
  const network = import.meta.env.VITE_BLOCKCHAIN_NETWORK || 'mumbai';
  return EXPLORERS[network] || EXPLORERS.mumbai;
};

/**
 * BlockchainExplorerLink Component
 * Shows txHash with copy button and optional "View on Explorer" link
 */
const BlockchainExplorerLink = ({ 
  txHash, 
  showLabel = true, 
  className = '',
  truncate = true 
}) => {
  const explorerUrl = getExplorerBaseUrl();
  const displayHash = truncate 
    ? `${txHash.substring(0, 12)}...${txHash.substring(txHash.length - 8)}`
    : txHash;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(txHash);
    toast.success('Transaction hash copied!', { position: 'bottom-center' });
  };

  const openExplorer = () => {
    if (!explorerUrl) {
      toast.info('Running on local network - no explorer available', { position: 'bottom-center' });
      return;
    }
    window.open(`${explorerUrl}/tx/${txHash}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Transaction Hash Display */}
      <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-700">
        {displayHash}
      </code>

      {/* Copy Button */}
      <button
        onClick={copyToClipboard}
        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
        title="Copy full hash"
      >
        <Copy className="w-4 h-4 text-gray-600" />
      </button>

      {/* View on Explorer Button */}
      {explorerUrl && (
        <button
          onClick={openExplorer}
          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-medium rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all shadow-sm hover:shadow-md"
          title="View on PolygonScan"
        >
          {showLabel && <span>View on Explorer</span>}
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

/**
 * Compact version for tables
 */
export const BlockchainHashCell = ({ txHash }) => {
  const explorerUrl = getExplorerBaseUrl();
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(txHash);
    toast.success('Hash copied!');
  };

  return (
    <div className="flex items-center gap-2">
      <code 
        className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-mono cursor-pointer hover:bg-purple-100 transition-colors"
        onClick={copyToClipboard}
        title="Click to copy"
      >
        {txHash.substring(0, 10)}...{txHash.slice(-6)}
      </code>
      {explorerUrl && (
        <a
          href={`${explorerUrl}/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
          title="View on PolygonScan"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
};

/**
 * Badge version for cards
 */
export const BlockchainBadge = ({ txHash, label = 'Blockchain Proof' }) => {
  const explorerUrl = getExplorerBaseUrl();
  
  const openExplorer = () => {
    if (!explorerUrl) {
      toast.info('Local network - no explorer');
      return;
    }
    window.open(`${explorerUrl}/tx/${txHash}`, '_blank');
  };

  return (
    <div 
      onClick={openExplorer}
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full text-xs font-medium ${explorerUrl ? 'cursor-pointer hover:from-green-500 hover:to-emerald-600' : ''} transition-all shadow-sm`}
      title={explorerUrl ? 'Click to view on PolygonScan' : 'Blockchain verified'}
    >
      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
      <span>{label}</span>
      {explorerUrl && <ExternalLink className="w-3 h-3" />}
    </div>
  );
};

export default BlockchainExplorerLink;
