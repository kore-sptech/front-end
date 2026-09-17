import { useState } from "react";
import { api } from "../utils/api";
import { handleApiError } from "../utils/errorHandler";
import { toast } from "sonner";

export default function TestValidationPage() {
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testValidationError = async () => {
    setLogs([]);
    addLog("Disparando POST /usuarios com dados vazios...");

    try {
      const response = await api.post("/usuarios", {
        nome: "",
        email: "",
        senha: "",
      });
      addLog("✓ Success (inesperado): " + JSON.stringify(response.data));
    } catch (error) {
      addLog("✗ Erro capturado!");
      addLog(`Status: ${error.response?.status}`);
      addLog(`typeof error.response?.data: ${typeof error.response?.data}`);
      addLog(
        `error.response?.data: ${JSON.stringify(error.response?.data, null, 2)}`
      );
      addLog(`error.response?.data?.message: "${error.response?.data?.message}"`);

      // Chama handleApiError (que deve exibir toast)
      addLog("Chamando handleApiError...");
      addLog("⚠️ ABRA O CONSOLE DO NAVEGADOR (F12) PARA VER OS LOGS 🔍");
      const extractedMessage = handleApiError(error, "Fallback padrão");
      addLog(`Mensagem extraída: "${extractedMessage}"`);
      addLog("✓ handleApiError executado. O toast deve ter aparecido!");
    }
  };

  const testToastDirectly = () => {
    addLog("Testando toast.error diretamente...");
    toast.error("Teste direto do toast.error - você está vendo isso?");
    addLog("✓ toast.error chamado. O toast apareceu?");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Validation Error</h1>

      <div className="flex gap-4 mb-4">
        <button
          onClick={testValidationError}
          className="btn btn-primary"
        >
          Testar Erro de Validação
        </button>

        <button
          onClick={testToastDirectly}
          className="btn btn-secondary"
        >
          Testar Toast Diretamente
        </button>
      </div>

      <div className="bg-base-200 p-4 rounded-lg">
        <h2 className="font-bold mb-2">Logs:</h2>
        <pre className="text-xs whitespace-pre-wrap">
          {logs.length === 0 ? "Nenhum log ainda..." : logs.join("\n")}
        </pre>
      </div>
    </div>
  );
}
