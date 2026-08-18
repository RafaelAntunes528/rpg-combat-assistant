import type { Creature } from "../types";

interface Props {
  creature: Creature;
  onClose: () => void;
  onContinue: () => void;
}

export default function MoveModal({
  creature,
  onClose,
  onContinue
}: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal move-modal">
        <div className="move-icon">🏃</div>

        <h2>{creature.displayName} moveu</h2>

        <div className="movement-value">
          {creature.mov}
        </div>

        <div className="movement-label">
          espaços de movimento disponíveis
        </div>

        <div className="movement-info">
          Tu decides no teu mapa para onde
          a criatura se move.
        </div>

        <button
          className="close-button"
          onClick={() => {
            onClose();
            onContinue();
          }}
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
}
