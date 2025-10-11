// DebugConsole.tsx
// Component per mostrar logs a la pantalla (es pot eliminar fàcilment)
import { useEffect, useState } from "react";

const MAX_LOGS = 20;

export default function DebugConsole() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const originalLog = window.console.log;
    const originalError = window.console.error;
    const originalWarn = window.console.warn;

    const pushLog = (type: string, args: unknown[]) => {
      const msg =
        `[${type}] ` +
        args
          .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
          .join(" ");
      setLogs((l) => [msg, ...l].slice(0, MAX_LOGS));
    };

    window.console.log = (...args: unknown[]) => {
      pushLog("log", args);
      originalLog.apply(window.console, args);
    };
    window.console.error = (...args: unknown[]) => {
      pushLog("error", args);
      originalError.apply(window.console, args);
    };
    window.console.warn = (...args: unknown[]) => {
      pushLog("warn", args);
      originalWarn.apply(window.console, args);
    };
    return () => {
      window.console.log = originalLog;
      window.console.error = originalError;
      window.console.warn = originalWarn;
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        maxHeight: "40vh",
        background: "rgba(0,0,0,0.8)",
        color: "#fff",
        fontSize: "12px",
        zIndex: 9999,
        overflowY: "auto",
        pointerEvents: "auto",
      }}
    >
      <div style={{ padding: "4px", borderBottom: "1px solid #444" }}>
        Debug Console (elimina DebugConsole.tsx per treure-ho)
      </div>
      <pre style={{ margin: 0, padding: "4px" }}>
        {logs.length === 0 ? (
          <div style={{ color: "#aaa" }}>No hi ha logs</div>
        ) : (
          logs.map((log, i) => <div key={i}>{log}</div>)
        )}
      </pre>
    </div>
  );
}
