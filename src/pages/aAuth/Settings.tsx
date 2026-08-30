import React, { useEffect, useRef, useState } from "react";
import "../../styles/Home.css";
import "../../styles/aAtuh/Dashboard.css";
import "../../styles/aAtuh/Settings.css";
import {
  FaBell,
  FaLock,
  FaSlidersH,
  FaExclamationTriangle,
  FaWallet,
  FaHome,
  FaUser,
  FaBars,
  FaCog,
  FaHandshake,
  FaSignOutAlt,
} from "react-icons/fa";

/** Fecha o painel quando o clique acontece fora do elemento referenciado */
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

/* ============ header: menu hambúrguer (mesmo do dashboard) ============ */

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
          <a href="/configuracoes" className="zuno-dash-menu-item">
            <FaCog /> Configurações
          </a>
          <a href="/afiliados" className="zuno-dash-menu-item">
            <FaHandshake /> Virar afiliado
          </a>
          <div className="zuno-dash-menu-divider" />
          <button
            type="button"
            className="zuno-dash-menu-item zuno-dash-menu-item-danger"
            onClick={() => {
              // lógica de logout entra aqui
            }}
          >
            <FaSignOutAlt /> Sair da conta
          </button>
        </div>
      )}
    </div>
  );
}

/* ============ toggle switch reutilizável ============ */

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`zuno-toggle ${checked ? "zuno-toggle-on" : ""}`}
      onClick={onChange}
    >
      <span className="zuno-toggle-knob" />
    </button>
  );
}

/* ============ linha de configuração ============ */

function SettingRow({
  label,
  desc,
  children,
}: {
  label: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="zuno-settings-row">
      <div className="zuno-settings-row-text">
        <b>{label}</b>
        <span>{desc}</span>
      </div>
      {children}
    </div>
  );
}

/* ============ componente principal ============ */

export default function Settings() {
  const [notifyEmailOrder, setNotifyEmailOrder] = useState(true);
  const [notifyTelegram, setNotifyTelegram] = useState(true);
  const [notifyPromo, setNotifyPromo] = useState(false);
  const [quickBuy, setQuickBuy] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const canSavePassword =
    currentPassword.length > 0 && newPassword.length >= 6 && newPassword === confirmPassword;

  return (
    <div className="zuno-page zuno-settings-page">
      {/* backgrounds animados */}
      <div className="zuno-bg-glow" />
      <div className="zuno-bg-grid" />
      <div className="zuno-orb zuno-orb-1" />
      <div className="zuno-orb zuno-orb-2" />
      <div className="zuno-orb zuno-orb-3" />
      <div className="zuno-noise" />

      {/* HEADER — hambúrguer + logo centralizada, igual ao dashboard */}
      <header className="zuno-dash-header">
        <div className="zuno-dash-header-inner">
          <HeaderMenu />
          <a href="/" style={{ fontStyle: "italic" }} className="zuno-logo zuno-dash-header-logo">
            <span className="zuno-logo-mark"><img style={{width: "200px", height: "60px"}} src="/logo.png" alt=""/></span>
          </a>
        </div>
      </header>

      <main className="zuno-settings-main">
        <span className="zuno-eyebrow zuno-settings-eyebrow">
          <span className="zuno-dot" /> Configurações
        </span>

        <h1 className="zuno-settings-title">
          Ajuste a Zuno Store <span className="zuno-h1-accent">do seu jeito.</span>
        </h1>
        <p className="zuno-settings-subtitle">
          Só o essencial — sem burocracia, sem dado sensível pra gerenciar.
        </p>

        {/* NOTIFICAÇÕES */}
        <section className="zuno-settings-card">
          <div className="zuno-settings-card-head">
            <span className="zuno-settings-card-icon"><FaBell /></span>
            <div>
              <b>Notificações</b>
              <span>Como você quer ser avisado sobre seus pedidos</span>
            </div>
          </div>

          <SettingRow label="E-mail quando um pedido concluir" desc="Receba um aviso assim que a entrega for finalizada.">
            <Toggle checked={notifyEmailOrder} onChange={() => setNotifyEmailOrder((v) => !v)} />
          </SettingRow>
          <SettingRow label="Atualizações pelo Telegram" desc="Avisos rápidos direto no nosso canal de suporte.">
            <Toggle checked={notifyTelegram} onChange={() => setNotifyTelegram((v) => !v)} />
          </SettingRow>
          <SettingRow label="Promoções e novidades" desc="E-mails ocasionais sobre ofertas e lançamentos.">
            <Toggle checked={notifyPromo} onChange={() => setNotifyPromo((v) => !v)} />
          </SettingRow>
        </section>

        {/* PREFERÊNCIAS */}
        <section className="zuno-settings-card">
          <div className="zuno-settings-card-head">
            <span className="zuno-settings-card-icon"><FaSlidersH /></span>
            <div>
              <b>Preferências</b>
              <span>Pequenos ajustes na hora de usar a loja</span>
            </div>
          </div>

          <SettingRow label="Compra rápida" desc="Pula a tela de confirmação e finaliza o pedido com um clique.">
            <Toggle checked={quickBuy} onChange={() => setQuickBuy((v) => !v)} />
          </SettingRow>
        </section>

        {/* SEGURANÇA */}
        <section className="zuno-settings-card">
          <div className="zuno-settings-card-head">
            <span className="zuno-settings-card-icon"><FaLock /></span>
            <div>
              <b>Segurança</b>
              <span>Troque sua senha sempre que quiser</span>
            </div>
          </div>

          <div className="zuno-settings-field">
            <label className="zuno-dash-label" htmlFor="current-pass">Senha atual</label>
            <input
              id="current-pass"
              type="password"
              className="zuno-dash-input"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="zuno-settings-field">
            <label className="zuno-dash-label" htmlFor="new-pass">Nova senha</label>
            <input
              id="new-pass"
              type="password"
              className="zuno-dash-input"
              placeholder="Mínimo 6 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="zuno-settings-field">
            <label className="zuno-dash-label" htmlFor="confirm-pass">Confirmar nova senha</label>
            <input
              id="confirm-pass"
              type="password"
              className="zuno-dash-input"
              placeholder="Repita a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="button" className="zuno-btn zuno-btn-pink zuno-settings-save" disabled={!canSavePassword}>
            Salvar nova senha
          </button>
        </section>

        {/* ZONA DE RISCO */}
        <section className="zuno-settings-card zuno-settings-danger">
          <div className="zuno-settings-card-head">
            <span className="zuno-settings-card-icon zuno-settings-danger-icon"><FaExclamationTriangle /></span>
            <div>
              <b>Zona de risco</b>
              <span>Essa ação não pode ser desfeita</span>
            </div>
          </div>

          <SettingRow label="Excluir minha conta" desc="Remove seu acesso e seu histórico permanentemente.">
            <button type="button" className="zuno-settings-danger-btn" onClick={() => setShowDeleteModal(true)}>
              Excluir conta
            </button>
          </SettingRow>
        </section>
      </main>

      {/* MODAL DE CONFIRMAÇÃO */}
      {showDeleteModal && (
        <div className="zuno-settings-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="zuno-settings-modal" onClick={(e) => e.stopPropagation()}>
            <span className="zuno-settings-modal-icon"><FaExclamationTriangle /></span>
            <h3>Tem certeza?</h3>
            <p>
              Essa ação vai excluir sua conta e todo o seu histórico
              permanentemente. Não é possível desfazer depois.
            </p>
            <div className="zuno-settings-modal-actions">
              <button type="button" className="zuno-btn zuno-btn-ghost" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button type="button" className="zuno-settings-danger-btn zuno-settings-danger-btn-solid">
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BARRA INFERIOR */}
      <nav className="zuno-bottom-nav">
        <a href="/recarga" className="zuno-bottom-nav-item">
          <span className="zuno-bottom-nav-icon-wrap">
            <FaWallet />
            <span className="zuno-bottom-nav-dot" />
          </span>
          Recarga
        </a>
        <a href="/" className="zuno-bottom-nav-item">
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
    </div>
  );
}