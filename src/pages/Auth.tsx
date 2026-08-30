import React, { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/Home.css";
import "../styles/Auth.css";

import { createUser, loginUser, getMe } from "../controllers/users.controllers";

import ResponseCard from "../components/ResponseCard";


const marqueeItems = [
  "Entrega em minutos",
  "Suporte 24/7",
  "Pagamento seguro",
  "Sem senha, sem risco",
  "+12 mil pedidos",
  "Engajamento real",
  "Preço justo",
  "Comunidade 4.9★",
];


const perks = [
  {
    icon: "⚡",
    title: "Entrega em minutos",
    desc: "Pedido aprovado, engajamento caindo na hora."
  },
  {
    icon: "🔒",
    title: "Sem senha, sem risco",
    desc: "Só o link do seu perfil, nada além disso."
  },
  {
    icon: "💬",
    title: "Suporte 24/7",
    desc: "Time pronto pra te ajudar a qualquer hora."
  },
];


type ApiResponse = {
  status: string;
  data: any;
  message?: string;
};

export default function Auth() {
  const navigate = useNavigate();

  const [checkingSession, setCheckingSession] = useState(true);

  const [mode, setMode] = useState<"login" | "register">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Se já tiver sessão válida, manda direto pro dashboard
  useEffect(() => {
    let mounted = true;

    getMe().then((result) => {
      if (!mounted) return;

      if (result.status === "success") {
        navigate("/dashboard", { replace: true });
        return;
      }

      setCheckingSession(false);
    });

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setResponse(null);

    try {

      if (mode === "register") {

        const result = await createUser({
          name,
          email,
          password,
          confirmPassword
        });

        console.log("Resposta do cadastro:", result);

        if (result.status === "success") {
          // Cadastro deu certo -> loga automaticamente
          const loginResult = await loginUser({ email, password });

          console.log("Resposta do login automático:", loginResult);

          if (loginResult.status === "success") {
            navigate("/dashboard");
            return;
          }

          // Cadastrou mas o login automático falhou por algum motivo
          setResponse({
            status: "error",
            data: null,
            message: "Conta criada! Faça login para continuar."
          });
          setMode("login");
        } else {
          setResponse(result);
        }
      }


      if (mode === "login") {

        const result = await loginUser({ email, password });

        console.log("Resposta do login:", result);

        if (result.status === "success") {
          navigate("/dashboard");
          return;
        }

        setResponse(result);

      }

    } catch (error) {

      console.error("Erro na autenticação:", error);

      setResponse({
        status: "error",
        data: null,
        message: "Ocorreu um erro inesperado."
      });

    } finally {

      setLoading(false);

    }

  };


  const changeMode = (newMode: "login" | "register") => {

    setMode(newMode);

    setResponse(null);

  };


  // Enquanto verifica se já existe sessão válida, mostra o loading roxo
  if (checkingSession) {
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


  return (

    <div className="zuno-auth-page">

      {/* backgrounds animados, mesma linguagem da landing */}

      <div className="zuno-bg-glow" />

      <div className="zuno-bg-grid" />

      <div className="zuno-orb zuno-orb-1" />

      <div className="zuno-orb zuno-orb-2" />

      <div className="zuno-orb zuno-orb-3" />

      <div className="zuno-noise" />


      <div className="zuno-auth-shell">


        {/* ===== LADO ESQUERDO: vitrine / storytelling ===== */}

        <div className="zuno-auth-showcase">

          <div className="zuno-auth-logo zuno-auth-logo-showcase">
  <span className="zuno-logo-img">
    <img src="/logo.png" alt="Zuno Store" />
  </span>
</div>


          <div className="zuno-auth-eyebrow">

            <span className="zuno-dot" />

            Entrega automática, 24h por dia

          </div>


          <h1 className="zuno-auth-hero-title">

            Seu perfil,

            <br />

            <span className="zuno-h1-accent">

              bombando de verdade.

            </span>

          </h1>


          <p className="zuno-auth-hero-p">

            Seguidores, views e curtidas pra Instagram, TikTok, YouTube e
            Telegram — tudo em minutos, sem enrolação.

          </p>


          <div className="zuno-auth-perks">

            {perks.map((p) => (

              <div
                key={p.title}
                className="zuno-auth-perk"
              >

                <span className="zuno-auth-perk-icon">

                  {p.icon}

                </span>


                <div>

                  <b>{p.title}</b>

                  <span>{p.desc}</span>

                </div>

              </div>

            ))}

          </div>


          {/* mini card */}

          <div className="zuno-redeem-card zuno-auth-mini-card">

            <div className="zuno-redeem-top">

              <div>

                <div className="zuno-redeem-tag">

                  Pedido em andamento

                </div>


                <div className="zuno-redeem-title">

                  1000 Seguidores Instagram

                </div>

              </div>


              <div className="zuno-redeem-price">

                R$ 14,90

              </div>

            </div>


            <div className="zuno-redeem-code">

              <span>

                @seu_perfil <b>+327</b> hoje

              </span>


              <span className="zuno-pulse" />

            </div>

          </div>

        </div>


        {/* ===== MARQUEE ===== */}

        <div className="zuno-auth-marquee-wrap">

          <div className="zuno-auth-marquee">

            {[...marqueeItems, ...marqueeItems].map((item, i) => (

              <span key={i}>

                <b>✦</b>

                {item}

              </span>

            ))}

          </div>

        </div>


        {/* ===== LADO DIREITO: AUTH ===== */}

        <div className="zuno-auth-card-wrap">

          <div className="zuno-auth-card">


            {/* Logo mobile */}

            <div className="zuno-auth-logo zuno-auth-logo-mobile">

              <span className="zuno-logo-mark">

                <img
                  style={{
                    width: "200px",
                    height: "60px"
                  }}
                  src="/logo.png"
                  alt="Zuno"
                />

              </span>

            </div>


            {/* Switch */}

            <div className="zuno-auth-switch">


              <button
                type="button"
                className={`zuno-auth-tab ${mode === "login"
                    ? "zuno-auth-tab-active"
                    : ""
                  }`}
                onClick={() => changeMode("login")}
              >

                Entrar

              </button>


              <button
                type="button"
                className={`zuno-auth-tab ${mode === "register"
                    ? "zuno-auth-tab-active"
                    : ""
                  }`}
                onClick={() => changeMode("register")}
              >

                Criar conta

              </button>


              <span
                className={`zuno-auth-tab-indicator ${mode === "register"
                    ? "zuno-auth-tab-indicator-right"
                    : ""
                  }`}
              />

            </div>


            {/* Head */}

            <div className="zuno-auth-head">

              <h2 className="zuno-auth-title">

                {mode === "login"
                  ? "Bem-vindo de volta"
                  : "Crie sua conta"
                }

              </h2>


              <p className="zuno-auth-sub">

                {mode === "login"
                  ? "Entre pra acompanhar seus pedidos e turbinar seu perfil."
                  : "Leva menos de um minuto pra começar a bombar."
                }

              </p>

            </div>


            {/* ===== FORM ===== */}

            <form
              className="zuno-auth-form"
              onSubmit={handleSubmit}
              key={mode}
            >


              {/* Nome */}

              {mode === "register" && (

                <div className="zuno-field">

                  <label htmlFor="name">

                    Nome

                  </label>


                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    autoComplete="name"
                    required
                  />

                </div>

              )}


              {/* Email */}

              <div className="zuno-field">

                <label htmlFor="email">

                  E-mail

                </label>


                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="voce@email.com"
                  autoComplete="email"
                  required
                />

              </div>


              {/* Senha */}

              <div className="zuno-field">

                <label htmlFor="password">

                  Senha

                </label>


                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  required
                />

              </div>


              {/* Confirmar senha */}

              {mode === "register" && (

                <div className="zuno-field">

                  <label htmlFor="confirm">

                    Confirmar senha

                  </label>


                  <input
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    id="confirm"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                  />

                </div>

              )}

              {/* BOTÃO */}

              <button
                type="submit"
                className="zuno-btn zuno-btn-pink zuno-auth-submit"
                disabled={loading}
              >

                {loading
                  ? "Aguarde..."
                  : mode === "login"
                    ? "Entrar"
                    : "Criar conta"
                }

              </button>


            </form>


            {/* Footer */}

            <p className="zuno-auth-footnote">

              {mode === "login" ? (

                <>

                  Ainda não tem conta?{" "}


                  <button
                    type="button"
                    className="zuno-auth-linklike"
                    onClick={() => changeMode("register")}
                  >

                    Criar conta

                  </button>

                </>

              ) : (

                <>

                  Já tem conta?{" "}


                  <button
                    type="button"
                    className="zuno-auth-linklike"
                    onClick={() => changeMode("login")}
                  >

                    Entrar

                  </button>

                </>

              )}

            </p>


          </div>

        </div>


      </div>


      {/* RESPONSE CARD */}

      {response ? (

        <ResponseCard
          status={response.status}
          message={response.message}
        />

      ) : null}


    </div>

  );

}