import { useState } from 'react';
import { SegmentedControl } from "@radix-ui/themes";

import HeaderComponent from "../../../components/ui/Header";
import StandardSingleForm from "../../../components/poster/standard/StandardSingleForm";

import { motion, AnimatePresence } from "framer-motion";

function TestPage() {
  const [activeForm, setActiveForm] = useState("standard");

  const handleFormChange = (value) => {
    setActiveForm(value);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <HeaderComponent title={"Ferramentas"} />
        <div className="container mx-auto px-4 py-8 flex-1 flex flex-col items-center">
          <div className="max-w-xl">
            <div className="max-w-xl mb-8">
              <SegmentedControl.Root
                value={activeForm}
                onValueChange={handleFormChange}
                className="w-full"
                size="3"

              >
                <SegmentedControl.Item
                  value="standard"
                  className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cartaz padrão
                </SegmentedControl.Item>
                <SegmentedControl.Item
                  value="combo"
                  className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cartaz combo
                </SegmentedControl.Item>
              </SegmentedControl.Root>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <StandardSingleForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TestPage;