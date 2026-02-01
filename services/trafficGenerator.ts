import { TrafficPacket, PacketStatus, AccessRequest, VpnProvider } from '../types';

const SHOPPING_DOMAINS = [
  'api.shopee.co.th', 'log.shopee.com', 'tracking.lazada.co.th', 
  'ads.lazada.com', 'analytics.aliexpress.com', 'kaidee-ads.com'
];
const SHOPPING_PROCESSES = ['com.shopee.app', 'lazada.mobile', 'chrome.exe', 'safari'];

const TRACKER_DOMAINS = [
  'google-analytics.com', 'doubleclick.net', 'facebook.net', 
  'pixel.tiktok.com', 'ads.twitter.com', 'app-measurement.com'
];
const TRACKER_PROCESSES = ['background_transfer', 'analytics_agent', 'browser_helper'];

const AD_DOMAINS = [
  'r3---sn-n4v7kn7z.googlevideo.com', 'ads.youtube.com', 's.youtube.com',
  'pagead2.googlesyndication.com', 'adservice.google.com', 'video-ads-static.fb.com',
  'amazon-adsystem.com', 'adnxs.com', 'taboola.com'
];

const CONTENT_DOMAINS = [
  'googleapis.com', 'cloudflare.com', 'github.com', 
  'stackoverflow.com', 'reactjs.org', 'youtube.com', 'netflix.com', 'discord.gg', 'steam-api.com'
];
const CONTENT_PROCESSES = ['chrome.exe', 'firefox.exe', 'spotify.exe', 'code.exe', 'zoom.us', 'discord.exe', 'steam.exe', 'youtube_app'];

const SYSTEM_PROCESSES = ['svchost.exe', 'kernel_task', 'system', 'network_daemon'];

const NAMES = ['Somchai J.', 'Nattaporn K.', 'David S.', 'Sarah W.', 'Ananda P.'];

const generateIp = (isVpn: boolean, provider?: VpnProvider) => {
  if (isVpn) {
    if (provider === 'DTAC') {
      return `172.16.0.${Math.floor(Math.random() * 254) + 1}`;
    }
    return `10.8.0.${Math.floor(Math.random() * 254) + 1}`;
  }
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

const generateMac = () => Array.from({length: 6}, () => Math.floor(Math.random()*16).toString(16)).join(':').toUpperCase();

export const generatePacket = (blocklist: string[], firewallPorts: number[], isVpn: boolean = false, provider?: VpnProvider): TrafficPacket => {
  const rand = Math.random();
  let domain = '';
  let category: TrafficPacket['category'] = 'System';
  let port = 443;
  let process = 'system';
  let downloadRate = 0.1;
  let uploadRate = 0.1;
  let latency = Math.floor(Math.random() * 20) + 5; 

  if (isVpn) latency += 12;

  if (rand < 0.25) {
    // 25% Advertisements (YouTube/App Injected)
    domain = AD_DOMAINS[Math.floor(Math.random() * AD_DOMAINS.length)];
    category = 'Ad';
    process = rand < 0.15 ? 'youtube_app' : 'browser_process';
    port = 443;
    downloadRate = parseFloat((Math.random() * 2).toFixed(1));
    uploadRate = parseFloat((Math.random() * 0.5).toFixed(1));
  } else if (rand < 0.45) {
    // 20% Shopping/Trackers
    domain = Math.random() > 0.5 ? SHOPPING_DOMAINS[Math.floor(Math.random() * SHOPPING_DOMAINS.length)] : TRACKER_DOMAINS[Math.floor(Math.random() * TRACKER_DOMAINS.length)];
    category = domain.includes('ads') || domain.includes('analytics') ? 'Tracker' : 'Shopping';
    process = SHOPPING_PROCESSES[Math.floor(Math.random() * SHOPPING_PROCESSES.length)];
    port = 443;
    downloadRate = parseFloat((Math.random() * 5).toFixed(1));
  } else {
    // 55% Safe Content
    domain = CONTENT_DOMAINS[Math.floor(Math.random() * CONTENT_DOMAINS.length)];
    category = 'Content';
    process = CONTENT_PROCESSES[Math.floor(Math.random() * CONTENT_PROCESSES.length)];
    
    const isGaming = domain.includes('discord') || domain.includes('steam');
    if (provider === 'DTAC' && isVpn && isGaming) {
      latency = Math.floor(Math.random() * 10) + 15;
      downloadRate = parseFloat((Math.random() * 50 + 50).toFixed(1));
    }

    port = 443;
    if (!isGaming) {
      downloadRate = parseFloat((Math.random() * (isVpn ? 30 : 100)).toFixed(1)); 
      uploadRate = parseFloat((Math.random() * 10).toFixed(1));
    }
  }

  // Final check against blocklist
  const isDomainBlocked = blocklist.some(rule => domain.toLowerCase().includes(rule.toLowerCase()));
  const isPortBlocked = firewallPorts.includes(port);
  
  let status = PacketStatus.ALLOWED;
  if (isDomainBlocked || isPortBlocked) status = PacketStatus.BLOCKED;

  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
    sourceIp: generateIp(isVpn, provider),
    destinationDomain: domain,
    processName: process,
    destinationPort: port,
    protocol: 'TCP',
    size: Math.floor(Math.random() * 1500) + 200,
    downloadRate,
    uploadRate,
    latency: Math.floor(latency),
    category: category,
    status: status,
    riskScore: status === PacketStatus.BLOCKED ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 20)
  };
};

export const generateAccessRequest = (): AccessRequest => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    userName: NAMES[Math.floor(Math.random() * NAMES.length)],
    source: 'Facebook',
    ipAddress: generateIp(false),
    macAddress: generateMac(),
    timestamp: Date.now(),
    status: 'PENDING'
  };
};