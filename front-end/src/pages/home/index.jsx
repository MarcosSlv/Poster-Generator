import { useState } from 'react';
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
              <Tabs.List className="flex justify-center gap-2 border-b-2 border-border text-muted-foreground">
                <Tabs.Trigger
                  value="Individuais"
                  className="px-6 py-3 font-medium transition hover:text-secondary data-[state=active]:-mb-[2px] data-[state=active]:border-b-2 data-[state=active]:border-secondary data-[state=active]:text-secondary"
                >
                  Individuais
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="Planilhas"
                  className="px-6 py-3 font-medium transition hover:text-secondary data-[state=active]:-mb-[2px] data-[state=active]:border-b-2 data-[state=active]:border-secondary data-[state=active]:text-secondary"
                >
                  Planilhas
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </div>



          <div className="form-container mx-auto max-w-lg rounded-lg border border-border bg-card p-6 text-card-foreground shadow-md">
            <Tabs.Root value={modelType} onValueChange={setModelType} className="w-full">
              <Tabs.List className="mb-6 flex justify-center gap-2 border-b-2 border-border text-muted-foreground">
                <Tabs.Trigger
                  value="Padrão"
                  className="px-6 py-3 font-medium transition hover:text-secondary data-[state=active]:-mb-[2px] data-[state=active]:border-b-2 data-[state=active]:border-secondary data-[state=active]:text-secondary"
                >
                  Padrão
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="Combo"
                  className="px-6 py-3 font-medium transition hover:text-secondary data-[state=active]:-mb-[2px] data-[state=active]:border-b-2 data-[state=active]:border-secondary data-[state=active]:text-secondary"
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
