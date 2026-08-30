import React from "react";
import "../styles/Home.css";
import "../styles/NotFound.css";

const floatingIcons = ["📸", "🎵", "▶️", "💬", "✦", "❤️"];

export default function NotFound() {
  return (
    <div className="zuno-404-page">
      {/* backgrounds animados, mesma linguagem da landing — turbinados */}
      <div className="zuno-bg-glow" />
      <div className="zuno-bg-grid" />
      <div className="zuno-orb zuno-orb-1 zuno-404-orb-boost" />
      <div className="zuno-orb zuno-orb-2 zuno-404-orb-boost" />
      <div className="zuno-orb zuno-orb-3 zuno-404-orb-boost" />
      <div className="zuno-noise" />

      {/* ícones flutuando espalhados pela tela */}
      <div className="zuno-404-float-icons">
        {floatingIcons.map((icon, i) => (
          <span key={i} className={`zuno-404-icon zuno-404-icon-${i + 1}`}>
            {icon}
          </span>
        ))}
      </div>

      <div className="zuno-404-content">
        <div className="zuno-auth-eyebrow zuno-404-eyebrow">
          <span className="zuno-dot" /> Erro 404
        </div>

        <h1 className="zuno-404-number">
          <span className="zuno-404-digit zuno-404-digit-glitch">4</span>
          <span className="zuno-404-digit zuno-404-digit-zero">
            0
            <span className="zuno-404-zero-ring" />
          </span>
          <span className="zuno-404-digit zuno-404-digit-glitch zuno-404-digit-delay">4</span>
        </h1>

        <h2 className="zuno-404-title">
          Esse perfil <span className="zuno-h1-accent">não engajou.</span>
        </h2>

        <p className="zuno-404-p">
          A página que você procura saiu do ar, mudou de link ou nunca
          existiu. Mas relaxa — seu próximo pedido continua a um clique.
        </p>

        <div className="zuno-404-actions">
          <a href="/" className="zuno-btn zuno-btn-pink">Voltar pro início</a>
          <a href="/#produtos" className="zuno-btn zuno-btn-ghost">Ver catálogo</a>
        </div>

        <div className="zuno-404-code">
          <span>GET /pagina-nao-encontrada <b>→</b> 404</span>
          <span className="zuno-pulse" />
        </div>
      </div>
    </div>
  );
}