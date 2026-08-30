// components/PrivateRoute.tsx
import React, { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getMe } from "../controllers/users.controllers";
import "../styles/Home.css";
import "../styles/components/PrivateRoute.css";

type Status = "loading" | "ok" | "unauthorized" | "server_error";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");

  // Só faz o fetch e atualiza o status — não mexe em "loading" sincronamente.
  // Usado dentro do useEffect (efeito só deve reagir ao resultado, não resetar estado antes).
  const runCheck = useCallback((mountedRef: { current: boolean }) => {
    getMe().then((result) => {
      if (!mountedRef.current) return;

      if (result.status === "success") {
        setStatus("ok");
        return;
      }

      // só trata como "sem sessão" quando for 401 de verdade
      if (result._unauthorized) {
        setStatus("unauthorized");
        return;
      }

      // erro 500 / falha de rede / timeout -> não desloga, mostra tela de erro
      setStatus("server_error");
    });
  }, []);

  useEffect(() => {
    const mountedRef = { current: true };
    runCheck(mountedRef);
    return () => {
      mountedRef.current = false;
    };
  }, [runCheck]);

  // Usado pelo botão "Tentar novamente" (event handler, não efeito) —
  // aqui é seguro resetar pra "loading" de forma síncrona.
  const retry = useCallback(() => {
    setStatus("loading");
    runCheck({ current: true });
  }, [runCheck]);

  if (status === "loading") {
    return (
      <div className="zuno-page zuno-auth-loading">
        <div className="zuno-bg-glow" />
        <div className="zuno-bg-grid" />
        <div className="zuno-orb zuno-orb-1" />
        <div className="zuno-orb zuno-orb-2" />
        <div className="zuno-orb zuno-orb-3" />
        <div className="zuno-noise" />

        <div className="zuno-auth-loading-content">
          <span className="zuno-auth-spinner" />
          <p>Verificando sua sessão...</p>
        </div>
      </div>
    );
  }

  if (status === "server_error") {
    return (
      <div className="zuno-page zuno-auth-loading">
        <div className="zuno-bg-glow" />
        <div className="zuno-bg-grid" />
        <div className="zuno-orb zuno-orb-1" />
        <div className="zuno-orb zuno-orb-2" />
        <div className="zuno-orb zuno-orb-3" />
        <div className="zuno-noise" />

        <div className="zuno-auth-loading-content">
          <p>Não foi possível verificar sua sessão agora.</p>
          <button
            type="button"
            className="zuno-btn zuno-btn-pink"
            onClick={retry}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}