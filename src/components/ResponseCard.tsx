import  { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";
import "../styles/components/ResponseCard.css";

interface ResponseCardProps {
  status: string;
  message: string | undefined;
  onClose?: () => void;
}

export default function ResponseCard({ status, message, onClose }: ResponseCardProps) {
  const [visible, setVisible] = useState(true);
  const isSuccess = status === "success";

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <div className={`response-card ${isSuccess ? "response-card-success" : "response-card-error"}`}>
      <span className="response-card-icon">
        {isSuccess ? <FaCheckCircle /> : <FaTimesCircle />}
      </span>
      <span className="response-card-message">{message}</span>
      <button
        type="button"
        className="response-card-close"
        onClick={handleClose}
        aria-label="Fechar"
      >
        <FaTimes />
      </button>
    </div>
  );
}