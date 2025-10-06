import React, { useState, useEffect } from "react";
import BatchUrl from "./tabs/BatchUrl";
import ProfileManager from "./tabs/ProfileManager";
import Extractor from "./tabs/Extractor";
import BlockSite from "./tabs/BlockSite";
import Redirect from "./tabs/Redirect";
import {
  getCurrentState,
  saveCurrentState,
  getActiveTab,
  saveActiveTab,
} from "./utils/storage";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("batch-url");
  const [currentState, setCurrentState] = useState({});

  // Settings for other tabs
  const [exportFormat, setExportFormat] = useState("<url>");
  const [blockedDomains, setBlockedDomains] = useState([]);
  const [redirectRules, setRedirectRules] = useState([]);

  useEffect(() => {
    loadCurrentState();
    loadActiveTab();
  }, []);

  const loadCurrentState = async () => {
    const state = await getCurrentState();
    if (state) {
      setCurrentState(state);
      // Load settings for other tabs
      if (state.exportFormat) setExportFormat(state.exportFormat);
      if (state.blockedDomains) setBlockedDomains(state.blockedDomains);
      if (state.redirectRules) setRedirectRules(state.redirectRules);
    }
  };

  const loadActiveTab = async () => {
    const savedTab = await getActiveTab();
    if (savedTab) {
      setActiveTab(savedTab);
    }
  };

  const handleStateChange = async (newState) => {
    setCurrentState(newState);
    await saveCurrentState(newState);
  };

  const handleSettingsChange = (settings) => {
    // Update individual settings
    if (settings.exportFormat !== undefined)
      setExportFormat(settings.exportFormat);
    if (settings.blockedDomains !== undefined)
      setBlockedDomains(settings.blockedDomains);
    if (settings.redirectRules !== undefined)
      setRedirectRules(settings.redirectRules);

    // Save to storage
    const updatedState = {
      ...currentState,
      ...settings,
    };
    setCurrentState(updatedState);
    saveCurrentState(updatedState);
  };

  const handleLoadProfile = (profileData) => {
    setCurrentState(profileData);
    saveCurrentState(profileData);

    // Load settings for other tabs
    if (profileData.exportFormat) setExportFormat(profileData.exportFormat);
    else setExportFormat("<url>");

    if (profileData.blockedDomains)
      setBlockedDomains(profileData.blockedDomains);
    else setBlockedDomains([]);

    if (profileData.redirectRules) setRedirectRules(profileData.redirectRules);
    else setRedirectRules([]);
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    saveActiveTab(tabName);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <img src="/icon16.png" alt="Heta" className="app-logo" />
          Heta - Tab Helper
        </h1>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "batch-url" ? "active" : ""}`}
          onClick={() => handleTabChange("batch-url")}
        >
          Batch
        </button>
        <button
          className={`tab ${activeTab === "extractor" ? "active" : ""}`}
          onClick={() => handleTabChange("extractor")}
        >
          Extractor
        </button>
        <button
          className={`tab ${activeTab === "block-site" ? "active" : ""}`}
          onClick={() => handleTabChange("block-site")}
        >
          Block Site
        </button>
        <button
          className={`tab ${activeTab === "redirect" ? "active" : ""}`}
          onClick={() => handleTabChange("redirect")}
        >
          Redirect
        </button>
        <button
          className={`tab ${activeTab === "profiles" ? "active" : ""}`}
          onClick={() => handleTabChange("profiles")}
        >
          Profiles
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "batch-url" && (
          <BatchUrl
            currentState={currentState}
            onStateChange={handleStateChange}
          />
        )}
        {activeTab === "profiles" && (
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
        {activeTab === "extractor" && (
          <Extractor
            exportFormat={exportFormat}
            onExportFormatChange={(format) =>
              handleSettingsChange({ exportFormat: format })
            }
          />
        )}
        {activeTab === "block-site" && (
          <BlockSite
            blockedDomains={blockedDomains}
            onBlockedDomainsChange={(domains) =>
              handleSettingsChange({ blockedDomains: domains })
            }
          />
        )}
        {activeTab === "redirect" && (
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
