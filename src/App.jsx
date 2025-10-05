import React, { useState, useEffect } from "react";
import BatchUrl from "./tabs/BatchUrl";
import ProfileManager from "./tabs/ProfileManager";
import { getCurrentState, saveCurrentState } from "./utils/storage";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("batch-url");
  const [currentState, setCurrentState] = useState({});

  useEffect(() => {
    loadCurrentState();
  }, []);

  const loadCurrentState = async () => {
    const state = await getCurrentState();
    if (state) {
      setCurrentState(state);
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

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          <img src="/icon16.svg" alt="Heta" className="app-logo" />
          Heta - Tab Helper
        </h1>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "batch-url" ? "active" : ""}`}
          onClick={() => setActiveTab("batch-url")}
        >
          Batch URL
        </button>
        <button
          className={`tab ${activeTab === "profiles" ? "active" : ""}`}
          onClick={() => setActiveTab("profiles")}
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
            currentState={currentState}
            onLoadProfile={handleLoadProfile}
          />
        )}
      </div>
    </div>
  );
}

export default App;
