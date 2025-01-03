import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
// Telemetry
import "@project-sunbird/telemetry-sdk/index.js";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { startEvent } from "./services/callTelemetryIntract";
import { initialize, end } from "./services/telementryService";

function App() {
  let ranonce = false;

  React.useEffect(() => {
    const setFp = async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      localStorage.setItem("did", visitorId);
    };

    setFp();
    const initService = () => {
      if (localStorage.getItem("fpDetails_v2") !== null) {
        let fpDetails_v2 = localStorage.getItem("fpDetails_v2");
        var did = fpDetails_v2.result;
      } else {
        var did = localStorage.getItem("did");
      }

      initialize({
        context: {
          mode: process.env.REACT_APP_MODE, // To identify preview used by the user to play/edit/preview
          authToken: "", // Auth key to make  api calls
          did: did, // Unique id to identify the device or browser
          uid: "anonymous",
          channel: process.env.REACT_APP_CHANNEL, // Unique id of the channel(Channel ID)
          env: process.env.REACT_APP_env,

          pdata: {
            // optional
            id: process.env.REACT_APP_id, // Producer ID. For ex: For sunbird it would be "portal" or "genie"
            ver: process.env.REACT_APP_ver, // Version of the App
            pid: process.env.REACT_APP_pid, // Optional. In case the component is distributed, then which instance of that component
          },
          timeDiff: 0, // Defines the time difference// Defines the object roll up data
          host: process.env.REACT_APP_host, // Defines the from which domain content should be load
          endpoint: process.env.REACT_APP_endpoint,
          apislug: process.env.REACT_APP_apislug,
        },
        config: {},
        // tslint:disable-next-line:max-line-length
        metadata: {},
      });
    };
    initService();
    if (!ranonce) {
      if (localStorage.getItem("contentSessionId") === null) {
        startEvent();
      }

      ranonce = true;
    }
  }, []);

  React.useEffect(() => {
    const cleanup = () => {
      if (localStorage.getItem("contentSessionId") === null) {
        end();
      }
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);
  const Home = React.lazy(()=> import('./components/Home'))
  const Player = React.lazy(()=> import('./components/Player'))
  const Avatar = React.lazy(()=> import('./components/Avatar'))
  const Game = React.lazy(()=> import('./components/Game'))
  const Result = React.lazy(()=> import('./components/Result'))

  function getParameter(key, location) {
    if (key) {
      const query = new URLSearchParams(location);
      return query.get(key);
    }
  }

  useEffect(() => {
    let virtualId;

    if (getParameter("virtualId", window.location.search)) {
      virtualId = getParameter("virtualId", window.location.search);
    } else {
      virtualId = localStorage.getItem("virtualId");
    }
    localStorage.setItem("virtualId", virtualId);

    const contentSessionId = getParameter(
      "contentSessionId",
      window.location.search
    );
    if (contentSessionId) {
      localStorage.setItem("contentSessionId", contentSessionId);
    }
    const token = getParameter("token", window.location.search);
    if (token) {
      localStorage.setItem("token", token);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (window.telemetry?.syncEvents) {
        // Attempt to run syncEvents
        window.telemetry.syncEvents();
      }
      const start = Date.now();
      while (Date.now() - start < 1000) {
        // Busy-wait for 100ms (not ideal, but synchronous)
      }
    };

    // Add the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);



  return (
    <div className="App">
      <HashRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="player" element={<Player />} />
          <Route path="avatar" element={<Avatar />} />
          <Route path="play" element={<Game />} />
          <Route path="result" element={<Result />} />
        </Routes>
      </Suspense>
      </HashRouter>
    </div>
  );
}

export default App;
