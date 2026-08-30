import React, { useState } from "react";
import "../styles/Home.css";
import "../styles/Affiliates.css";
import { BsGraphUp, BsLightning } from "react-icons/bs";
import { ImInfinite } from "react-icons/im";
import { BiCoinStack } from "react-icons/bi";

const steps = [
  { label: "Entre em contato", title: "Chama a gente no Telegram", desc: "Manda uma mensagem pro nosso canal pedindo pra participar do programa." },
  { label: "Receba seu link", title: "Ganhe seu link exclusivo", desc: "Você recebe um link único de afiliado pra divulgar onde quiser." },
  { label: "Divulgue e ganhe", title: "Ganhe por cada venda", desc: "A cada compra feita pelo seu link, você recebe sua comissão." },
];

const perks = [
  { icon: <BiCoinStack/>, value: "20%", label: "de comissão por venda" },
  { icon: <BsLightning/>, value: "24h", label: "pra receber seu link" },
  { icon: <ImInfinite/>, value: "Sem limite", label: "de indicações" },
  { icon: <BsGraphUp/>, value: "Recorrente", label: "a cada nova compra do indicado" },
];

const faq = [
  { q: "Preciso pagar algo pra ser afiliado?", a: "Não, participar do programa é 100% gratuito." },
  { q: "Como eu recebo minha comissão?", a: "O pagamento é combinado diretamente com nossa equipe pelo Telegram." },
  { q: "Tem limite de quantas pessoas posso indicar?", a: "Não! Quanto mais você divulga, mais você ganha." },
];

export default function Affiliates() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="zuno-page zuno-aff-page">
      {/* backgrounds animados */}
      <div className="zuno-bg-glow" />
      <div className="zuno-bg-grid" />
      <div className="zuno-orb zuno-orb-1" />
      <div className="zuno-orb zuno-orb-2" />
      <div className="zuno-orb zuno-orb-3" />
      <div className="zuno-noise" />

      {/* cifrões flutuando pela tela */}
      <div className="zuno-aff-float-icons">
        {["💰", "📈", "✦", "💸", "🚀", "✦"].map((icon, i) => (
          <span key={i} className={`zuno-aff-icon zuno-aff-icon-${i + 1}`}>{icon}</span>
        ))}
      </div>

      <a href="/" className="zuno-legal-back zuno-aff-back">← Voltar pra Zuuuno</a>

      {/* HERO */}
      <section className="zuno-aff-hero">
        <div className="zuno-eyebrow zuno-aff-eyebrow">
          <span className="zuno-dot" /> Programa de afiliados
        </div>

        <h1 className="zuno-aff-title">
          Indique. Venda.<br />
          <span className="zuno-h1-accent zuno-aff-commission">Ganhe 20% de comissão.</span>
        </h1>

        <p className="zuno-aff-p">
          Divulgue a Zuuuno com seu link exclusivo e ganhe uma
          comissão em cada venda realizada pelos seus indicados.
        </p>

        <button type="button" className="zuno-btn zuno-btn-pink zuno-aff-cta" onClick={() => setShowModal(true)}>
          Quero me inscrever
        </button>

        {/* número gigante de comissão, mesma linguagem da 404 */}
        <div className="zuno-aff-badge">
          <span className="zuno-aff-badge-number">20%</span>
          <span className="zuno-aff-badge-ring" />
          <span className="zuno-aff-badge-label">de comissão<br />em cada venda</span>
        </div>
      </section>

      {/* PERKS */}
      <section className="zuno-section zuno-aff-perks-section">
        <div className="zuno-aff-perks-grid">
          {perks.map((p, i) => (
            <div key={p.label} className="zuno-aff-perk-card" style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
              <span className="zuno-aff-perk-icon">{p.icon}</span>
              <span className="zuno-aff-perk-value">{p.value}</span>
              <span className="zuno-aff-perk-label">{p.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="zuno-how zuno-aff-how">
        <div className="zuno-wrap">
          <div className="zuno-section-head">
            <div>
              <h2 className="zuno-h2">Como funciona</h2>
              <p className="zuno-section-sub">Três passos pra começar a ganhar.</p>
            </div>
          </div>
          <div className="zuno-how-grid">
            <span className="zuno-how-line" />
            {steps.map((s, i) => (
              <div key={s.label} className="zuno-how-card zuno-aff-step-card">
                <span className="zuno-how-number">{String(i + 1).padStart(2, "0")}</span>
                <div className="zuno-how-label">{s.label}</div>
                <h3 className="zuno-how-title">{s.title}</h3>
                <p className="zuno-how-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ RÁPIDO */}
      <section className="zuno-section zuno-aff-faq-section">
        <div className="zuno-section-head">
          <div>
            <h2 className="zuno-h2">Perguntas rápidas</h2>
          </div>
        </div>
        <div className="zuno-aff-faq-grid">
          {faq.map((f) => (
            <div key={f.q} className="zuno-aff-faq-card">
              <b>{f.q}</b>
              <span>{f.a}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <div className="zuno-cta-banner">
        <div className="zuno-cta-inner">
          <h2>Pronto pra começar a ganhar?</h2>
          <p>Clique abaixo e garanta seu lugar no programa de afiliados.</p>
          <button type="button" className="zuno-btn zuno-btn-pink" onClick={() => setShowModal(true)}>
            Quero me inscrever
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="zuno-aff-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="zuno-aff-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="zuno-aff-modal-close" onClick={() => setShowModal(false)}>✕</button>
            <span className="zuno-aff-modal-icon">🚧</span>
            <h3>Ainda não estamos aceitando afiliados</h3>
            <p>
              Estamos no começo da Zuuuno e, por enquanto, não estamos
              abrindo o programa de afiliados. Assim que estivermos prontos
              pra pagar as comissões direitinho, avisamos por aqui!
            </p>
            <p className="zuno-aff-modal-sub">
              Fica de olho — em breve o programa abre pra todo mundo.
            </p>
            <button type="button" className="zuno-btn zuno-btn-ghost zuno-aff-modal-btn" onClick={() => setShowModal(false)}>
              Entendi, obrigado
            </button>
          </div>
        </div>
      )}
    </div>
  );
}