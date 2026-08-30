import React, { useEffect, useRef, useState } from "react";
import "../../styles/Home.css";
import "../../styles/aAtuh/Dashboard.css";
import "../../styles/aAtuh/Profile.css";
import {
  FaWallet,
  FaHome,
  FaUser,
  FaBars,
  FaCog,
  FaHandshake,
  FaSignOutAlt,
  FaShoppingBag,
} from "react-icons/fa";

import { getMe, logout } from "../../controllers/users.controllers";
import { getMyOrders } from "../../controllers/orders.controllers";

/* ============ tipos — batendo com o model Order real ============ */

interface UserProfile {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: string;
}

interface Order {
  id: string;
  product: string;
  quantity: number;
  url: string;
  value: number;
  createdAt: string;
}

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  } catch {
    return iso;
  }
};

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

function HeaderMenu({ onLogout }: { onLogout: () => void }) {
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
            onClick={onLogout}
          >
            <FaSignOutAlt /> Sair da conta
          </button>
        </div>
      )}
    </div>
  );
}

/* ============ componente principal ============ */

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setLoading(true);
      setError(null);

      const [userResult, ordersResult] = await Promise.all([
        getMe(),
        getMyOrders(),
      ]);

      if (!mounted) return;

      if (userResult.status === "success") {
        setUser(userResult.data);
      } else {
        setError(userResult.message ?? "Não foi possível carregar seu perfil.");
      }

      // pedidos vazios não é erro — é só um usuário sem histórico ainda
      setOrders(ordersResult.status === "success" ? ordersResult.data ?? [] : []);

      setLoading(false);
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/auth";
  };

  if (loading) {
    return (
      <div className="zuno-page zuno-profile-page">
        <div className="zuno-bg-glow" />
        <div className="zuno-bg-grid" />
        <div className="zuno-orb zuno-orb-1" />
        <div className="zuno-orb zuno-orb-2" />
        <div className="zuno-orb zuno-orb-3" />
        <div className="zuno-noise" />
        <div className="zuno-profile-main">
          <p style={{ color: "var(--ink-dim)", textAlign: "center", marginTop: 60 }}>
            Carregando seu perfil...
          </p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="zuno-page zuno-profile-page">
        <div className="zuno-bg-glow" />
        <div className="zuno-bg-grid" />
        <div className="zuno-orb zuno-orb-1" />
        <div className="zuno-orb zuno-orb-2" />
        <div className="zuno-orb zuno-orb-3" />
        <div className="zuno-noise" />
        <div className="zuno-profile-main">
          <p style={{ color: "var(--ink-dim)", textAlign: "center", marginTop: 60 }}>
            {error ?? "Não foi possível carregar seu perfil."}
          </p>
        </div>
      </div>
    );
  }

  const initial = user.email.charAt(0).toUpperCase();

  return (
    <div className="zuno-page zuno-profile-page">
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
          <HeaderMenu onLogout={handleLogout} />
          <a href="/" style={{ fontStyle: "italic" }} className="zuno-logo zuno-dash-header-logo">
            <span className="zuno-logo-mark"><img style={{width: "200px", height: "60px"}} src="/logo.png" alt=""/></span>
          </a>
        </div>
      </header>

      <main className="zuno-profile-main">
        <span className="zuno-eyebrow zuno-profile-eyebrow">
          <span className="zuno-dot" /> Perfil
        </span>

        <h1 className="zuno-profile-title">
          Sua conta, <span className="zuno-h1-accent">seu jeito.</span>
        </h1>
        <p className="zuno-profile-subtitle">
          Seus créditos e seu histórico, tudo em um só lugar.
        </p>

        {/* HERO — avatar, email e créditos */}
        <div className="zuno-profile-hero">
          <div className="zuno-profile-avatar">{initial}</div>
          <span className="zuno-profile-email">{user.name || user.email}</span>

          <div className="zuno-profile-credits">
            <span className="zuno-profile-credits-scan" />
            <span className="zuno-profile-credits-label">Créditos disponíveis</span>
            <span className="zuno-profile-credits-value">{formatBRL(user.credits ?? 0)}</span>
            <a href="/recarga" className="zuno-btn zuno-btn-pink zuno-profile-credits-btn">
              Recarregar
            </a>
          </div>
        </div>

        {/* PEDIDOS — direto dos campos do Order, sem OrderItems */}
        <div className="zuno-profile-list">
          {orders.length === 0 ? (
            <p style={{ color: "var(--ink-mute)", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
              Você ainda não fez nenhum pedido.
            </p>
          ) : (
            orders.map((order, i) => (
              <div
                className="zuno-profile-item"
                style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
                key={order.id}
              >
                <span className="zuno-profile-item-icon">
                  <FaShoppingBag />
                </span>
                <div className="zuno-profile-item-info">
                  <b>{order.quantity} · {order.product}</b>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <span className="zuno-profile-item-value">{formatBRL(order.value)}</span>
              </div>
            ))
          )}
        </div>

        {/* SAIR — sem vermelho, mantendo a estética */}
        <button type="button" className="zuno-btn zuno-btn-ghost zuno-profile-logout" onClick={handleLogout}>
          <FaSignOutAlt /> Sair da conta
        </button>
      </main>

      {/* BARRA INFERIOR */}
      <nav className="zuno-bottom-nav">
        <a href="/recarga" className="zuno-bottom-nav-item">
          <span className="zuno-bottom-nav-icon-wrap">
            <FaWallet />
            <span className="zuno-bottom-nav-dot" />
          </span>
          Recarga
        </a>
        <a href="/dashboard" className="zuno-bottom-nav-item">
          <span className="zuno-bottom-nav-icon-wrap">
            <FaHome />
          </span>
          Início
        </a>
        <a href="/perfil" className="zuno-bottom-nav-item zuno-bottom-nav-item-active">
          <span className="zuno-bottom-nav-icon-wrap">
            <FaUser />
          </span>
          Perfil
        </a>
      </nav>
    </div>
  );
}