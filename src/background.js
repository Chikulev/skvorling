// Skvorling v2.6 Background Service Worker (Manifest V3)
'use strict';

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL('demo/demo.html') });
  }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg && msg.type === 'KONTEXT_BADGE' && sender.tab && sender.tab.id) {
    const count = Number(msg.count) || 0;
    chrome.action.setBadgeText({
      tabId: sender.tab.id,
      text: count > 0 ? (count > 99 ? '99+' : String(count)) : ''
    });
    chrome.action.setBadgeBackgroundColor({
      tabId: sender.tab.id,
      color: '#0d9488'
    });
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;

  if (command === 'toggle-kontext') {
    chrome.tabs.sendMessage(tab.id, { type: 'KONTEXT_TOGGLE' }).catch(() => {});
  } else if (command === 'open-navigator') {
    chrome.tabs.sendMessage(tab.id, { type: 'KONTEXT_OPEN_NAVIGATOR' }).catch(() => {});
  }
});
