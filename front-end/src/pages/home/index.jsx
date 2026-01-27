import { useState } from 'react';
import { SegmentedControl } from "@radix-ui/themes";
import * as Tabs from '@radix-ui/react-tabs';

import HeaderComponent from "../../components/ui/Header";

import { motion, AnimatePresence } from "framer-motion";
import ComboSingleForm from "../../components/poster/combo/ComboSingleForm";
import StandardSingleForm from "../../components/poster/standard/StandardSingleForm";
import StandardSheetUpload from "../../components/poster/standard/StandardSheetUpload";
import ComboSheetUpload from "../../components/poster/combo/ComboSheetUpload";

function Home() {
  const [processType, setProcessType] = useState("Individuais");
  const [modelType, setModelType] = useState("Padrão");

  const renderForm = () => {
    const formConfig = {
      Individuais: {
        Padrão: <StandardSingleForm />,
        Combo: <ComboSingleForm />,
      },
      Planilhas: {
        Padrão: <StandardSheetUpload />,
        Combo: <ComboSheetUpload />,
      },
    };

    return formConfig[processType][modelType];
  };

  return (
    <>
      <div className="overflow-hidden">
        <HeaderComponent title={"Criação de cartazes"} />
        <div className="container mx-auto my-5">
          <div className="flex justify-center mb-6">
            <Tabs.Root value={processType} onValueChange={setProcessType} className="w-full max-w-md">
              <Tabs.List className="flex justify-center text-gray-100 gap-2 border-b-2 border-gray-300">
                <Tabs.Trigger
                  value="Individuais"
                  className="px-6 py-3 font-medium transition hover:text-blue-100 data-[state=active]:text-blue-300 data-[state=active]:border-b-2 data-[state=active]:border-blue-300 data-[state=active]:-mb-[2px]"
                >
                  Individuais
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="Planilhas"
                  className="px-6 py-3 font-medium transition hover:text-blue-100 data-[state=active]:text-blue-300 data-[state=active]:border-b-2 data-[state=active]:border-blue-300 data-[state=active]:-mb-[2px]"
                >
                  Planilhas
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </div>



          <div className="form-container bg-gray-400 p-6 rounded-lg shadow-md shadow-gray-300 max-w-lg mx-auto">
            <Tabs.Root value={modelType} onValueChange={setModelType} className="w-full">
              <Tabs.List className="flex justify-center text-gray-100 gap-2 border-b-2 border-gray-200 mb-6">
                <Tabs.Trigger
                  value="Padrão"
                  className="px-6 py-3 font-medium transition hover:text-blue-100 data-[state=active]:text-blue-300 data-[state=active]:border-b-2 data-[state=active]:border-blue-300 data-[state=active]:-mb-[2px]"
                >
                  Padrão
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="Combo"
                  className="px-6 py-3 font-medium transition hover:text-blue-100 data-[state=active]:text-blue-300 data-[state=active]:border-b-2 data-[state=active]:border-blue-300 data-[state=active]:-mb-[2px]"
                >
                  Combo
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="Padrão">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${processType}-Padrão`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {renderForm()}
                  </motion.div>
                </AnimatePresence>
              </Tabs.Content>

              <Tabs.Content value="Combo">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${processType}-Combo`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {renderForm()}
                  </motion.div>
                </AnimatePresence>
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;