import { useState } from "react";

function SwitchPosterSize({ handleSizeChange }) {
  const [selectedSize, setSelectedSize] = useState("cartaz-grande");

  return (
    <fieldset className="size-options">
      <legend>Tamanho do cartaz</legend>
      <div className="size-grid">
        {[
          { value: "cartaz-grande", title: "A4", description: "Grande · 210 × 297 mm" },
          { value: "cartaz-pequeno", title: "A5", description: "Pequeno · 148 × 210 mm" },
        ].map(({ value, title, description }) => (
          <label key={value} className={selectedSize === value ? "selected" : ""}>
            <input type="radio" name="poster-size" value={value} checked={selectedSize === value} onChange={() => {
              setSelectedSize(value);
              handleSizeChange(value);
            }} />
            <span className={`size-paper ${title.toLowerCase()}`} aria-hidden="true" />
            <span><strong>{title}</strong><small>{description}</small></span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

SwitchPosterSize.propTypes = {
  handleSizeChange: (props, name) => typeof props[name] === "function" ? null : new Error("handleSizeChange deve ser uma função"),
};

export default SwitchPosterSize;
