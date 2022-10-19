import { experimental_use as use, Suspense, useState } from "react";
import "./App.css";

const fetchTabsIds = fetch("/tabsIds.json").then((response) => response.json());

function Tabs({ onSelect }) {
  const tabsIds = use(fetchTabsIds);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      {tabsIds.map((tabId) => (
        <button
          type="button"
          style={{ minWidth: "250px", border: "1px solid grey" }}
          key={tabId}
          onClick={() => onSelect(tabId)}
        >
          {tabId}
        </button>
      ))}
    </div>
  );
}

const cachedDetailsFetches = {};

const fetchTabsDetails = (id) => {
  if (!(id in cachedDetailsFetches)) {
    cachedDetailsFetches[id] = fetch(`/tabsDetails${id}.json`).then(
      (response) => response.json()
    );
  }

  return cachedDetailsFetches[id];
};

function TabsDetails({ activeTab }) {
  const tabsDetails = use(fetchTabsDetails(activeTab));

  return (
    <div
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        textAlign: "center",
        padding: "16px",
        border: "1px solid gray",
        borderRadius: "8px",
        marginTop: "16px",
      }}
    >
      {tabsDetails.message}
    </div>
  );
}

function useTabs(intiialState) {
  const [activeTab, setActiveTab] = useState(intiialState);

  const selectActiveTab = (tabId) => {
    setActiveTab(tabId);
  };

  return { activeTab, selectActiveTab };
}

function App() {
  const { activeTab, selectActiveTab } = useTabs(1);

  return (
    <div className="App">
      <Suspense>
        <Tabs onSelect={selectActiveTab} />
        <TabsDetails activeTab={activeTab} />
      </Suspense>
    </div>
  );
}

export default App;
