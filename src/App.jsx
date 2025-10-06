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

  useEffect(() => {
    loadCurrentState();
    loadActiveTab();
  }, []);

  const loadCurrentState = async () => {
    const state = await getCurrentState();
    if (state) {
      setCurrentState(state);
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

  const handleLoadProfile = (profileData) => {
    setCurrentState(profileData);
    saveCurrentState(profileData);
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
          Batch URL
        </button>
        <button
          className={`tab ${activeTab === "profiles" ? "active" : ""}`}
          onClick={() => handleTabChange("profiles")}
        >
          Profiles
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
            currentState={currentState}
            onLoadProfile={handleLoadProfile}
          />
        )}
        {activeTab === "extractor" && <Extractor />}
        {activeTab === "block-site" && <BlockSite />}
        {activeTab === "redirect" && <Redirect />}
      </div>
    </div>
  );
}

export default App;
