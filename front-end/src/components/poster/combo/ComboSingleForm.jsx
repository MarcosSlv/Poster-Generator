import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { posterService } from "../../../services/posterService";
import usePosterGeneration from "../../../hooks/usePosterGeneration";

import Input from "../../ui/Input";
import ErrorText from "../../ui/ErrorText";
import DownloadResult from "../DownloadResult";
import SubmitPosterButton from "../SubmitPosterButton";

function ComboSingleForm() {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const { downloadUrl, successMessage, submitError, isSubmiting, generate, clearResult } = usePosterGeneration();

  const formValues = watch();

  useEffect(() => {
    clearResult();
  }, [formValues.produto, formValues.comboVlr, formValues.medida, formValues.comboQtd, clearResult]);

  const onSubmit = (data) => {
    const payload = {
      sheet: [{
        ...data,
        comboQtd: String(data.comboQtd).padStart(2, '0'),
        comboVlr: Number(String(data.comboVlr).replace(',', '.')).toFixed(2)
      }]
    };

    return generate(() => posterService.generateComboPoster(payload));
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
            <ErrorText className="mt-1">{errors.comboQtd?.message}</ErrorText>
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
            <ErrorText>{errors.comboVlr?.message}</ErrorText>
          </div>
        </div>

        <div className="mt-6">
          <ErrorText alert className="mb-2">{submitError}</ErrorText>

          <SubmitPosterButton isSubmiting={isSubmiting} disabled={!!downloadUrl} />
        </div>
      </form>

      <DownloadResult downloadUrl={downloadUrl} message={successMessage} onReset={handleReset} />
    </div>
  );
}

export default ComboSingleForm;
