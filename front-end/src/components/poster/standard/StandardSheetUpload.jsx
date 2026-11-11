import PosterPreviewContext from "../../../context/PosterPreviewContext";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { posterService } from "../../../services/posterService";

import { sheetReaderService } from "../../../services/sheetReader";

import Input from "../../ui/Input";
import Button from "../../ui/Button";
import SwitchPosterSize from "../../ui/SwitchPosterSize";

import HelpModal from "../../modal/HelpModal";


import { AnimatePresence, motion } from "framer-motion";
import { MdDownload } from "react-icons/md";

function StandardSheetUpload() {
  const updatePreview = useContext(PosterPreviewContext);
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const [posterSize, setPosterSize] = useState("cartaz-grande");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [reqResponse, setReqResponse] = useState("");

  const imageDefaultPoster = "/assets/images/tabela-modelo-cartaz-comum.png";
  const modelDefaultPosterxls = "/assets/sheets/modelo-cartaz-comum.xlsx";


  const fileWatch = watch("file");
  const { dataArray, loading: dataLoading, error } = sheetReaderService.standardPoster(fileWatch);

  useEffect(() => {
    updatePreview({ ...dataArray[0], count: dataArray.length, size: posterSize });
  }, [updatePreview, dataArray, posterSize]);


  useEffect(() => {
    setDownloadUrl("");
    setReqResponse("");
  }, [fileWatch, posterSize]);

  const onSubmit = async () => {
    setDownloadUrl("");
    setReqResponse("");
    setIsSubmiting(true);


    const formatedData = {
      tamanho: posterSize,
      sheet: dataArray,
    };

    try {
      const responseData = (posterSize === "cartaz-grande")
        ? await posterService.generateBigPoster(formatedData)
        : await posterService.generateSmallPoster(formatedData);

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

  const openHelpModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {reqResponse && !downloadUrl && <p className="request-feedback" role="alert">{reqResponse}</p>}
        <label htmlFor="file" className="field-label">Selecione o arquivo</label>
        <div className="upload-zone">
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

        <SwitchPosterSize handleSizeChange={(e) => setPosterSize(e)} errors={errors} />


        {isSubmiting ? (
          <Button type="submit" text={
            <div className="mx-8 inline-block h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" role="status">
            </div>
          } disabled={true} />
        ) : (
          <Button type="submit" text="Gerar cartaz em PDF" disabled={!!error || dataLoading || isSubmiting || !!downloadUrl} />
        )}

        <p className="sheet-help">
          Precisa de ajuda com a planilha? <button type="button" onClick={openHelpModal}>Veja o modelo</button>
        </p>

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
                fileDownloadPath={modelDefaultPosterxls}
                imagePath={imageDefaultPoster}
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

export default StandardSheetUpload;
