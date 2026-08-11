import { useState } from 'react';
import PropTypes from 'prop-types';
import * as Tabs from '@radix-ui/react-tabs';

import ErrorText from './ErrorText';

const TRIGGER_CLASS = "px-6 py-3 font-medium transition hover:text-secondary data-[state=active]:-mb-[2px] data-[state=active]:border-b-2 data-[state=active]:border-secondary data-[state=active]:text-secondary";

function SwitchPosterSize({ handleSizeChange, errors = {} }) {
  const [selectedSize, setSelectedSize] = useState("cartaz-grande");

  const handleChange = (value) => {
    setSelectedSize(value);
    handleSizeChange(value);
  };

  return (
    <div className="m-5">
      <h5 className="mb-3 text-center text-lg font-medium text-card-foreground">Qual o tamanho do Cartaz?</h5>
      <div className="flex justify-center w-full px-4">
        <Tabs.Root value={selectedSize} onValueChange={handleChange} className="max-w-sm">
          <Tabs.List className="flex justify-center gap-2 border-b-2 border-border text-muted-foreground">
            <Tabs.Trigger value="cartaz-grande" className={TRIGGER_CLASS}>
              Grande - A4
            </Tabs.Trigger>
            <Tabs.Trigger value="cartaz-pequeno" className={TRIGGER_CLASS}>
              Pequeno - A5
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </div>
      <ErrorText className="mt-1">{errors.tamanho?.message}</ErrorText>
    </div>
  );
}

SwitchPosterSize.propTypes = {
  handleSizeChange: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default SwitchPosterSize;
