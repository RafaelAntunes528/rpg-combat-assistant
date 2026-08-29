import { useState } from "react";

interface HelpModalProps {
  onClose: () => void;
}

interface GuideStep {
  icon: string;
  title: string;
  description: string;
  details?: string[];
}

const guideSteps: GuideStep[] = [
  {
    icon: "👥",
    title: "Cria a tua Party",
    description:
      "Começa por criar a Party que vai participar no combate.",
    details: [
      "Abre Adicionar → Criar / Gerir Party.",
      "Podes criar as personagens manualmente.",
      "Também podes gerar uma Party aleatória.",
      "Escolhe o número de personagens que queres na Party."
    ]
  },

  {
    icon: "⚔️",
    title: "Adiciona inimigos",
    description:
      "Adiciona as criaturas que vão participar no encontro.",
    details: [
      "Abre Adicionar → Adicionar Inimigo.",
      "Escolhe uma criatura da Biblioteca.",
      "A criatura será adicionada ao encontro atual.",
      "Podes repetir o processo para adicionar vários inimigos."
    ]
  },

  {
    icon: "🎲",
    title: "Gera um encontro",
    description:
      "Queres começar rapidamente? Deixa a aplicação criar o encontro por ti.",
    details: [
      "Clica em Encontro.",
      "Escolhe quantas criaturas queres enfrentar.",
      "A aplicação irá selecionar criaturas aleatoriamente.",
      "O encontro fica pronto para começar o combate."
    ]
  },

  {
    icon: "📚",
    title: "Usa a Biblioteca",
    description:
      "A Biblioteca é onde podes criar e gerir as tuas criaturas.",
    details: [
      "Cria novas criaturas personalizadas.",
      "Define os seus atributos, ataques e características.",
      "As criaturas ficam guardadas no navegador.",
      "Podes utilizá-las em encontros futuros."
    ]
  },

  {
    icon: "▶️",
    title: "Começa o combate",
    description:
      "Com a Party e os inimigos preparados, está na hora de combater.",
    details: [
      "Cada inimigo terá o seu turno.",
      "Escolhe a ação que o inimigo deve realizar.",
      "A aplicação trata das jogadas de ataque e cálculo do dano.",
      "Regista manualmente o dano sofrido pelos jogadores."
    ]
  },

  {
    icon: "💾",
    title: "O teu jogo é guardado",
    description:
      "Não precisas de guardar manualmente o progresso.",
    details: [
      "A aplicação guarda automaticamente o estado atual.",
      "Podes fechar a aplicação e voltar mais tarde.",
      "O jogo atual será recuperado do navegador.",
      "As criaturas da Biblioteca também permanecem guardadas."
    ]
  },

  {
    icon: "🔄",
    title: "Novo Jogo",
    description:
      "Quando terminares, podes começar um novo encontro.",
    details: [
      "Clica em Novo Jogo para reiniciar o jogo atual.",
      "A Party e o encontro atual serão limpos.",
      "As criaturas criadas na Biblioteca NÃO são apagadas.",
      "Podes começar imediatamente um novo combate."
    ]
  },

  {
    icon: "🎉",
    title: "Estás pronto!",
    description:
      "Já sabes o essencial para utilizar o RPG Combat Manager.",
    details: [
      "Cria a tua Party.",
      "Adiciona ou gera os inimigos.",
      "Começa o combate.",
      "Diverte-te e deixa a aplicação tratar do resto!"
    ]
  }
];

function HelpModal({
  onClose
}: HelpModalProps) {

  const [currentStep, setCurrentStep] = useState(0);

  const step = guideSteps[currentStep];

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === guideSteps.length - 1;

  function nextStep() {
    if (!isLastStep) {
      setCurrentStep((current) => current + 1);
    }
  }

  function previousStep() {
    if (!isFirstStep) {
      setCurrentStep((current) => current - 1);
    }
  }

  return (
    <div className="modal-overlay">

      <div
        className="modal help-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* HEADER */}

        <div className="modal-header">

          <div>
            <h2>
              ❔ Como usar o RPG Combat Manager
            </h2>

            <p>
              Um pequeno guia para começares.
            </p>
          </div>

          <button onClick={onClose}>
            ×
          </button>

        </div>


        {/* PROGRESSO */}

        <div className="guide-progress">

          <div className="guide-progress-bar">

            <div
              className="guide-progress-fill"
              style={{
                width: `${
                  ((currentStep + 1) /
                    guideSteps.length) *
                  100
                }%`
              }}
            />

          </div>

          <span>
            {currentStep + 1} / {guideSteps.length}
          </span>

        </div>


        {/* CONTEÚDO */}

        <div className="help-content">

          <div className="guide-step">

            <div className="guide-icon">
              {step.icon}
            </div>

            <h3>
              {step.title}
            </h3>

            <p className="guide-description">
              {step.description}
            </p>

            {step.details && (
              <div className="guide-details">

                {step.details.map(
                  (detail, index) => (

                    <div
                      className="guide-detail"
                      key={index}
                    >
                      <span>
                        ✓
                      </span>

                      <p>
                        {detail}
                      </p>
                    </div>

                  )
                )}

              </div>
            )}

          </div>

        </div>


        {/* NAVEGAÇÃO */}

        <div className="modal-actions guide-actions">

          <button
            className="guide-back-button"
            onClick={previousStep}
            disabled={isFirstStep}
          >
            ← ANTERIOR
          </button>


          {isLastStep ? (

            <button
              className="add-button"
              onClick={onClose}
            >
              COMEÇAR! 🎲
            </button>

          ) : (

            <button
              className="add-button"
              onClick={nextStep}
            >
              PRÓXIMO →
            </button>

          )}

        </div>

      </div>

    </div>
  );
}

export default HelpModal;
