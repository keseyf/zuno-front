import "../styles/Home.css";
import "../styles/Termsofuse.css";

export default function TermsOfUse() {
  return (
    <div className="zuno-legal-page">
      {/* background sutil, sem os orbs pesados da landing */}
      <div className="zuno-bg-glow zuno-legal-bg-glow" />
      <div className="zuno-bg-grid" />

      <div className="zuno-legal-wrap">
        <a href="/" className="zuno-legal-back">← Voltar pra Zuuuno Store</a>

        <header className="zuno-legal-head">
          <div className="zuno-legal-logo">
            <span className="zuno-logo-mark">Z</span>
            <span>Zuuuno Store</span>
          </div>
          <h1 className="zuno-legal-title">Termos de Uso</h1>
          <p className="zuno-legal-updated">Última atualização: agosto de 2026</p>
        </header>

        {/* aviso em destaque com os 3 pontos importantes */}
        <div className="zuno-legal-highlight">
          <h2>Antes de continuar, leia com atenção</h2>
          <ul>
            <li>
              <b>Reembolsos:</b> valores depositados na plataforma <b>não são
              devolvidos</b> após a confirmação do pagamento, seja qual for o
              motivo.
            </li>
            <li>
              <b>Prestação do serviço:</b> os serviços de engajamento
              (seguidores, curtidas, views etc.) são <b>fornecidos por
              instituições e plataformas parceiras terceiras</b>, e não
              diretamente pela Zuuuno Store.
            </li>
            <li>
              <b>Prazo de entrega:</b> após a confirmação do pedido, o início
              da entrega pode levar <b>até 24 horas</b>, dependendo da
              disponibilidade do provedor do serviço.
            </li>
          </ul>
        </div>

        <section className="zuno-legal-section">
          <h2>1. Aceitação dos termos</h2>
          <p>
            Ao acessar ou usar a Zuuuno Store, você concorda com estes Termos
            de Uso. Caso não concorde com qualquer parte destes termos, não
            utilize a plataforma.
          </p>
        </section>

        <section className="zuno-legal-section">
          <h2>2. Natureza dos serviços</h2>
          <p>
            A Zuuuno Store atua como intermediária na contratação de serviços
            de engajamento para redes sociais (seguidores, curtidas, views,
            inscritos e afins). A execução técnica desses serviços é
            realizada por instituições e provedores terceiros, parceiros da
            plataforma, e não pela Zuuuno Store diretamente.
          </p>
          <p>
            A Zuuuno Store não se responsabiliza por instabilidades,
            alterações de algoritmo das redes sociais ou políticas internas
            das plataformas (Instagram, TikTok, YouTube, Telegram, entre
            outras) que possam impactar o resultado do serviço contratado.
          </p>
        </section>

        <section className="zuno-legal-section">
          <h2>3. Prazos de entrega</h2>
          <p>
            Após a confirmação do pagamento, os pedidos entram em fila de
            processamento junto ao provedor responsável. Embora a maioria
            dos pedidos comece a ser entregue em poucos minutos, o início da
            entrega pode levar <b>até 24 horas</b> em casos de alta demanda,
            manutenção ou instabilidade do serviço contratado.
          </p>
          <p>
            Atrasos dentro desse prazo não são considerados falha no
            serviço e não geram direito a reembolso.
          </p>
        </section>

        <section className="zuno-legal-section">
          <h2>4. Pagamentos e reembolsos</h2>
          <p>
            Todos os pagamentos realizados na Zuuuno Store são processados de
            forma automática e vinculados imediatamente ao pedido
            correspondente.
          </p>
          <p>
            <b>Valores depositados ou pagos na plataforma não são
            reembolsáveis</b>, independentemente do motivo, incluindo
            desistência, arrependimento, insatisfação com o resultado do
            serviço ou eventual atraso dentro do prazo descrito na seção 3.
          </p>
          <p>
            Em caso de erro comprovado de sistema que impeça totalmente a
            entrega do serviço contratado, a Zuuuno Store poderá, a seu
            critério, oferecer o reenvio do pedido ou crédito para uso
            futuro na plataforma.
          </p>
        </section>

        <section className="zuno-legal-section">
          <h2>5. Responsabilidades do usuário</h2>
          <p>
            É de responsabilidade do usuário fornecer informações corretas
            no momento da compra (link do perfil, usuário, URL da
            publicação, entre outros). Pedidos entregues incorretamente por
            erro de preenchimento do usuário não são passíveis de
            reembolso.
          </p>
          <p>
            O usuário também é responsável por manter seu perfil público
            durante o período de entrega, quando aplicável, já que perfis
            privados podem impedir a execução do serviço.
          </p>
        </section>

        <section className="zuno-legal-section">
          <h2>6. Uso da plataforma</h2>
          <p>
            É proibido utilizar a Zuuuno Store para fins ilícitos, fraudes,
            ou qualquer atividade que viole os termos de uso das redes
            sociais atendidas pelos serviços oferecidos.
          </p>
        </section>

        <section className="zuno-legal-section">
          <h2>7. Alterações nestes termos</h2>
          <p>
            A Zuuuno Store pode atualizar estes Termos de Uso a qualquer
            momento. Alterações relevantes serão comunicadas através da
            própria plataforma. O uso continuado após uma atualização
            representa aceitação dos novos termos.
          </p>
        </section>

        <section className="zuno-legal-section">
          <h2>8. Contato</h2>
          <p>
            Dúvidas sobre estes Termos de Uso podem ser enviadas para o
            nosso suporte através dos canais disponíveis na plataforma.
          </p>
        </section>

        <footer className="zuno-legal-footer">
          <span>© 2026 Zuuuno Store. Todos os direitos reservados.</span>
          <a href="/privacidade">Política de Privacidade</a>
        </footer>
      </div>
    </div>
  );
}