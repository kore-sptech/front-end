import Button from "../../ui/atoms/Button";
import PageHeader from "../../ui/molecules/PageHeader";
import Panel from "../../ui/molecules/Panel";
import { cadastrarUsuario } from "../../services/autenticacao";
import { handleApiError } from "../../utils/errorHandler";
import { toast } from "sonner";
import { useState } from "react";

/**
 * Page: tela de diagnóstico do tratamento de erros da API.
 *
 * @returns {React.ReactElement}
 */
export default function TestValidationPage() {
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testValidationError = async () => {
    setLogs([]);
    addLog("Disparando POST /usuarios com dados vazios...");

    try {
      const response = await cadastrarUsuario({
        nome: "",
        email: "",
        senha: "",
      });

      addLog(`✓ Success (inesperado): ${JSON.stringify(response.data)}`);
    } catch (error) {
      addLog("✗ Erro capturado!");
      addLog(`Status: ${error.response?.status}`);
      addLog(`typeof error.response?.data: ${typeof error.response?.data}`);
      addLog(
        `error.response?.data: ${JSON.stringify(error.response?.data, null, 2)}`,
      );
      addLog(`error.response?.data?.message: "${error.response?.data?.message}"`);
      addLog("Chamando handleApiError...");
      addLog("Abra o console do navegador (F12) para ver os logs.");

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
    <main className="h-full w-full overflow-auto bg-[#000C24] p-6 text-[#DAE2FF]">
      <PageHeader
        title="Test Validation Error"
        actions={
          <>
            <Button onClick={testValidationError}>
              Testar Erro de Validação
            </Button>
            <Button variant="neutral" onClick={testToastDirectly}>
              Testar Toast Diretamente
            </Button>
          </>
        }
      />

      <Panel title="Logs" className="mt-8">
        <pre className="text-xs whitespace-pre-wrap text-gray-400">
          {logs.length === 0 ? "Nenhum log ainda..." : logs.join("\n")}
        </pre>
      </Panel>
    </main>
  );
}