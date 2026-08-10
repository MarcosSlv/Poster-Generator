import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { posterService } from "../../../services/posterService";
import { getRequestErrorMessage } from "../../../services/requestError";

import { sheetReaderService } from "../../../services/sheetReader";

import Input from "../../ui/Input";
import Button from "../../ui/Button";

import HelpModal from "../../modal/HelpModal";

import { AnimatePresence, motion } from "framer-motion";
import { MdDownload } from "react-icons/md";

function ComboSheetUpload() {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [reqResponse, setReqResponse] = useState("");
  const [submitError, setSubmitError] = useState("");

  const imageComboPoster = "/assets/images/tabela-modelo-cartaz-combo.png";
  const modelComboPosterxls = "/assets/sheets/modelo-cartaz-combo.xlsx";


  const fileWatch = watch("file");
  const { dataArray, loading: dataLoading, error } = sheetReaderService.comboPoster(fileWatch);

  useEffect(() => {
    setDownloadUrl("");
    setReqResponse("");
    setSubmitError("");
  }, [fileWatch]);

  const onSubmit = async () => {
    setDownloadUrl("");
    setReqResponse("");
    setSubmitError("");
    setIsSubmiting(true);


    const formatedData = {
      sheet: dataArray,
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

  const openHelpModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="mb-2 block text-center text-card-foreground">Selecione o Arquivo</label>
        <div className="flex justify-center mb-4">
          <Input
            type="file"
            name="file"
            placeholder="Selecione o arquivo"
            accept=".xlsx, .xls"
            register={register}
            validation={{ required: 'O arquivo é obrigatório' }}
            className="w-64"
          />
        </div>
        {errors.file && <p className="text-center text-sm font-bold text-destructive">{errors.file.message}</p>}
        {error && <p className="text-center text-sm font-bold text-destructive">{error}</p>}


        {submitError && (
          <p role="alert" className="mb-2 text-center text-sm font-bold text-destructive">{submitError}</p>
        )}

        {isSubmiting ? (
          <Button type="submit" text={
            <div className="mx-8 inline-block h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" role="status">
            </div>
          } disabled={true} />
        ) : (
          <Button type="submit" text="Criar Cartaz" disabled={!!error || dataLoading || !!downloadUrl} />
        )}

        <div className="my-2 flex justify-center py-2 text-card-foreground">
          <label className="form-label-custom fs-2">
            Dúvidas quanto ao modelo da planilha? <a
              id="button-click-here"
              className="btn btn-link p-0 font-extrabold underline transition hover:cursor-pointer hover:text-secondary hover:duration-200"
              onClick={openHelpModal}
            >
              Veja aqui
            </a>
          </label>
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              key="modal"
              className="fixed inset-0 z-40 flex justify-center items-center backdrop-blur-md"
              initial={{ opacity: 0, scale: 0, y: -50, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
              animate={{ opacity: 1, scale: 1, y: 0, boxShadow: "0px 30px 60px rgba(0,0,0,1)" }}
              exit={{ opacity: 0, scale: 0, y: 50, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <HelpModal
                fileDownloadPath={modelComboPosterxls}
                imagePath={imageComboPoster}
                onClose={() => setIsModalOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
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

export default ComboSheetUpload;
