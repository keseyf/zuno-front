import { useEffect, useMemo, useRef, useState, type ReactNode, type CSSProperties } from "react";
import "../../styles/Home.css";
import "../../styles/aAtuh/Dashboard.css";
import { ImInstagram } from "react-icons/im";
import {
  FaTiktok,
  FaYoutube,
  FaChevronDown,
  FaCheck,
  FaWallet,
  FaHome,
  FaUser,
  FaBars,
  FaHandshake,
  FaSignOutAlt,
  FaChartLine,
  FaShoppingBag,
  FaBolt,
  FaClock,
  FaRedoAlt,
  FaSyncAlt,
  FaTimesCircle,
  FaUndoAlt,
} from "react-icons/fa";
import { BsTelegram } from "react-icons/bs";

import { getMe, logout } from "../../controllers/users.controllers";
import { createOrder, getMyOrders } from "../../controllers/orders.controllers";
import { getAllProducts } from "../../controllers/products.controllers";
import { getAllServices } from "../../controllers/services.controllers";
import ResponseCard from "../../components/ResponseCard";

/* ============ tipos — catálogo real ============
   Product agora representa a REDE (Instagram, TikTok...).
   Service representa um serviço específico dentro dessa rede,
   carregado sob demanda quando a rede é selecionada. */

interface ApiProduct {
  id: string;
  name: string; // ex: "Instagram", "TikTok"
  description: string | null;
  price: number | string;
  active: boolean;
}

interface ApiService {
  id: string;
  replacement: boolean;
  service_Id: number;
  productId: string;
  platform: string;
  serviceName: string;
  quantity: number;

  price: number | string; // requer a migration que adiciona price em Service
}



interface ServiceOption {
  id: string;
  label: string;
  price: number; // preço por 1000
  quantity: number;
}

interface NetworkOption {
  id: string; // product.id
  label: string;
  icon: ReactNode;
  placeholder: string;
  platformKey: string;
  description: string | null; // 👈 novo
}

/* ============ usuário e pedidos reais (sem OrderItems) ============ */
type ApiResponse = {
  status: string;
  data: any;
  message?: string;
};


interface UserProfile {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: string;
}

interface OrderData {
  id: string;
  serviceName: string;
  serviceDesc?: string | null;
  value: number;
  createdAt: string;
  status?: "AGUARDANDO" | "PROCESSANDO" | "CONCLUIDO" | "CANCELADO" | "REEMBOLSADO" | "REPOSTO";
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

const ORDER_STATUS_META: Record<string, { label: string; className: string; icon?: ReactNode }> = {
  AGUARDANDO: { label: "Aguardando", className: "zuno-dash-recent-status-aguardando", icon: <FaClock /> },
  PROCESSANDO: { label: "Processando", className: "zuno-dash-recent-status-processando", icon: <FaSyncAlt /> },
  CONCLUIDO: { label: "Concluído", className: "zuno-dash-recent-status-concluido", icon: <FaCheck /> },
  CANCELADO: { label: "Cancelado", className: "zuno-dash-recent-status-cancelado", icon: <FaTimesCircle /> },
  REEMBOLSADO: { label: "Reembolsado", className: "zuno-dash-recent-status-reembolsado", icon: <FaUndoAlt /> },
  REPOSTO: { label: "Reposto", className: "zuno-dash-recent-status-reposto", icon: <FaRedoAlt /> },
};

function OrderStatusBadge({ status }: { status?: string }) {
  const meta = ORDER_STATUS_META[status ?? "AGUARDANDO"] ?? ORDER_STATUS_META.AGUARDANDO;
  return (
    <span className={`zuno-dash-recent-status ${meta.className}`}>
      {meta.icon}
      {meta.label}
    </span>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Boa madrugada";
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

/* ============ mapeamento de plataforma -> ícone/label/placeholder ============ */

const PLATFORM_ICONS: Record<string, ReactNode> = {
  instagram: <ImInstagram />,
  tiktok: <FaTiktok />,
  youtube: <FaYoutube />,
  telegram: <BsTelegram />,
};

const PLATFORM_PLACEHOLDERS: Record<string, string> = {
  instagram: "https://instagram.com/seuperfil",
  tiktok: "https://tiktok.com/@seuperfil",
  youtube: "https://youtube.com/@seucanal",
  telegram: "https://t.me/seucanal",
};

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/** Detecta a plataforma a partir do nome do produto (ex: "Instagram Premium" -> "instagram") */
function detectPlatformKey(name: string): string {
  const n = (name || "").toLowerCase();
  if (n.includes("instagram")) return "instagram";
  if (n.includes("tiktok")) return "tiktok";
  if (n.includes("youtube")) return "youtube";
  if (n.includes("telegram")) return "telegram";
  return "outros";
}

/** Produtos ativos -> lista de redes sociais pro seletor */
function buildNetworksFromProducts(products: ApiProduct[]): NetworkOption[] {
  return products
    .filter((p) => p.active !== false)
    .map((p) => {
      const key = detectPlatformKey(p.name);
      return {
        id: p.id,
        label: p.name,
        icon: PLATFORM_ICONS[key] ?? <FaShoppingBag />,
        placeholder: PLATFORM_PLACEHOLDERS[key] ?? "Cole aqui o link do perfil ou publicação",
        platformKey: key,
        description: p.description ?? null, // 👈 novo
      };
    });
}

function mapApiServices(services: ApiService[]): ServiceOption[] {
  return services.map((s) => ({
    id: s.id,
    label: capitalize(s.serviceName),
    price: Number(s.price),
    replacement: s.replacement,
    quantity: s.quantity,
  }));
}

/** Soma o value dos pedidos dos últimos 7 dias, agrupado por dia — usado no gráfico */
function computeWeeklySpending(orders: OrderData[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const buckets: { label: string; value: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const label = d.toLocaleDateString("pt-BR", { weekday: "short" }).charAt(0).toUpperCase();

    const dayTotal = orders
      .filter((o) => {
        const od = new Date(o.createdAt);
        return (
          od.getFullYear() === d.getFullYear() &&
          od.getMonth() === d.getMonth() &&
          od.getDate() === d.getDate()
        );
      })
      .reduce((sum, o) => sum + Number(o.value), 0);

    buckets.push({ label, value: dayTotal });
  }

  return buckets;
}

/* ============ hooks utilitários ============ */

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

/* ============ header: menu hambúrguer flutuante ============ */

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

/* ============ selects flutuantes ============ */

function NetworkSelect({
  networks,
  value,
  onChange,
}: {
  networks: NetworkOption[];
  value: NetworkOption | null;
  onChange: (n: NetworkOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose<HTMLDivElement>(() => setOpen(false));

  return (
    <div className={`zuno-select ${open ? "zuno-select-open" : ""}`} ref={ref}>
      <button
        type="button"
        className={`zuno-select-trigger ${open ? "zuno-select-trigger-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="zuno-select-trigger-left">
          {value ? (
            <>
              <span className="zuno-select-trigger-icon">{value.icon}</span>
              {value.label}
            </>
          ) : (
            <span className="zuno-select-placeholder">Selecione a rede social</span>
          )}
        </span>
        <FaChevronDown className={`zuno-select-chevron ${open ? "zuno-select-chevron-open" : ""}`} />
      </button>

      {open && (
        <div className="zuno-floating-panel zuno-select-panel zuno-select-panel-grid" role="listbox">
          <span className="zuno-floating-arrow" />
          {networks.map((n) => (
            <button
              type="button"
              key={n.id}
              className={`zuno-select-grid-item ${value?.id === n.id ? "zuno-select-grid-item-active" : ""}`}
              onClick={() => {
                onChange(n);
                setOpen(false);
              }}
              role="option"
              aria-selected={value?.id === n.id}
            >
              <span className="zuno-select-grid-icon">{n.icon}</span>
              <span>{n.label}</span>
              {value?.id === n.id && <FaCheck className="zuno-select-grid-check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ServiceSelect({
  network,
  services,
  loading,
  value,
  onChange,
}: {
  network: NetworkOption | null;
  services: ServiceOption[];
  loading: boolean;
  value: ServiceOption | null;
  onChange: (s: ServiceOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose<HTMLDivElement>(() => setOpen(false));
  const disabled = !network || loading;

  return (
    <div className={`zuno-select ${open ? "zuno-select-open" : ""}`} ref={ref}>
      <button
        type="button"
        className={`zuno-select-trigger ${open ? "zuno-select-trigger-open" : ""} ${disabled ? "zuno-select-trigger-disabled" : ""}`}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        <span className="zuno-select-trigger-left">
          {value ? (
            value.label
          ) : (
            <span className="zuno-select-placeholder">
              {!network ? "Selecione a rede primeiro" : loading ? "Carregando serviços..." : "Selecione o serviço"}
            </span>
          )}
        </span>
        <FaChevronDown className={`zuno-select-chevron ${open ? "zuno-select-chevron-open" : ""}`} />
      </button>

      {open && network && !loading && (
        <div className="zuno-floating-panel zuno-select-panel zuno-select-panel-list" role="listbox">
          <span className="zuno-floating-arrow" />
          {services.map((s) => (
            <button
              type="button"
              key={s.id}
              className={`zuno-select-list-item ${value?.id === s.id ? "zuno-select-list-item-active" : ""}`}
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
              role="option"
              aria-selected={value?.id === s.id}
            >
              <span className="zuno-select-list-main">
                <span className="zuno-select-list-label">{s.label}</span>
                <span className="zuno-select-list-quality">
                  {s.quantity.toLocaleString("pt-BR")} un(s).
                </span>
              </span>
              <span className="zuno-select-list-price">{formatBRL(s.price)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ gráfico de gastos — dados reais dos pedidos ============ */

function SpendingChart({ days }: { days: { label: string; value: number }[] }) {
  const max = Math.max(1, ...days.map((d) => d.value));
  const total = days.reduce((a, d) => a + d.value, 0);

  return (
    <div className="zuno-dash-card zuno-dash-chart-card">
      <div className="zuno-dash-card-head">
        <div>
          <b>Gastos da semana</b>
          <span className="zuno-dash-card-sub">Total: {formatBRL(total)}</span>
        </div>
        <FaChartLine className="zuno-dash-card-head-icon" />
      </div>

      <div className="zuno-chart">
        {days.map((d, i) => (
          <div className="zuno-chart-col" key={i}>
            <span className="zuno-chart-value">{formatBRL(d.value)}</span>
            <div className="zuno-chart-track">
              <span
                className={`zuno-chart-bar ${d.value === 0 ? "zuno-chart-bar-empty" : ""}`}
                style={{
                  height: `${(d.value / max) * 100}%`,
                } as CSSProperties}
              />
            </div>
            <span className="zuno-chart-label">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ componente principal ============ */

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [networks, setNetworks] = useState<NetworkOption[]>([]);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const [network, setNetwork] = useState<NetworkOption | null>(null);
  const [service, setService] = useState<ServiceOption | null>(null);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);

  const [link, setLink] = useState("");

  const [submitOrderLoading, setSubmitOrderLoading] = useState(false);

  const orderFormRef = useRef<HTMLDivElement>(null);

  // carga inicial: usuário, pedidos, redes (produtos) + promo de Instagram
  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      setLoading(true);
      setError(null);

      const [userResult, ordersResult, productsResult] = await Promise.all([
        getMe(),
        getMyOrders(),
        getAllProducts(),
      ]);

      if (!mounted) return;

      if (userResult.status === "success") {
        setUser(userResult.data);
      } else {
        setError(userResult.message ?? "Não foi possível carregar seu perfil.");
      }

      setOrders(ordersResult.status === "success" ? ordersResult.data ?? [] : []);

      if (productsResult.status === "success") {
        const builtNetworks = buildNetworksFromProducts(productsResult.data ?? []);
        setNetworks(builtNetworks);
      } else {
        setCatalogError("Não foi possível carregar as redes sociais disponíveis no momento.");
      }

      setLoading(false);
    }

    loadAll();

    return () => {
      mounted = false;
    };
  }, []);

  // busca os serviços da rede escolhida, sob demanda
  useEffect(() => {
    let mounted = true;

    if (!network) {
      setServiceOptions([]);
      setServiceError(null);
      return;
    }

    async function loadServices() {
      setServiceLoading(true);
      setServiceError(null);

      const result = await getAllServices(network!.id);

      if (!mounted) return;

      if (result.status === "success") {
        setServiceOptions(mapApiServices(result.data ?? []));
      } else {
        setServiceOptions([]);
        setServiceError(result.message ?? "Não foi possível carregar os serviços dessa rede.");
      }

      setServiceLoading(false);
    }

    loadServices();

    return () => {
      mounted = false;
    };
  }, [network?.id]);

  const weeklySpending = useMemo(() => computeWeeklySpending(orders), [orders]);

  const totalGasto = useMemo(
    () => orders.reduce((acc, order) => acc + Number(order.value), 0),
    [orders]
  );

  const price = service ? service.price : 0;

  const handleNetworkChange = (n: NetworkOption) => {
    setNetwork(n);
    setService(null);
  };

  const canSubmit = Boolean(
    network &&
    service &&
    link.trim()
  );


  if (loading) {
    return (
      <div className="zuno-page zuno-dash-page">
        <div className="zuno-bg-glow" />
        <div className="zuno-bg-grid" />
        <div className="zuno-orb zuno-orb-1" />
        <div className="zuno-orb zuno-orb-2" />
        <div className="zuno-orb zuno-orb-3" />
        <div className="zuno-noise" />
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "var(--ink-dim)" }}>Carregando seu painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="zuno-page zuno-dash-page">
      {/* backgrounds animados */}
      <div className="zuno-bg-glow" />
      <div className="zuno-bg-grid" />
      <div className="zuno-orb zuno-orb-1" />
      <div className="zuno-orb zuno-orb-2" />
      <div className="zuno-orb zuno-orb-3" />
      <div className="zuno-noise" />

      {/* HEADER — hambúrguer + logo centralizada */}
      <header className="zuno-dash-header">
        <div className="zuno-dash-header-inner">
          <HeaderMenu />
          <a href="/" style={{ fontStyle: "italic" }} className="zuno-logo zuno-dash-header-logo">
            <span className="zuno-logo-mark"><img style={{ width: "200px", height: "60px" }} src="/logo.png" alt="" /></span>
          </a>
        </div>
      </header>

      <main className="zuno-dash-main">
        <div className="zuno-dash-topbar">
          <span className="zuno-eyebrow zuno-dash-eyebrow">
            <span className="zuno-dot" /> Painel
          </span>
        </div>

        <h1 className="zuno-dash-title">
          Seu painel, sempre no <span className="zuno-h1-accent">controle.</span>
        </h1>
        <p className="zuno-dash-subtitle">
          Acompanhe seu saldo, seus gastos e faça novos pedidos em um só lugar.
        </p>

        {error && (
          <p style={{ color: "var(--ink-mute)", fontSize: 13, marginBottom: 12 }}>{error}</p>
        )}

        {/* STATS */}
        <div className="zuno-dash-stats-grid">
          <div className="zuno-dash-stat-card zuno-dash-stat-highlight">
            <FaWallet className="zuno-dash-stat-icon" />
            <span className="zuno-dash-stat-value">{formatBRL(user?.credits ?? 0)}</span>
            <span className="zuno-dash-stat-label">Saldo atual</span>
          </div>

          <div className="zuno-dash-stat-card">
            <FaChartLine className="zuno-dash-stat-icon" />
            <span className="zuno-dash-stat-value">{formatBRL(totalGasto)}</span>
            <span className="zuno-dash-stat-label">Total gasto</span>
          </div>

          <div className="zuno-dash-stat-card">
            <FaShoppingBag className="zuno-dash-stat-icon" />
            <span className="zuno-dash-stat-value">{orders.length}</span>
            <span className="zuno-dash-stat-label">Pedidos realizados</span>
          </div>
        </div>

        {/* BOAS-VINDAS */}
        <div className="zuno-dash-welcome">
          <div className="zuno-dash-welcome-glow" />

          <div className="zuno-dash-welcome-content">
            <span className="zuno-dash-welcome-wave" role="img" aria-label="Aceno">👋</span>
            <div>
              <span className="zuno-dash-welcome-greeting">
                {getGreeting()}, {user?.name?.split(" ")[0] ?? "tudo certo"}!
              </span>
              <h2 className="zuno-dash-welcome-title">Pronto pra turbinar suas redes hoje?</h2>
              <p className="zuno-dash-welcome-sub">
                Monte um pedido novo logo abaixo ou dá uma olhada em como foram seus últimos resultados.
              </p>
            </div>
          </div>
        </div>
        {/* NOVO PEDIDO — em destaque */}
        <div
          ref={orderFormRef}
          className="zuno-dash-card zuno-dash-order-card zuno-dash-order-featured"
        >
          <span className="zuno-dash-order-badge">
            <FaBolt /> Peça em segundos
          </span>

          <div className="zuno-dash-card-head">
            <div>
              <b>Novo pedido</b>
              <span className="zuno-dash-card-sub">Escolha a rede, o serviço e finalize em segundos</span>
            </div>
          </div>

          {catalogError ? (
            <p className="zuno-dash-info-hint">{catalogError}</p>
          ) : networks.length === 0 ? (
            <p className="zuno-dash-info-hint">Nenhuma rede disponível no momento.</p>
          ) : (
            <div className="zuno-dash-form-grid">
              {/* rede social */}
              <div className="zuno-dash-field">
                <label className="zuno-dash-label">Serviço de rede social</label>
                <NetworkSelect networks={networks} value={network} onChange={handleNetworkChange} />
              </div>

              {/* serviço */}
              <div className="zuno-dash-field">
                <label className="zuno-dash-label">Serviço</label>
                <ServiceSelect
                  network={network}
                  services={serviceOptions}
                  loading={serviceLoading}
                  value={service}
                  onChange={setService}
                />
              </div>

              {/* descrição da rede — largura total */}
              {network?.description && (
                <div className="zuno-dash-network-desc zuno-dash-field-full">
                  <span className="zuno-dash-network-desc-icon">{network.icon}</span>
                  <p>{network.description}</p>
                </div>
              )}

              {/* quadro explicativo */}
              <div className="zuno-dash-info zuno-dash-field-full">
                <div className="zuno-dash-info-head">
                  <span className="zuno-dash-info-icon">💡</span>
                  <b>Antes de pedir, saiba como funciona</b>
                </div>

                {serviceError ? (
                  <p className="zuno-dash-info-hint">{serviceError}</p>
                ) : service ? (
                  <div className="zuno-dash-info-tags">
                    <span className="zuno-dash-info-tag">🔋 Quantidade: {service.quantity.toLocaleString("pt-BR")}</span>
                  </div>
                ) : (
                  <p className="zuno-dash-info-hint">
                    Escolha uma rede e um serviço acima pra ver os limites de quantidade permitidos.
                  </p>
                )}

                <ul className="zuno-dash-info-list">
                  <li>Seu perfil precisa estar público durante toda a entrega do pedido.</li>
                  <li>Confira o mínimo e o máximo de quantidade antes de confirmar o pedido.</li>
                </ul>
              </div>

              {/* link */}
              <div className="zuno-dash-field zuno-dash-field-full">
                <label className="zuno-dash-label" htmlFor="dash-link">Link do perfil ou publicação</label>
                <input
                  id="dash-link"
                  type="text"
                  className="zuno-dash-input"
                  placeholder={network ? network.placeholder : "Cole aqui o link do perfil ou publicação"}
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>

              {/* valor */}
              <div className="zuno-dash-summary zuno-dash-field-full">
                <span className="zuno-dash-summary-label">Valor total</span>
                <span className="zuno-dash-summary-value">
                  {formatBRL(price)}
                </span>
              </div>

              <button
                type="button"
                className={`zuno-btn zuno-btn-pink zuno-dash-submit zuno-dash-field-full ${canSubmit ? "zuno-dash-submit-ready" : ""} ${submitOrderLoading ? "zuno-dash-submit-processing" : ""}`}
                disabled={!canSubmit}
                onClick={async () => {
                  setSubmitOrderLoading(true)
                  const response = await createOrder({
                    productId: network?.id ?? null,
                    serviceId: service?.id ?? null,
                    url: link,
                  });
                  setResponse(response);
                  setSubmitOrderLoading(false)
                }}
              >
                {submitOrderLoading ? "Criando pedido" : "Fazer pedido"}
              </button>
            </div>
          )}
        </div>

        {/* GRÁFICO + PEDIDOS RECENTES — dados reais */}
        <div className="zuno-dash-row">
          <SpendingChart days={weeklySpending} />

          <div className="zuno-dash-card zuno-dash-recent-card">
            <div className="zuno-dash-card-head">
              <div>
                <b>Pedidos recentes</b>
                <span className="zuno-dash-card-sub">
                  {orders.length === 0 ? "Nenhum pedido ainda" : `Seus últimos ${Math.min(orders.length, 5)} pedidos`}
                </span>
              </div>
            </div>

            <div className="zuno-dash-recent-list">
              {orders.length === 0 ? (
                <p className="zuno-dash-info-hint">Você ainda não fez nenhum pedido.</p>
              ) : (
                orders.slice(0, 5).map((o) => (
                  <div className="zuno-dash-recent-item" key={o.id}>
                    <div className="zuno-dash-recent-top">
                      <span className="zuno-dash-recent-icon">
                        <FaShoppingBag />
                      </span>
                      <span className="zuno-dash-recent-name" title={o.serviceName}>
                        {o.serviceName}
                      </span>
                    </div>

                    <div className="zuno-dash-recent-mid">
                      <span className="zuno-dash-recent-value">
                        <FaWallet /> R$ {o.value}
                      </span>
                      <span className="zuno-dash-recent-sep" />
                      <OrderStatusBadge status={o.status} />
                      <span className="zuno-dash-recent-sep" />
                      <span className="zuno-dash-recent-date">{formatDate(o.createdAt)}</span>
                    </div>

                    <p className="zuno-dash-recent-desc">
                      {o.serviceDesc ? o.serviceDesc : "(sem descrição)"}
                    </p>

                    <span className="zuno-dash-recent-id">#{o.id}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
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
        <a href="/dashboard" className="zuno-bottom-nav-item zuno-bottom-nav-item-active">
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
      {
        response ? (
          <>
            <ResponseCard
              message={response.message}
              status={response.status}
            />
          </>
        ) : null
      }
    </div>
  );
}