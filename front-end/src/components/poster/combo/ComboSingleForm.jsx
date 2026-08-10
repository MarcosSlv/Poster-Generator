import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { posterService } from "../../../services/posterService";
import { getRequestErrorMessage } from "../../../services/requestError";
import { motion, AnimatePresence } from "framer-motion";
import { MdDownload } from "react-icons/md";

import Input from "../../ui/Input";
import Button from "../../ui/Button";


function ComboSingleForm() {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [reqResponse, setReqResponse] = useState("");
  const [submitError, setSubmitError] = useState("");

  const formValues = watch();

  useEffect(() => {
    setDownloadUrl("");
    setReqResponse("");
    setSubmitError("");
  }, [formValues.produto, formValues.comboVlr, formValues.medida, formValues.comboQtd]);

  const onSubmit = async (data) => {
    setDownloadUrl("");
    setReqResponse("");
    setSubmitError("");
    setIsSubmiting(true);

    const formatedData = {
      sheet: [{
        ...data,
        comboQtd: String(data.comboQtd).padStart(2, '0'),
        comboVlr: Number(String(data.comboVlr).replace(',', '.')).toFixed(2)
      }],
    };

    try {
      const responseData = await posterService.generateComboPoster(formatedData);

      if (responseData.status === "Success") {
        setDownloadUrl(responseData.download);
        setReqResponse(responseData.message);
      } else {
        setSubmitError(responseData.message || "Erro ao criar cartaz. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao criar cartaz:", error);
      setSubmitError(getRequestErrorMessage(error));
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <div className="space-y-4 text-card-foreground">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center">
          <label htmlFor="produto" className="block mb-2 text-center">Produto</label>
          <Input
            type="text"
            name="produto"
            placeholder="Descrição do Produto"
            register={register}
            validation={{ required: 'A descrição é obrigatória' }}
            className="w-full text-center"
          />
          {errors.produto && <p className="text-center text-sm font-bold text-destructive">{errors.produto.message}</p>}
        </div>

        <div className="flex items-start mt-4">
          <div className="flex flex-col items-center w-1/2">
            <label htmlFor="comboQtd" className="block mb-1 text-center">Quantidade</label>
            <Input
              type="text"
              name="comboQtd"
              placeholder="03"
              register={register}
              validation={{
                required: 'A quantidade é obrigatória',
                pattern: {
                  value: /^\d+$/,
                  message: 'Informe apenas números'
                },
                validate: (value) => Number(value) > 0 || 'A quantidade deve ser maior que 0'
              }}
              className="w-28 text-center rounded-md p-2"
            />
            {errors.comboQtd && <p className="mt-1 text-center text-sm font-bold text-destructive">{errors.comboQtd.message}</p>}
          </div>

          <div className="flex flex-col items-center w-1/2">
            <label htmlFor="medida" className="block mb-1 text-center">Medida</label>
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

          <div className="flex flex-col items-center w-1/2">
            <label htmlFor="comboVlr" className="block mb-1 text-center">Valor</label>
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
          {submitError && (
            <p role="alert" className="mb-2 text-center text-sm font-bold text-destructive">{submitError}</p>
          )}

          {isSubmiting ? (
            <Button type="submit" text={
              <div className="mx-8 inline-block h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" role="status">
              </div>
            } disabled={true} />
          ) : (
            <Button type="submit" text="Criar Cartaz" disabled={!!downloadUrl} />
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
              <a href={downloadUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center mt-4">
                <Button text={<MdDownload className="mr-1 text-xl" />} />
              </a>
              <div className="text-center mt-4">
                <Button
                  onClick={() => {
                    setDownloadUrl("");
                    setReqResponse("");
                    setSubmitError("");
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
