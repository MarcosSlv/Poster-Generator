import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { posterService } from "../../../services/posterService";
import { motion, AnimatePresence } from "framer-motion";
import { MdDownload } from "react-icons/md";

import Input from "../../ui/Input";
import SwitchPosterSize from "../../ui/SwitchPosterSize";
import Button from "../../ui/Button";

function StandardSingleForm() {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const [posterSize, setPosterSize] = useState("cartaz-grande");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [reqResponse, setReqResponse] = useState("");

  const formValues = watch();

  useEffect(() => {
    if (downloadUrl) {
      setDownloadUrl("");
      setReqResponse("");
    }
  }, [formValues.produto, formValues.preco, formValues.medida, formValues.limite, posterSize]);

  const onSubmit = async (data) => {
    setDownloadUrl("");
    setReqResponse("");
    setIsSubmiting(true);

    const formatedData = {
      tamanho: posterSize,
      sheet: [data],
    };

    try {
      const responseData = (posterSize === "cartaz-grande")
        ? await posterService.generateBigPoster(formatedData)
        : await posterService.generateSmallPoster(formatedData);

      if (responseData.status === "Success") {
        setDownloadUrl(responseData.download);
        setReqResponse(responseData.message);
      }
      setIsSubmiting(false);
    } catch (error) {
      console.error("Erro ao criar cartaz:", error);
      setReqResponse("Erro ao criar cartaz. Por favor, tente novamente.");
      setIsSubmiting(false);
    }
  };

  return (
    <div className="space-y-4 text-gray-100">
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
          {errors.produto && <p className="text-red-400 font-bold text-sm text-center">{errors.produto.message}</p>}
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
            {errors.preco && <p className="text-red-400 font-bold text-sm text-center mt-1">{errors.preco.message}</p>}
          </div>

          <div className="flex flex-col items-center w-1/2">
            <label htmlFor="medida" className="block mb-1 text-center">Medida</label>
            <select
              id="medida"
              {...register("medida", { required: 'A medida é obrigatória' })}
              className="w-28 bg-blue-300 text-gray-100 rounded-md p-2"
            >
              <option value="UN">UN</option>
              <option value="KG">KG</option>
            </select>
            {errors.medida && <p className="text-red-400 text-sm text-center mt-1">{errors.medida.message}</p>}
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
            {errors.limite && <p className="text-red-400 text-sm text-center">{errors.limite.message}</p>}
          </div>
        </div>

        <SwitchPosterSize handleSizeChange={(e) => setPosterSize(e)} errors={errors} />

        {isSubmiting ? (
          <Button type="submit" text={
            <div className="animate-spin inline-block w-6 h-6 border-2 mx-8 border-gray-100 border-t-transparent rounded-full" role="status">
            </div>
          } disabled={true} />
        ) : (
          <Button type="submit" text="Criar Cartaz" disabled={isSubmiting || reqResponse} />
        )}
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
              <p className="text-center mt-4 text-green-300">{reqResponse} Clique no botão abaixo para fazer o download</p>
              <a href={downloadUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center mt-4">
                <Button text={<MdDownload className="mr-1 text-xl" />} />
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

export default StandardSingleForm;