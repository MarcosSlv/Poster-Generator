import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { posterService } from "../../../services/posterService";
import usePosterGeneration from "../../../hooks/usePosterGeneration";

import Input from "../../ui/Input";
import ErrorText from "../../ui/ErrorText";
import SwitchPosterSize from "../../ui/SwitchPosterSize";
import DownloadResult from "../DownloadResult";
import SubmitPosterButton from "../SubmitPosterButton";

function StandardSingleForm() {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const [posterSize, setPosterSize] = useState("cartaz-grande");
  const { downloadUrl, successMessage, submitError, isSubmiting, generate, clearResult } = usePosterGeneration();

  const formValues = watch();

  useEffect(() => {
    clearResult();
  }, [formValues.produto, formValues.preco, formValues.medida, formValues.limite, posterSize, clearResult]);

  const onSubmit = (data) => {
    const payload = { tamanho: posterSize, sheet: [data] };

    return generate(() => posterSize === "cartaz-grande"
      ? posterService.generateBigPoster(payload)
      : posterService.generateSmallPoster(payload));
  };

  const handleReset = () => {
    clearResult();
    reset();
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
          <ErrorText>{errors.produto?.message}</ErrorText>
        </div>

        <div className="flex items-start mt-4">
          <div className="flex flex-col items-center w-1/2">
            <label htmlFor="preco" className="block mb-1 text-center">Preço</label>
            <Input
              type="number"
              name="preco"
              step="0.01"
              placeholder="9,99"
              register={register}
              validation={{
                required: 'O preço é obrigatório',
                min: { value: 0.01, message: 'O preço deve ser maior que 0' }
              }}
              className="w-28 text-center rounded-md p-2"
            />
            <ErrorText className="mt-1">{errors.preco?.message}</ErrorText>
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
            <ErrorText className="mt-1">{errors.medida?.message}</ErrorText>
          </div>

          <div className="flex flex-col items-center w-1/2">
            <label htmlFor="limite" className="block mb-1 text-center">Limite</label>
            <Input
              type="text"
              name="limite"
              placeholder="02 UN."
              register={register}
              className="w-28 rounded-md p-2"
            />
            <ErrorText>{errors.limite?.message}</ErrorText>
          </div>
        </div>

        <SwitchPosterSize handleSizeChange={setPosterSize} errors={errors} />

        <ErrorText alert className="mb-2">{submitError}</ErrorText>

        <SubmitPosterButton isSubmiting={isSubmiting} disabled={!!downloadUrl} />
      </form>

      <DownloadResult downloadUrl={downloadUrl} message={successMessage} onReset={handleReset} />
    </div>
  );
}

export default StandardSingleForm;
