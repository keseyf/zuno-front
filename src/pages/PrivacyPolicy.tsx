import "../styles/Home.css";
import "../styles/PrivacyPolicy.css";

export default function PrivacyPolicy() {
  return (
    <div className="zuno-legal-page">
      <div className="zuno-bg-glow zuno-legal-bg-glow" />
      <div className="zuno-bg-grid" />

      <div className="zuno-legal-wrap">
        <a href="/" className="zuno-legal-back">← Voltar pra Zuuuno Store</a>

        <header className="zuno-legal-head">
          <div className="zuno-legal-logo">
            <span>Zuuuno Store</span>
          </div>
          <h1 className="zuno-legal-title">Política de Privacidade</h1>
          <p className="zuno-legal-updated">Última atualização: agosto de 2026</p>
        </header>

        {/* aviso em destaque com os pontos mais importantes */}
        <div className="zuno-legal-highlight">
          <h2>Resumo rápido</h2>
          <ul>
            <li>
              <b>Nunca vendemos</b> seus dados pessoais para terceiros, sob
              nenhuma circunstância.
            </li>
            <li>
              Seus dados são usados <b>exclusivamente</b> para viabilizar seu
              acesso à plataforma e a execução dos pedidos que você realiza.
            </li>
            <li>
              Também usamos dados de forma agregada e anônima para{" "}
              <b>estudos internos</b>, como entender quais produtos e
              serviços faz sentido oferecer.
            </li>
          </ul>
        </div>

        <section className="zuno-legal-section">
          <h2>1. Quem somos</h2>
          <p>
            Esta Política de Privacidade explica como a Zuuuno Store coleta,
            usa, armazena e protege as informações dos usuários que acessam
            e utilizam nossa plataforma.
          </p>
        </section>

        <section className="zuno-legal-section">
          <h2>2. Quais dados coletamos</h2>
          <p>Podemos coletar as seguintes informações:</p>
          <ul className="zuno-legal-list">
            <li>Nome e endereço de e-mail, fornecidos no cadastro.</li>
            <li>Dados de pedidos, como serviços contratados, valores e datas.</li>
            <li>
              Links ou nomes de usuário de redes sociais informados para a
              execução dos serviços contratados.
            </li>
            <li>
              Informações técnicas básicas, como endereço IP, tipo de
              navegador e dados de navegação na plataforma.
            </li>
            <li>Comunicações realizadas com nosso suporte.</li>
          </ul>
        </section>

        <section className="zuno-legal-section">
          <h2>3. Como usamos seus dados</h2>
          <p>Utilizamos os dados coletados exclusivamente para:</p>
          <ul className="zuno-legal-list">
            <li>Viabilizar seu acesso e uso da plataforma, incluindo login e histórico de pedidos.</li>
            <li>Processar pagamentos e executar os serviços contratados.</li>
            <li>Prestar suporte e responder dúvidas ou solicitações.</li>
            <li>
              Realizar estudos internos e análises agregadas, como entender
              quais categorias e produtos fazem mais sentido oferecer na
              plataforma.
            </li>
            <li>Cumprir obrigações legais, quando aplicável.</li>
          </ul>
          <p>
            Não utilizamos seus dados para nenhuma finalidade além das
            listadas acima.
          </p>
        </section>

        <section className="zuno-legal-section">
          <h2>4. Compartilhamento de dados</h2>
          <p>
            <b>Não vendemos, alugamos ou comercializamos</b> seus dados
            pessoais com terceiros em nenhuma hipótese.
          </p>
          <p>
            Podemos compartilhar informações estritamente necessárias com:
          </p>
          <ul className="zuno-legal-list">
            <li>
              Provedores e instituições parceiras responsáveis pela
              execução técnica dos serviços contratados (conforme descrito
              em nossos Termos de Uso).
            </li>
            <li>Processadores de pagamento, para viabilizar transações.</li>
            <li>
              Autoridades competentes, caso exigido por lei ou ordem
              judicial.
            </li>
          </ul>
        </section>

        <section className="zuno-legal-section">
          <h2>5. Armazenamento e segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais razoáveis para
            proteger seus dados contra acesso não autorizado, perda,
            alteração ou divulgação indevida. Apesar disso, nenhum sistema é
            completamente livre de riscos, e trabalhamos continuamente para
            manter a segurança da plataforma.
          </p>
          <p>
            Seus dados são armazenados pelo tempo necessário para cumprir as
            finalidades descritas nesta política, ou conforme exigido por
            obrigações legais.
          </p>
        </section>

        <section className="zuno-legal-section">
          <h2>6. Cookies</h2>
          <p>
            Utilizamos cookies e tecnologias semelhantes para melhorar sua
            experiência de navegação, manter sua sessão ativa e entender
            como a plataforma é utilizada. Você pode gerenciar o uso de
            cookies diretamente nas configurações do seu navegador.
          </p>
        </section>

        <section className="zuno-legal-section">
          <h2>7. Seus direitos</h2>
          <p>Você pode, a qualquer momento, solicitar:</p>
          <ul className="zuno-legal-list">
            <li>Confirmação de quais dados seus armazenamos.</li>
            <li>Correção de dados incompletos ou desatualizados.</li>
            <li>Exclusão dos seus dados, ressalvadas obrigações legais de retenção.</li>
            <li>Informações sobre com quem seus dados foram compartilhados.</li>
          </ul>
          <p>
            Para exercer qualquer um desses direitos, entre em contato
            através dos nossos canais de suporte.
          </p>
        </section>

        <section className="zuno-legal-section">
          <h2>8. Menores de idade</h2>
          <p>
            A Zuuuno Store não se destina a menores de 18 anos. Não coletamos
            intencionalmente dados de menores de idade sem o consentimento
            de um responsável legal.
          </p>
        </section>

        <section className="zuno-legal-section">
          <h2>9. Alterações nesta política</h2>
          <p>
            Esta Política de Privacidade pode ser atualizada periodicamente.
            Alterações relevantes serão comunicadas através da própria
            plataforma. Recomendamos revisar esta página com frequência.
          </p>
        </section>

        <section className="zuno-legal-section">
          <h2>10. Contato</h2>
          <p>
            Dúvidas sobre esta Política de Privacidade podem ser enviadas
            para o nosso suporte através dos canais disponíveis na
            plataforma.
          </p>
        </section>

        <footer className="zuno-legal-footer">
          <span>© 2026 Zuuuno Store. Todos os direitos reservados.</span>
          <a href="/termos">Termos de Uso</a>
        </footer>
      </div>
    </div>
  );
}