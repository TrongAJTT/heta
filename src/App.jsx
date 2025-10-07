import { useState, useCallback, useEffect } from "react";
import BatchUrl from "./tabs/BatchUrl";
import ProfileManager from "./tabs/ProfileManager";
import Extractor from "./tabs/Extractor";
import BlockSite from "./tabs/BlockSite";
import Redirect from "./tabs/Redirect";
import Instance from "./tabs/Instance";
import AboutDialog from "./components/AboutDialog";
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
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

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
        <button
          className="about-button"
          onClick={() => setAboutDialogOpen(true)}
          title="About Heta"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
              fill="currentColor"
            />
          </svg>
        </button>
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
        {activeTab === TABS.INSTANCE && <Instance />}
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
      </div>

      <AboutDialog
        open={aboutDialogOpen}
        onClose={() => setAboutDialogOpen(false)}
      />
    </div>
  );
}

export default App;
