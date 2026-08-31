import React, { useEffect, useRef, useState, type ElementType, type ReactNode, type CSSProperties } from "react";
import "../styles/Home.css";
import { ImInstagram } from "react-icons/im";
import { FaTiktok, FaYoutube } from "react-icons/fa";
import { BsTelegram } from "react-icons/bs";

const categories = [
  { icon: <ImInstagram/>, title: "Instagram", desc: "Seguidores, curtidas e views", tag: "Mais popular" },
  { icon: <FaTiktok/>, title: "TikTok", desc: "Seguidores, curtidas e views", tag: "Em alta" },
  { icon: <FaYoutube/>, title: "YouTube", desc: "Inscritos, views e likes", tag: null },
  { icon: <BsTelegram/>, title: "Telegram", desc: "Inscritos para seu canal no Telegram", tag: "Novo" },
];

const products = [
  { image: "/produtos/instagram.png", name: "1000 Seguidores Instagram", price: "R$ 9.99", oldPrice: "R$ 19,90", sold: 82, badge: "Mais vendido" },
  { image: "/produtos/tiktok.png", name: "5000 Views TikTok", price: "R$ 9,90", oldPrice: null, sold: 64, badge: null },
  { image: "/produtos/youtube.png", name: "500 Inscritos YouTube", price: "R$ 29,90", oldPrice: "R$ 39,90", sold: 47, badge: "Oferta" },
  { image: "/produtos/curtidas.png", name: "1000 Curtidas Instagram", price: "R$ 7,90", oldPrice: null, sold: 91, badge: "Mais vendido" },
];

const steps = [
  { label: "Escolha", title: "Escolha a rede e o serviço", desc: "Instagram, TikTok, YouTube e mais — selecione o pacote ideal pro seu perfil." },
  { label: "Envie", title: "Cole o link do seu perfil", desc: "Sem senha, sem risco. Só o link público do post ou perfil que quer turbinar." },
  { label: "Receba", title: "Engajamento na hora", desc: "O serviço começa a cair em minutos, de forma gradual e segura." },
];

const marqueeItems = [
  "Entrega em minutos", "Suporte 24/7", "Pagamento seguro", "Sem senha, sem risco",
  "+12 mil pedidos", "Engajamento real", "Preço justo", "Comunidade 4.9★",
];

/** Hook simples de scroll-reveal via IntersectionObserver */
function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
}

interface RevealProps {
  as?: ElementType;
  variant?: "up" | "scale" | "left" | "right";
  delay?: number;
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}

function Reveal({ as: Tag = "div", variant = "up", delay = 0, className = "", children, ...rest }: RevealProps) {
  const [ref, inView] = useReveal();
  const variantClass =
    variant === "scale" ? "zuno-reveal-scale" :
    variant === "left" ? "zuno-reveal-left" :
    variant === "right" ? "zuno-reveal-right" :
    "zuno-reveal";

  return (
    <Tag
      ref={ref}
      className={`${variantClass} zuno-stagger ${inView ? "zuno-in" : ""} ${className}`}
      style={{ "--d": `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Card de produto com leve tilt 3D acompanhando o mouse */
function ProductCard({ p, delay }: { p: typeof products[number]; delay: number }) {
  const [ref, inView] = useReveal<HTMLDivElement>();
  const [tilt, setTilt] = useState<CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      transform: `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-8px) scale(1.02)`,
    });
  };

  const handleMouseLeave = () => setTilt({});

  return (
    <div
      ref={ref}
      className={`zuno-reveal zuno-stagger zuno-p-card ${inView ? "zuno-in" : ""}`}
      style={{ "--d": `${delay}ms`, ...tilt } as CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {p.badge && <span className="zuno-p-badge">{p.badge}</span>}
      <div className="zuno-p-thumb">
        <img src={p.image} alt={p.name} className="zuno-p-img" />
      </div>
      <div className="zuno-p-body">
        <h3 className="zuno-p-name">{p.name}</h3>

        <div className="zuno-p-sold">
          <div className="zuno-p-sold-bar">
            <span style={{ width: `${p.sold}%` }} />
          </div>
          <span className="zuno-p-sold-label">{p.sold}% já vendido hoje</span>
        </div>

        <div className="zuno-p-row">
          <div className="zuno-p-price-wrap">
            {p.oldPrice && <span className="zuno-p-old-price">{p.oldPrice}</span>}
            <span className="zuno-p-price">{p.price}</span>
          </div>
          <span className="zuno-p-mini-btn">Comprar</span>
        </div>
      </div>
    </div>
  );
}

export default function ZunoStore() {
  return (
    <div className="zuno-page">
      {/* animated backdrop layers */}
      <div className="zuno-bg-glow" />
      <div className="zuno-bg-grid" />
      <div className="zuno-orb zuno-orb-1" />
      <div className="zuno-orb zuno-orb-2" />
      <div className="zuno-orb zuno-orb-3" />
      <div className="zuno-noise" />

      {/* HEADER */}
      <header className="zuno-header">
        <div className="zuno-nav">
          <div className="zuno-logo">
  <span className="zuno-logo-img">
    <img src="/logo.png" alt="Zuno Store" />
  </span>
</div>
          <nav className="zuno-nav-links">
            <a href="#categorias" className="zuno-nav-link">Categorias</a>
            <a href="#produtos" className="zuno-nav-link">Produtos</a>
            <a href="#como-funciona" className="zuno-nav-link">Como funciona</a>
            <a href="https://t.me/zun0Store" className="zuno-nav-link">Suporte</a>
          </nav>
          <div className="zuno-nav-cta">
            <a href="/dashboard" className="zuno-btn zuno-btn-ghost">Entrar</a>
            <a href="#produtos" className="zuno-btn zuno-btn-pink">Ver ofertas</a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="zuno-hero">
        <div>
          <div className="zuno-eyebrow">
            <span className="zuno-dot" /> Entrega Rápida, 24h por dia!
          </div>
          <h1 className="zuno-h1">
            Seguidores, views<br /> e curtidas{" "}
            <span className="zuno-h1-accent">na hora certa.</span>
          </h1>
          <p className="zuno-hero-p">
            Turbine Instagram, TikTok, YouTube e mais. Sem senha, sem
            enrolação — seu perfil bombando em poucos minutos.
          </p>
          <div className="zuno-hero-actions">
            <a href="#produtos" className="zuno-btn zuno-btn-pink">Explorar catálogo</a>
            <a href="#como-funciona" className="zuno-btn zuno-btn-ghost">Como funciona</a>
          </div>
          <div className="zuno-hero-stats">
            <div><b className="zuno-stat-b">+12k</b><span className="zuno-stat-span">pedidos entregues</span></div>
            <div><b className="zuno-stat-b">2 min</b><span className="zuno-stat-span">tempo médio de entrega</span></div>
            <div><b className="zuno-stat-b">4.9★</b><span className="zuno-stat-span">avaliação da comunidade</span></div>
          </div>
        </div>

        <div className="zuno-redeem-card">
          <div className="zuno-redeem-top">
            <div>
              <div className="zuno-redeem-tag">Pedido em andamento</div>
              <div className="zuno-redeem-title">1000 Seguidores Instagram</div>
            </div>
            <div className="zuno-redeem-price">R$ 9,99</div>
          </div>
          <div className="zuno-redeem-code">
            <span>@seu_perfil <b>+327</b> hoje</span>
            <span className="zuno-pulse" />
          </div>
          <div className="zuno-redeem-meta">
            <span>Entrega gradual e segura</span>
            <span>Suporte 24/7</span>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="zuno-marquee-wrap">
        <div className="zuno-marquee">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i}><b>✦</b>{item}</span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section id="categorias" className="zuno-section">
        <Reveal className="zuno-section-head" as="div">
          <div>
            <h2 className="zuno-h2">Categorias</h2>
            <p className="zuno-section-sub">Escolha por onde começar.</p>
          </div>
          <a href="#" className="zuno-see-all">Ver todas →</a>
        </Reveal>
        <div className="zuno-cat-grid">
          {categories.map((c, i) => (
            <Reveal key={c.title} variant="scale" delay={i * 90} className="zuno-cat-card">
              {c.tag && <span className="zuno-cat-tag">{c.tag}</span>}
              <div className="zuno-cat-icon-wrap">
                <div className="zuno-cat-icon">{c.icon}</div>
                <span className="zuno-cat-icon-ring" />
              </div>
              <h3 className="zuno-cat-title">{c.title}</h3>
              <span className="zuno-cat-desc">{c.desc}</span>
              <span className="zuno-cat-arrow">→</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="produtos" className="zuno-section">
        <Reveal className="zuno-section-head" as="div">
          <div>
            <h2 className="zuno-h2">Mais vendidos da semana</h2>
            <p className="zuno-section-sub">O que a comunidade está comprando agora.</p>
          </div>
          <a href="#" className="zuno-see-all">Ver todos →</a>
        </Reveal>
        <div className="zuno-rail">
          {products.map((p, i) => (
            <ProductCard key={p.name} p={p} delay={i * 100} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="zuno-how">
        <div className="zuno-wrap">
          <Reveal className="zuno-section-head" as="div">
            <div>
              <h2 className="zuno-h2">Como funciona</h2>
              <p className="zuno-section-sub">Do pagamento ao código, em três passos.</p>
            </div>
          </Reveal>

          <div className="zuno-how-grid">
            <span className="zuno-how-line" />
            {steps.map((s, i) => (
              <Reveal
                key={s.label}
                variant={i === 0 ? "left" : i === 2 ? "right" : "up"}
                delay={i * 120}
                className="zuno-how-card"
              >
                <span className="zuno-how-number">{String(i + 1).padStart(2, "0")}</span>
                <div className="zuno-how-label">{s.label}</div>
                <h3 className="zuno-how-title">{s.title}</h3>
                <p className="zuno-how-desc">{s.desc}</p>
              </Reveal>
            ))}
          </div>

          {/* placeholder de vídeo explicativo */}
          <Reveal variant="scale" delay={150} className="zuno-how-video">
            <div className="zuno-how-video-frame">
              <div className="zuno-how-video-play">▶</div>
              <span className="zuno-how-video-label">Assista como funciona em 30 segundos</span>
              {/*
                Troque este bloco pelo player real quando tiver o vídeo, ex:
                <video src="/videos/como-funciona.mp4" controls className="zuno-how-video-el" />
                ou um <iframe> do YouTube/Vimeo.
              */}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA BANNER */}
      <div className="zuno-cta-banner">
        <Reveal variant="scale" className="zuno-cta-inner">
          <h2>Bora turbinar seu perfil?</h2>
          <p>Escolha o serviço, cole o link e veja o engajamento subir na hora.</p>
          <a href="/auth" className="zuno-btn zuno-btn-pink">Ver catálogo completo</a>
        </Reveal>
      </div>

      {/* FOOTER */}
      <footer id="suporte" className="zuno-footer">
        <div className="zuno-wrap">
          <div className="zuno-foot-grid">
            <div>
              <div style={{fontStyle:"italic"}} className="zuno-logo">
                <span  className="zuno-logo-mark"><img style={{width: "200px", height: "60px"}} src="/logo.png" alt=""/></span>
              </div>
              <p className="zuno-foot-brand-p">
                Seguidores, curtidas e views para todas as redes sociais,
                com entrega automática e sem enrolação.
              </p>
            </div>
            <div>
              <h4 className="zuno-foot-col-h4">Loja</h4>
              <a href="#categorias" className="zuno-foot-a">Categorias</a>
              <a href="#produtos" className="zuno-foot-a">Produtos</a>
              <a href="/afiliados" className="zuno-foot-a">Programa de afiliados</a>
            </div>
            <div>
              <h4 className="zuno-foot-col-h4">Suporte</h4>
              <a href="/central-de-ajuda" className="zuno-foot-a">Central de ajuda</a>
              <a href="/termos" className="zuno-foot-a">Política de reembolso</a>
              <a href="https://t.me/zun0Store" className="zuno-foot-a">Fale conosco</a>
            </div>
            <div>
              <h4 className="zuno-foot-col-h4">Legal</h4>
              <a href="/termos" className="zuno-foot-a">Termos de uso</a>
              <a href="/privacidade" className="zuno-foot-a">Privacidade</a>
            </div>
          </div>
          <div className="zuno-foot-bottom">
            <span>© 2026 Zuuuno Store. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}