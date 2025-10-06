import React, { useState, useCallback, useEffect } from "react";
import BatchUrl from "./tabs/BatchUrl";
import ProfileManager from "./tabs/ProfileManager";
import Extractor from "./tabs/Extractor";
import BlockSite from "./tabs/BlockSite";
import Redirect from "./tabs/Redirect";
import { TABS, TAB_LABELS, APP_NAME, DEFAULT_EXPORT_FORMAT } from "./constants";
import {
  getActiveTab,
  saveActiveTab,
  getCurrentState,
  saveCurrentState,
} from "./utils/storage";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState(TABS.BATCH_URL);
  const [currentState, setCurrentState] = useState({});

  // Settings for other tabs
  const [exportFormat, setExportFormat] = useState(DEFAULT_EXPORT_FORMAT);
  const [blockedDomains, setBlockedDomains] = useState([]);
  const [redirectRules, setRedirectRules] = useState([]);

  // Load initial state
  useEffect(() => {
    const loadData = async () => {
      const savedTab = await getActiveTab();
      if (savedTab) setActiveTab(savedTab);

      const state = await getCurrentState();
      if (state) {
        setCurrentState(state);
        if (state.exportFormat) setExportFormat(state.exportFormat);
        if (state.blockedDomains) setBlockedDomains(state.blockedDomains);
        if (state.redirectRules) setRedirectRules(state.redirectRules);
      }
    };
    loadData();
  }, []);

  const handleStateChange = useCallback(async (newState) => {
    setCurrentState(newState);
    await saveCurrentState(newState);
  }, []);

  const handleSettingsChange = useCallback(
    async (settings) => {
      // Update individual settings
      if (settings.exportFormat !== undefined)
        setExportFormat(settings.exportFormat);
      if (settings.blockedDomains !== undefined)
        setBlockedDomains(settings.blockedDomains);
      if (settings.redirectRules !== undefined)
        setRedirectRules(settings.redirectRules);

      // Save to storage
      const updatedState = { ...currentState, ...settings };
      setCurrentState(updatedState);
      await saveCurrentState(updatedState);
    },
    [currentState]
  );

  const handleLoadProfile = useCallback(async (profileData) => {
    setCurrentState(profileData);
    await saveCurrentState(profileData);

    // Load settings for other tabs
    setExportFormat(profileData.exportFormat || DEFAULT_EXPORT_FORMAT);
    setBlockedDomains(profileData.blockedDomains || []);
    setRedirectRules(profileData.redirectRules || []);
  }, []);

  const handleTabChange = useCallback(async (tabName) => {
    setActiveTab(tabName);
    await saveActiveTab(tabName);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <img src="/icon16.png" alt="Heta" className="app-logo" />
          {APP_NAME}
        </h1>
      </header>

      <div className="tabs">
        {Object.entries(TABS).map(([key, value]) => (
          <button
            key={value}
            className={`tab ${activeTab === value ? "active" : ""}`}
            onClick={() => handleTabChange(value)}
          >
            {TAB_LABELS[value]}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === TABS.BATCH_URL && (
          <BatchUrl
            currentState={currentState}
            onStateChange={handleStateChange}
          />
        )}
        {activeTab === TABS.PROFILES && (
          <ProfileManager
            currentState={{
              ...currentState,
              exportFormat,
              blockedDomains,
              redirectRules,
            }}
            onLoadProfile={handleLoadProfile}
          />
        )}
        {activeTab === TABS.EXTRACTOR && (
          <Extractor
            exportFormat={exportFormat}
            onExportFormatChange={(format) =>
              handleSettingsChange({ exportFormat: format })
            }
          />
        )}
        {activeTab === TABS.BLOCK_SITE && (
          <BlockSite
            blockedDomains={blockedDomains}
            onBlockedDomainsChange={(domains) =>
              handleSettingsChange({ blockedDomains: domains })
            }
          />
        )}
        {activeTab === TABS.REDIRECT && (
          <Redirect
            redirectRules={redirectRules}
            onRedirectRulesChange={(rules) =>
              handleSettingsChange({ redirectRules: rules })
            }
          />
        )}
      </div>
    </div>
  );
}

export default App;
