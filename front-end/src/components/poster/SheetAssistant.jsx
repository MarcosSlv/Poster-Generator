import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MdCheck, MdContentCopy, MdDownload } from "react-icons/md";

import { assistantService } from "../../services/assistantService";
import { getRequestErrorMessage } from "../../services/requestError";
import { SHEET_LAYOUTS, rowsToTsv } from "../../services/sheetParser";
import { downloadSheet } from "../../services/sheetWriter";

import Button from "../ui/Button";
import ErrorText from "../ui/ErrorText";
import Spinner from "../ui/Spinner";

const FALLBACK_ERROR = "Não foi possível formatar a lista. Tente novamente.";
const NOT_DEPLOYED_ERROR = "O assistente ainda não existe no servidor que este site está usando.";
const COPY_FEEDBACK_MS = 2000;

const BLOCK_INFO = {
  promocional: {
    titulo: "Cartaz promocional",
    destino: "modelo padrão",
    fileName: "cartazes-promocional.xlsx",
    layout: SHEET_LAYOUTS.standard
  },
  combo: {
    titulo: "Combo 10zão",
    destino: "modelo combo",
    fileName: "cartazes-combo.xlsx",
    layout: SHEET_LAYOUTS.combo
  }
};

function SheetAssistant() {
  const [texto, setTexto] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiado, setCopiado] = useState("");
  const copyTimer = useRef(null);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const handleFormat = async (event) => {
    event.preventDefault();

    setError("");
    setResultado(null);
    setCopiado("");
    setIsLoading(true);

    try {
      const response = await assistantService.formatSheet(texto);

      if (response.status === "Success") {
        setResultado(response);
      } else {
        setError(response.message || FALLBACK_ERROR);
      }
    } catch (requestError) {
      console.error("Erro ao formatar a lista:", requestError);

      setError(requestError?.response?.status === 404
        ? NOT_DEPLOYED_ERROR
        : getRequestErrorMessage(requestError, FALLBACK_ERROR));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (tipo, conteudo) => {
    try {
      await navigator.clipboard.writeText(conteudo);

      setCopiado(tipo);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopiado(""), COPY_FEEDBACK_MS);
    } catch {
      setError("Não foi possível copiar automaticamente. Selecione o texto e copie à mão.");
    }
  };

  const blocos = resultado?.blocos ?? [];
  const avisos = resultado?.avisos ?? [];

  return (
    <div className="text-card-foreground">
      <form onSubmit={handleFormat}>
        <label htmlFor="ofertas" className="mb-2 block text-center">
          Cole a lista de ofertas, uma por linha
        </label>

        <textarea
          id="ofertas"
          rows={8}
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          placeholder={"COXINHA DA ASA AURORA PREMIUM APIMENTADA 800G R$ 13,99\nCUPIM BOVINO POR KG R$ 34,99\nPÃO DE FORMA GUARANY TRAD. 450G 2 R$ 5,00"}
          className="w-full resize-y rounded-lg border border-border bg-input px-4 py-3 font-mono text-sm text-foreground outline-none transition placeholder:text-muted-foreground hover:border-secondary focus:border-ring focus:ring-1 focus:ring-ring"
        />

        <p className="mt-2 text-center text-sm text-muted-foreground">
          O assistente identifica sozinho o que é promoção normal e o que é 10zão.
        </p>

        <ErrorText alert className="mb-2 mt-2">{error}</ErrorText>

        <div className="mt-4 flex justify-center">
          {isLoading ? (
            <Button disabled text={<Spinner label="Formatando a lista" className="mx-8" />} />
          ) : (
            <Button type="submit" text="Formatar" disabled={texto.trim() === ""} />
          )}
        </div>
      </form>

      {resultado && (
        <motion.div
          aria-live="polite"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-6 space-y-6"
        >
          {avisos.length > 0 && (
            <ul className="space-y-1 rounded-lg border border-border bg-muted p-3 text-sm text-chart-5">
              {avisos.map((aviso) => (
                <li key={aviso}>{aviso}</li>
              ))}
            </ul>
          )}

          {blocos.length === 0 && avisos.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Nenhuma oferta foi identificada no texto enviado.
            </p>
          )}

          {blocos.map(({ tipo, linhas }) => {
            const info = BLOCK_INFO[tipo];
            const conteudo = rowsToTsv(linhas, info.layout.columns);

            return (
              <section key={tipo} className="rounded-lg border border-border">
                <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
                  <div>
                    <h6 className="font-semibold">{info.titulo}</h6>
                    <p className="text-sm text-muted-foreground">
                      {linhas.length} {linhas.length === 1 ? "cartaz" : "cartazes"} · cole na linha 2 do {info.destino} ou baixe a planilha pronta
                    </p>
                    <p className="mt-1 text-sm text-chart-5">
                      Confira antes de imprimir: o assistente pode errar.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => downloadSheet(linhas, info.layout, info.fileName)}
                      aria-label={`Baixar planilha preenchida com ${linhas.length === 1 ? "o cartaz" : "os cartazes"} de ${info.titulo}`}
                      className="flex items-center rounded-lg border border-border px-3 py-1 text-sm font-semibold transition hover:bg-accent hover:text-accent-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      <MdDownload className="mr-1 text-lg" />
                      Planilha
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(tipo, conteudo)}
                      className="flex items-center rounded-lg border border-border px-3 py-1 text-sm font-semibold transition hover:bg-accent hover:text-accent-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {copiado === tipo ? (
                        <>
                          <MdCheck className="mr-1 text-lg text-chart-3" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <MdContentCopy className="mr-1 text-lg" />
                          Copiar
                        </>
                      )}
                    </button>
                  </div>
                </header>

                <div className="overflow-x-auto px-3 py-2">
                  <pre className="whitespace-pre font-mono text-xs text-muted-foreground">
                    {info.layout.columnLabels.join("\t")}
                  </pre>
                  <pre className="whitespace-pre font-mono text-xs">{conteudo}</pre>
                </div>
              </section>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

export default SheetAssistant;
