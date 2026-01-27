import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

function SwitchPosterSize({ handleSizeChange, errors }) {
  const [selectedSize, setSelectedSize] = useState("cartaz-grande");

  const handleChange = (value) => {
    setSelectedSize(value);
    handleSizeChange(value);
  };

  return (
    <div className="m-5">
      <h5 className="text-center text-lg font-medium text-gray-100 mb-3">Qual o tamanho do Cartaz?</h5>
      <div className="flex justify-center w-full px-4">
        <Tabs.Root value={selectedSize} onValueChange={handleChange} className="max-w-sm">
          <Tabs.List className="flex justify-center text-gray-100 gap-2 border-b-2 border-gray-300">
            <Tabs.Trigger
              value="cartaz-grande"
              className="px-6 py-3 font-medium transition hover:text-blue-100 data-[state=active]:text-blue-300 data-[state=active]:border-b-2 data-[state=active]:border-blue-300 data-[state=active]:-mb-[2px]"
            >
              Grande - A4
            </Tabs.Trigger>
            <Tabs.Trigger
              value="cartaz-pequeno"
              className="px-6 py-3 font-medium transition hover:text-blue-100 data-[state=active]:text-blue-300 data-[state=active]:border-b-2 data-[state=active]:border-blue-300 data-[state=active]:-mb-[2px]"
            >
              Pequeno - A5
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </div>
      {errors.tamanho && <p className="text-red-500 font-bold text-sm mt-1 text-center">{errors.tamanho.message}</p>}
    </div>
  );
}

export default SwitchPosterSize;