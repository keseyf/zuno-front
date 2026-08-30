import React, { useState, useMemo } from "react";
import "../styles/Home.css";
import "../styles/HelpCenter.css";

interface FaqItem {
  question: string;
  answer: React.ReactNode;
  category: string;
}

const categories = [
  { id: "todos", label: "Todos" },
  { id: "pedidos", label: "Pedidos e entrega" },
  { id: "pagamento", label: "Pagamento e reembolso" },
  { id: "suporte", label: "Suporte" },
  { id: "afiliados", label: "Afiliados" },
];

const TELEGRAM_LINK = "https://t.me/zuunostore";

const faqs: FaqItem[] = [
  {
    category: "pedidos",
    question: "A entrega é automática?",
    answer: (
      <>
        Não. A entrega dos serviços é feita <b>manualmente</b> pela nossa
        equipe junto aos provedores parceiros. Assim que o pagamento é
        confirmado, seu pedido entra na fila de processamento.
      </>
    ),
  },
  {
    category: "pedidos",
    question: "Quanto tempo demora pra minha entrega começar?",
    answer: (
      <>
        O prazo pode variar, mas leva em geral <b>até 24 horas</b> para o
        início da entrega após a confirmação do pagamento. Em muitos casos é
        bem mais rápido, mas esse é o prazo que garantimos.
      </>
    ),
  },
  {
    category: "pedidos",
    question: "Comprei e nada aconteceu ainda, é normal?",
    answer: (
      <>
        Sim, principalmente se ainda não completou 24 horas desde a compra.
        Como a entrega é manual, alguns pedidos entram em fila conforme a
        demanda. Se passar desse prazo, chama a gente no Telegram que a
        gente verifica pra você.
      </>
    ),
  },
  {
    category: "pedidos",
    question: "Preciso deixar meu perfil público?",
    answer: (
      <>
        Sim. Perfis privados podem impedir que o serviço seja entregue
        corretamente. Deixe seu perfil público até a entrega ser concluída.
      </>
    ),
  },
  {
    category: "pagamento",
    question: "Posso pedir reembolso depois de pagar?",
    answer: (
      <>
        Não. Valores depositados ou pagos na plataforma{" "}
        <b>não são reembolsáveis</b> após a confirmação do pagamento,
        independente do motivo. Por isso, revise bem seu pedido antes de
        confirmar a compra.
      </>
    ),
  },
  {
    category: "pagamento",
    question: "Quais formas de pagamento vocês aceitam?",
    answer: <>Trabalhamos com Pix, cartão e saldo na plataforma.</>,
  },
  {
    category: "pagamento",
    question: "Quem executa os serviços que eu compro?",
    answer: (
      <>
        Os serviços de engajamento são fornecidos por{" "}
        <b>instituições e plataformas parceiras terceiras</b>, e não
        diretamente pela Zuno Store. Atuamos como intermediários entre você
        e esses provedores.
      </>
    ),
  },
  {
    category: "suporte",
    question: "Como falo com o suporte?",
    answer: (
      <>
        Todo o nosso suporte é feito através do{" "}
        <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer">
          nosso canal no Telegram
        </a>
        . É lá que você tira dúvidas, resolve problemas com pedidos e fala
        com a equipe.
      </>
    ),
  },
  {
    category: "suporte",
    question: "O suporte funciona todos os dias?",
    answer: <>Sim, nosso suporte no Telegram está disponível 24 horas por dia, todos os dias da semana.</>,
  },
  {
    category: "afiliados",
    question: "Como eu me torno um afiliado?",
    answer: (
      <>
        É simples: basta chamar a gente no{" "}
        <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer">
          Telegram
        </a>{" "}
        e pedir pra entrar no programa de afiliados. Nossa equipe explica
        tudo por lá.
      </>
    ),
  },
  {
    category: "afiliados",
    question: "Preciso pagar algo pra ser afiliado?",
    answer: <>Não, participar do programa de afiliados é gratuito.</>,
  },
];

export default function HelpCenter() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("todos");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      const matchesCategory = activeCategory === "todos" || f.category === activeCategory;
      const matchesQuery =
        query.trim() === "" ||
        f.question.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <div className="zuno-help-page">
      <div className="zuno-bg-glow zuno-help-bg-glow" />
      <div className="zuno-bg-grid" />

      <div className="zuno-help-wrap">
        <a href="/" className="zuno-legal-back">← Voltar pra Zuno Store</a>

        <header className="zuno-help-head">
          <div className="zuno-auth-eyebrow">
            <span className="zuno-dot" /> Central de ajuda
          </div>
          <h1 className="zuno-help-title">
            Como podemos <span className="zuno-h1-accent">te ajudar?</span>
          </h1>
          <p className="zuno-help-sub">
            Reunimos as dúvidas mais comuns sobre pedidos, pagamentos e
            suporte. Não achou o que precisava? Chama a gente no Telegram.
          </p>

          <div className="zuno-help-search">
            <span className="zuno-help-search-icon">⌕</span>
            <input
              type="text"
              placeholder="Buscar por uma dúvida..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </header>

        {/* filtros de categoria */}
        <div className="zuno-help-categories">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`zuno-help-cat-btn ${activeCategory === c.id ? "zuno-help-cat-btn-active" : ""}`}
              onClick={() => setActiveCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <div className="zuno-help-faq-list">
          {filtered.length === 0 && (
            <p className="zuno-help-empty">
              Nenhuma pergunta encontrada. Tenta buscar com outras palavras.
            </p>
          )}

          {filtered.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.question}
                className={`zuno-help-faq-item ${isOpen ? "zuno-help-faq-item-open" : ""}`}
              >
                <button
                  type="button"
                  className="zuno-help-faq-question"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span>{item.question}</span>
                  <span className="zuno-help-faq-icon">+</span>
                </button>
                <div className="zuno-help-faq-answer">
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA final pro Telegram */}
        <div className="zuno-help-cta">
          <div className="zuno-help-cta-text">
            <h2>Ainda com dúvidas?</h2>
            <p>Fala com a gente direto no Telegram — resposta rápida, todo dia.</p>
          </div>
          <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer" className="zuno-btn zuno-btn-pink">
            Falar no Telegram
          </a>
        </div>
      </div>
    </div>
  );
}