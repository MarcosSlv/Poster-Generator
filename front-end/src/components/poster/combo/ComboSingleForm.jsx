import PosterPreviewContext from "../../../context/PosterPreviewContext";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { posterService } from "../../../services/posterService";
import { motion, AnimatePresence } from "framer-motion";
import { MdDownload } from "react-icons/md";

import Input from "../../ui/Input";
import Button from "../../ui/Button";


function ComboSingleForm() {
  const updatePreview = useContext(PosterPreviewContext);
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [reqResponse, setReqResponse] = useState("");

  const formValues = watch();
  const { produto, comboQtd, comboVlr, medida } = formValues;

  useEffect(() => {
    updatePreview({ produto, comboQtd, comboVlr, medida });
  }, [updatePreview, produto, comboQtd, comboVlr, medida]);

  useEffect(() => {
    setDownloadUrl("");
    setReqResponse("");
  }, [formValues.produto, formValues.comboQtd, formValues.comboVlr, formValues.medida]);

  const onSubmit = async (data) => {
    setDownloadUrl("");
    setReqResponse("");
    setIsSubmiting(true);

    const formatedData = {
      sheet: [{
        ...data,
        comboQtd: String(data.comboQtd).padStart(2, '0'),
        comboVlr: Number(data.comboVlr.replace(',', '.')).toFixed(2)
      }],
    };

    try {
      const responseData = await posterService.generateComboPoster(formatedData);

      if (responseData.status === "Success") {
        setDownloadUrl(responseData.download);
        setReqResponse(responseData.message);
      }
      if (responseData.status !== "Success") {
        setReqResponse(responseData.message || "Não foi possível gerar o cartaz. Tente novamente.");
      }
      setIsSubmiting(false);
    } catch (error) {
      console.error("Erro ao criar cartaz:", error);
      setReqResponse("Erro ao criar cartaz. Por favor, tente novamente.");
      setIsSubmiting(false);
    }
  };

  return (
    <div className="space-y-4 text-card-foreground">
      <form onSubmit={handleSubmit(onSubmit)}>
        {reqResponse && !downloadUrl && <p className="request-feedback" role="alert">{reqResponse}</p>}
        <div className="offer-field">
          <label htmlFor="produto" className="field-label">Produto</label>
          <Input
            type="text"
            name="produto"
            placeholder="Ex.: Café torrado 500 g"
            register={register}
            validation={{ required: 'A descrição é obrigatória' }}
            className="w-full text-center"
          />
          {errors.produto && <p className="text-center text-sm font-bold text-destructive">{errors.produto.message}</p>}
        </div>

        <div className="offer-fields-grid">
          <div className="offer-field">
            <label htmlFor="comboQtd" className="field-label">Quantidade</label>
            <Input
              type="text"
              name="comboQtd"
              placeholder="03"
              register={register}
              validation={{
                required: 'A quantidade é obrigatória',
                pattern: { value: /^[1-9]\d*$/, message: 'Informe uma quantidade inteira maior que 0' }
              }}
              className="w-28 text-center rounded-md p-2"
            />
            {errors.comboQtd && <p className="mt-1 text-center text-sm font-bold text-destructive">{errors.comboQtd.message}</p>}
          </div>

          <div className="offer-field">
            <label htmlFor="medida" className="field-label">Medida</label>
            <select
              id="medida"
              {...register("medida", { required: 'A medida é obrigatória' })}
              className="w-28 rounded-md border border-border bg-input p-2 text-foreground outline-none transition hover:border-secondary focus:border-ring focus:ring-1 focus:ring-ring"
            >
              <option value="UN">UN</option>
              <option value="KG">KG</option>
            </select>
            {errors.medida && <p className="mt-1 text-center text-sm text-destructive">{errors.medida.message}</p>}
          </div>

          <div className="offer-field">
            <label htmlFor="comboVlr" className="field-label">Valor</label>
            <Input
              type="text"
              name="comboVlr"
              placeholder="2,50"
              register={register}
              validation={{
                required: 'O valor é obrigatório',
                pattern: {
                  value: /^\d+([,.]\d{1,2})?$/,
                  message: 'Valor inválido. Use formato: 2,50 ou 2.50'
                }
              }}
              className="w-28 text-center rounded-md p-2"
            />
            {errors.comboVlr && <p className="text-center text-sm text-destructive">{errors.comboVlr.message}</p>}
          </div>
        </div>

        <div className="mt-6">
          {isSubmiting ? (
            <Button type="submit" text={
              <div className="mx-8 inline-block h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" role="status">
              </div>
            } disabled={true} />
          ) : (
            <Button type="submit" text="Gerar cartaz em PDF" disabled={isSubmiting || !!downloadUrl} />
          )}
        </div>
      </form>

      <AnimatePresence mode="wait">
        {downloadUrl && (
          <motion.div
            key="download-section"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div>
              <p className="mt-4 text-center text-chart-3">{reqResponse} Clique no botão abaixo para fazer o download</p>
              <a href={downloadUrl} target="_blank" rel="noreferrer" className="download-link">
                <MdDownload aria-hidden="true" /> Baixar PDF
              </a>
              <div className="text-center mt-4">
                <Button
                  onClick={() => {
                    setDownloadUrl("");
                    setReqResponse("");
                    setIsSubmiting(false);
                    reset();
                  }}
                  text="Criar outro cartaz" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ComboSingleForm;
