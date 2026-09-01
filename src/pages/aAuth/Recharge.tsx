import { useEffect, useRef, useState } from "react";
import "../../styles/Home.css";
import "../../styles/aAtuh/Dashboard.css";
import "../../styles/aAtuh/Recharge.css";
import {
  FaBars,
  FaHandshake,
  FaSignOutAlt,
  FaHome,
  FaUser,
  FaWallet,
  FaQrcode,
  FaCopy,
  FaCheckCircle,
  FaTimesCircle,
  FaBolt,
} from "react-icons/fa";

import { getMe, logout } from "../../controllers/users.controllers";
import {
  createRecharge,
  getRechargeStatus,
  cancelRecharge,
  type RechargeData,
} from "../../controllers/recharge.controller";
import ResponseCard from "../../components/ResponseCard";

const MIN_AMOUNT = 8;
const QUICK_AMOUNTS = [8, 15, 30, 50, 100];
const POLL_INTERVAL_MS = 3000;

type ApiResponse = { status: string; data: any; message?: string };

interface UserProfile {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: string;
}

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* ============ hook + menu hambúrguer — mesmo padrão do Dashboard ============ */

function useOutsideClose<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);
  return ref;
}

function HeaderMenu() {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose<HTMLDivElement>(() => setOpen(false));

  return (
    <div className="zuno-dash-menu" ref={ref}>
      <button
        type="button"
        className={`zuno-dash-menu-btn ${open ? "zuno-dash-menu-btn-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir menu"
        aria-expanded={open}
      >
        <FaBars />
      </button>

      {open && (
        <div className="zuno-floating-panel zuno-dash-menu-panel">
          <span className="zuno-floating-arrow zuno-floating-arrow-left" />
          {/* <a href="/configuracoes" className="zuno-dash-menu-item">
            <FaCog /> Configurações
          </a> */}
          <a href="/afiliados" className="zuno-dash-menu-item">
            <FaHandshake /> Virar afiliado
          </a>
          <div className="zuno-dash-menu-divider" />
          <button
            type="button"
            className="zuno-dash-menu-item zuno-dash-menu-item-danger"
            onClick={() => {
              logout();
              window.location.href = "/auth";
            }}
          >
            <FaSignOutAlt /> Sair da conta
          </button>
        </div>
      )}
    </div>
  );
}

/* ============ página ============ */

export default function Recharge() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  const [amountInput, setAmountInput] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const [recharge, setRecharge] = useState<RechargeData | null>(null);
  const [copied, setCopied] = useState(false);

  // ============ autenticação — sem token não entra, igual ao dashboard ============
  useEffect(() => {
    let mounted = true;

    (async () => {
      const result = await getMe();
      if (!mounted) return;

      if (result.status === "success") {
        setUser(result.data);
        setCheckingAuth(false);
      } else {
        window.location.href = "/auth";
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ============ polling a cada 3s enquanto a recarga estiver aguardando pagamento ============
  useEffect(() => {
    if (!recharge || recharge.status !== "AGUARDANDO") return;

    const interval = setInterval(async () => {
      const result = await getRechargeStatus(recharge.id);
      if (result.status === "success" && result.data) {
        setRecharge((prev: any) => (prev ? { ...prev, status: result.data.status } : prev));
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [recharge?.id, recharge?.status]);

  const amountNumber = Number(amountInput.replace(",", "."));
  const amountValid = Number.isFinite(amountNumber) && amountNumber >= MIN_AMOUNT;

  const handleQuickAmount = (v: number) => {
    setAmountInput(String(v));
    setFormError(null);
  };

  const handleSubmit = async () => {
    if (!amountValid) {
      setFormError(`O valor mínimo pra recarga é ${formatBRL(MIN_AMOUNT)}.`);
      return;
    }

    setFormError(null);
    setCreating(true);
    const result = await createRecharge(amountNumber);
    setCreating(false);

    if (result.status === "success" && result.data) {
      setRecharge(result.data);
    } else {
      setResponse(result);
    }
  };

  const handleCopy = async () => {
    if (!recharge?.qrCode) return;
    try {
      await navigator.clipboard.writeText(recharge.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setResponse({
        status: "error",
        data: null,
        message: "Não foi possível copiar o código. Selecione e copie manualmente.",
      });
    }
  };

  const handleReset = async () => {
    if (recharge && recharge.status === "AGUARDANDO") {
      await cancelRecharge(recharge.id);
    }
    setRecharge(null);
    setAmountInput("");
    setCopied(false);
  };

  if (checkingAuth) {
    return (
      <div className="zuno-page zuno-dash-page">
        <div className="zuno-bg-glow" />
        <div className="zuno-bg-grid" />
        <div className="zuno-orb zuno-orb-1" />
        <div className="zuno-orb zuno-orb-2" />
        <div className="zuno-orb zuno-orb-3" />
        <div className="zuno-noise" />
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "var(--ink-dim)" }}>Verificando sua sessão...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="zuno-page zuno-dash-page">
      {/* backgrounds animados — mesmos do Home/Dashboard */}
      <div className="zuno-bg-glow" />
      <div className="zuno-bg-grid" />
      <div className="zuno-orb zuno-orb-1" />
      <div className="zuno-orb zuno-orb-2" />
      <div className="zuno-orb zuno-orb-3" />
      <div className="zuno-noise" />

      {/* HEADER */}
      <header className="zuno-dash-header">
        <div className="zuno-dash-header-inner">
          <HeaderMenu />
          <a href="/" style={{ fontStyle: "italic" }} className="zuno-logo zuno-dash-header-logo">
            <span className="zuno-logo-mark">
              <img style={{ width: "200px", height: "60px" }} src="/logo.png" alt="" />
            </span>
          </a>
        </div>
      </header>

      <main className="zuno-dash-main">
        <div className="zuno-dash-topbar">
          <span className="zuno-eyebrow zuno-dash-eyebrow">
            <span className="zuno-dot" /> Recarga
          </span>
        </div>

        <h1 className="zuno-dash-title">
          Adicione <span className="zuno-h1-accent">créditos</span> à sua conta.
        </h1>
        <p className="zuno-dash-subtitle">
          Pague com Pix e use o saldo pra fazer pedidos na hora. Saldo atual: <b>{formatBRL(user?.credits ?? 0)}</b>
        </p>

        <div className="zuno-dash-card zuno-dash-order-card zuno-dash-order-featured">
          <span className="zuno-dash-order-badge">
            <FaBolt /> Aprovação automática
          </span>

          <div className="zuno-dash-card-head">
            <div>
              <b>{recharge ? "Pagamento via Pix" : "Nova recarga"}</b>
              <span className="zuno-dash-card-sub">
                {recharge
                  ? "Escaneie o QR code ou copie a chave abaixo"
                  : "Escolha ou digite o valor que quer adicionar"}
              </span>
            </div>
          </div>

          {/* ============ FORMULÁRIO ============ */}
          {!recharge && (
            <div className="zuno-dash-form-grid">
              <div className="zuno-dash-field zuno-dash-field-full">
                <label className="zuno-dash-label" htmlFor="rec-amount">
                  Valor da recarga
                </label>
                <input
                  id="rec-amount"
                  type="text"
                  inputMode="decimal"
                  className="zuno-dash-input"
                  placeholder={`Mínimo ${formatBRL(MIN_AMOUNT)}`}
                  value={amountInput}
                  onChange={(e) => {
                    setAmountInput(e.target.value);
                    setFormError(null);
                  }}
                />

                <div className="zuno-rec-chips">
                  {QUICK_AMOUNTS.map((v) => (
                    <button
                      type="button"
                      key={v}
                      className={`zuno-rec-chip ${amountNumber === v ? "zuno-rec-chip-active" : ""}`}
                      onClick={() => handleQuickAmount(v)}
                    >
                      {formatBRL(v)}
                    </button>
                  ))}
                </div>

                <p className={`zuno-rec-hint ${formError ? "zuno-rec-hint-error" : ""}`}>
                  {formError ?? `Valor mínimo: ${formatBRL(MIN_AMOUNT)}`}
                </p>
              </div>

              <div className="zuno-dash-info zuno-dash-field-full">
                <div className="zuno-dash-info-head">
                  <span className="zuno-dash-info-icon">💡</span>
                  <b>Como funciona a recarga</b>
                </div>
                <ul className="zuno-dash-info-list">
                  <li>Você paga com Pix e o crédito cai na sua conta assim que o pagamento é aprovado.</li>
                  <li>A aprovação costuma ser automática — geralmente em segundos.</li>
                  <li>O QR code fica disponível por tempo limitado; se expirar, é só gerar um novo.</li>
                  <li>Cada real pago vira 1 crédito na sua conta, pra usar em qualquer pedido.</li>
                </ul>
              </div>

              <button
                type="button"
                className={`zuno-btn zuno-btn-pink zuno-dash-submit zuno-dash-field-full ${
                  amountValid ? "zuno-dash-submit-ready" : ""
                } ${creating ? "zuno-dash-submit-processing" : ""}`}
                disabled={!amountValid || creating}
                onClick={handleSubmit}
              >
                {creating ? "Gerando Pix" : "Gerar Pix"}
              </button>
            </div>
          )}

          {/* ============ AGUARDANDO PAGAMENTO ============ */}
          {recharge && recharge.status === "AGUARDANDO" && (
            <div className="zuno-rec-qr-wrap">
              <span className="zuno-rec-amount-display">{formatBRL(Number(recharge.amount))}</span>

              <div className="zuno-rec-qr-frame">
                {recharge.qrCodeBase64 ? (
                  <img src={`data:image/png;base64,${recharge.qrCodeBase64}`} alt="QR Code Pix" />
                ) : (
                  <FaQrcode size={64} color="#111" />
                )}
              </div>

              <span className="zuno-rec-status">
                <span className="zuno-rec-status-dot" /> Aguardando pagamento
              </span>

              {recharge.qrCode && (
                <div className="zuno-rec-copy-field">
                  <code>{recharge.qrCode}</code>
                  <button
                    type="button"
                    className={`zuno-rec-copy-btn ${copied ? "zuno-rec-copy-btn-done" : ""}`}
                    onClick={handleCopy}
                  >
                    <FaCopy /> {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              )}

              <p className="zuno-dash-info-hint" style={{ marginBottom: 0 }}>
                Assim que o pagamento for confirmado, seus créditos são atualizados
                automaticamente — não precisa recarregar a página.
              </p>

              <button type="button" className="zuno-btn zuno-btn-ghost" onClick={handleReset}>
                Cancelar e gerar outro Pix
              </button>
            </div>
          )}

          {/* ============ APROVADO ============ */}
          {recharge && recharge.status === "APROVADO" && (
            <div className="zuno-rec-result">
              <FaCheckCircle className="zuno-rec-result-icon zuno-rec-result-icon-success" />
              <h3 className="zuno-dash-welcome-title" style={{ marginBottom: 0 }}>
                Recarga aprovada!
              </h3>
              <p className="zuno-dash-info-hint" style={{ marginBottom: 0 }}>
                {formatBRL(Number(recharge.amount))} já foram adicionados à sua conta.
              </p>
              <a href="/dashboard" className="zuno-btn zuno-btn-pink">
                Ir para o painel
              </a>
            </div>
          )}

          {/* ============ RECUSADO / CANCELADO ============ */}
          {recharge && (recharge.status === "RECUSADO" || recharge.status === "CANCELADO") && (
            <div className="zuno-rec-result">
              <FaTimesCircle className="zuno-rec-result-icon zuno-rec-result-icon-error" />
              <h3 className="zuno-dash-welcome-title" style={{ marginBottom: 0 }}>
                {recharge.status === "RECUSADO" ? "Pagamento recusado" : "Pix cancelado"}
              </h3>
              <p className="zuno-dash-info-hint" style={{ marginBottom: 0 }}>
                Não rolou dessa vez. Você pode tentar novamente quando quiser.
              </p>
              <button type="button" className="zuno-btn zuno-btn-pink" onClick={handleReset}>
                Tentar novamente
              </button>
            </div>
          )}
        </div>

        <p className="zuno-rec-terms">
          Dúvidas sobre como a recarga funciona? Consulte nossos{" "}
          <a href="/termos">Termos de uso</a>.
        </p>
      </main>

      {/* BARRA INFERIOR — mesma do Dashboard, com Recarga ativa */}
      <nav className="zuno-bottom-nav">
        <a href="/recarga" className="zuno-bottom-nav-item zuno-bottom-nav-item-active">
          <span className="zuno-bottom-nav-icon-wrap">
            <FaWallet />
          </span>
          Recarga
        </a>
        <a href="/dashboard" className="zuno-bottom-nav-item">
          <span className="zuno-bottom-nav-icon-wrap">
            <FaHome />
          </span>
          Início
        </a>
        <a href="/perfil" className="zuno-bottom-nav-item">
          <span className="zuno-bottom-nav-icon-wrap">
            <FaUser />
          </span>
          Perfil
        </a>
      </nav>

      {response && <ResponseCard message={response.message ?? ""} status={response.status} />}
    </div>
  );
}