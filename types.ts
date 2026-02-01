export enum PacketStatus {
  ALLOWED = 'ALLOWED',
  BLOCKED = 'BLOCKED',
  SUSPICIOUS = 'SUSPICIOUS',
  PENDING_AUTH = 'PENDING_AUTH'
}

export type VpnProvider = 'AIS' | 'DTAC';
export type VpnPackage = 'AIS_FREE_NET' | 'DTAC_SOCIAL_GAMING';

export interface TrafficPacket {
  id: string;
  timestamp: number;
  sourceIp: string;
  processName: string; 
  destinationDomain: string;
  destinationPort: number;
  protocol: 'TCP' | 'UDP';
  size: number; // in bytes
  downloadRate: number; // Mbps
  uploadRate: number; // Mbps
  latency: number; // ms
  category: 'Shopping' | 'Social' | 'Tracker' | 'Content' | 'System' | 'Ad';
  status: PacketStatus;
  riskScore: number; // 0-100
}

export interface BlockRule {
  id: string;
  pattern: string;
  isActive: boolean;
  category: string;
}

export interface AccessRequest {
  id: string;
  userName: string;
  avatarUrl?: string; // Placeholder for FB avatar
  source: 'Facebook' | 'Google' | 'Guest';
  ipAddress: string;
  macAddress: string;
  timestamp: number;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
}

export interface GeminiAnalysisResult {
  threatLevel: string;
  explanation: string;
  recommendation: string;
}