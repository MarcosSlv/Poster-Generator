import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { posterService } from "../../../services/posterService";
import useSheetReader from "../../../hooks/useSheetReader";
import usePosterGeneration from "../../../hooks/usePosterGeneration";

import Input from "../../ui/Input";
import ErrorText from "../../ui/ErrorText";
import SwitchPosterSize from "../../ui/SwitchPosterSize";
import DownloadResult from "../DownloadResult";
import SheetHelp from "../SheetHelp";
import SubmitPosterButton from "../SubmitPosterButton";

const IMAGE_PATH = "/assets/images/tabela-modelo-cartaz-comum.png";
const MODEL_PATH = "/assets/sheets/modelo-cartaz-comum.xlsx";

function StandardSheetUpload() {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const [posterSize, setPosterSize] = useState("cartaz-grande");
  const { downloadUrl, successMessage, submitError, isSubmiting, generate, clearResult } = usePosterGeneration();

  const fileWatch = watch("file");
  const { dataArray, loading: dataLoading, error } = useSheetReader(fileWatch, "standard");

  useEffect(() => {
    clearResult();
  }, [fileWatch, posterSize, clearResult]);

  const onSubmit = () => {
    const payload = { tamanho: posterSize, sheet: dataArray };

    return generate(() => posterSize === "cartaz-grande"
      ? posterService.generateBigPoster(payload)
      : posterService.generateSmallPoster(payload));
  };

  const handleReset = () => {
    clearResult();
    reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="file" className="mb-2 block text-center text-card-foreground">Selecione o Arquivo</label>
        <div className="flex justify-center mb-4">
          <Input
            id="file"
            type="file"
            name="file"
            placeholder="Selecione o arquivo"
            accept=".xlsx, .xls"
            register={register}
            validation={{ required: 'O arquivo é obrigatório' }}
            className="w-64"
          />
        </div>
        <ErrorText>{errors.file?.message}</ErrorText>
        <ErrorText>{error}</ErrorText>

        <SwitchPosterSize handleSizeChange={setPosterSize} errors={errors} />

        <ErrorText alert className="mb-2">{submitError}</ErrorText>

        <SubmitPosterButton
          isSubmiting={isSubmiting}
          disabled={!!error || dataLoading || !!downloadUrl}
        />
      </form>

      <SheetHelp imagePath={IMAGE_PATH} fileDownloadPath={MODEL_PATH} />

      <DownloadResult downloadUrl={downloadUrl} message={successMessage} onReset={handleReset} />
    </div>
  );
}

export default StandardSheetUpload;
