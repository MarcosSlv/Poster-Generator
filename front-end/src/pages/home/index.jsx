import { useState } from "react";
import { LuArrowDownToLine, LuArrowUpRight, LuCheck, LuFileSpreadsheet, LuLayers, LuScanLine, LuSquarePen } from "react-icons/lu";

import PosterPreviewContext from "../../context/PosterPreviewContext";
import ComboSingleForm from "../../components/poster/combo/ComboSingleForm";
import StandardSingleForm from "../../components/poster/standard/StandardSingleForm";
import StandardSheetUpload from "../../components/poster/standard/StandardSheetUpload";
import ComboSheetUpload from "../../components/poster/combo/ComboSheetUpload";
import "./studio.css";

function Home() {
  const [processType, setProcessType] = useState("individual");
  const [modelType, setModelType] = useState("standard");
  const [preview, setPreview] = useState({});
  const isSheet = processType === "sheet";
  const isCombo = modelType === "combo";
  const isSmall = !isCombo && preview.size === "cartaz-pequeno";
  const product = preview.produto || "Seu produto aqui";
  const rawPrice = isCombo ? preview.comboVlr : preview.preco;
  const numberPrice = Number(String(rawPrice || "0").replace(",", "."));
  const price = Number.isFinite(numberPrice)
    ? numberPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "0,00";
  const [integer, decimal] = price.split(",");
  const templatePath = `/assets/sheets/modelo-cartaz-${isCombo ? "combo" : "comum"}.xlsx`;

  const changeProcess = (value) => {
    setPreview({});
    setProcessType(value);
  };
  const changeModel = (value) => {
    setPreview({});
    setModelType(value);
  };

  return (
    <main className="studio-main" id="editor">
      <section className="studio-intro" aria-labelledby="studio-title">
        <div>
          <p className="eyebrow"><span /> SUA OFERTA EM DESTAQUE</p>
          <h1 id="studio-title">Crie. Confira. <span>Imprima.</span></h1>
          <p className="intro-description">Transforme seus produtos em cartazes. Simples de criar, prontos para vender.</p>
        </div>
        <div className="intro-note"><LuScanLine aria-hidden="true" /><span>Do seu jeito.<br /><strong>Direto para o papel.</strong></span></div>
      </section>

      <div className="studio-workspace">
        <section className="editor-panel" aria-labelledby="editor-title">
          <div className="panel-heading">
            <span className="step-number">01</span>
            <div><h2 id="editor-title">Configure seu cartaz</h2><p>Uma boa oferta começa nos detalhes.</p></div>
          </div>

          <fieldset className="process-options">
            <legend className="sr-only">Como deseja criar os cartazes?</legend>
            <label className={isSheet ? "" : "selected"}>
              <input type="radio" name="process" value="individual" checked={!isSheet} onChange={() => changeProcess("individual")} />
              <LuSquarePen aria-hidden="true" /> Individual
            </label>
            <label className={isSheet ? "selected" : ""}>
              <input type="radio" name="process" value="sheet" checked={isSheet} onChange={() => changeProcess("sheet")} />
              <LuFileSpreadsheet aria-hidden="true" /> Por planilha
            </label>
          </fieldset>

          <fieldset className="model-options">
            <legend>Modelo do cartaz</legend>
            <div className="model-grid">
              <label className={!isCombo ? "selected" : ""}>
                <input type="radio" name="model" value="standard" checked={!isCombo} onChange={() => changeModel("standard")} />
                <span className="model-icon"><LuScanLine aria-hidden="true" /></span>
                <span><strong>Padrão</strong><small>Um produto, um preço</small></span>
                {!isCombo && <LuCheck className="model-check" aria-hidden="true" />}
              </label>
              <label className={isCombo ? "selected" : ""}>
                <input type="radio" name="model" value="combo" checked={isCombo} onChange={() => changeModel("combo")} />
                <span className="model-icon"><LuLayers aria-hidden="true" /></span>
                <span><strong>Combo</strong><small>Mais por menos</small></span>
                {isCombo && <LuCheck className="model-check" aria-hidden="true" />}
              </label>
            </div>
          </fieldset>

          <div className="form-divider"><span>{isSheet ? "Importe seus produtos" : "Dados da oferta"}</span></div>
          <PosterPreviewContext.Provider value={setPreview}>
            <div className="studio-form" key={`${processType}-${modelType}`}>
              {isSheet
                ? (isCombo ? <ComboSheetUpload /> : <StandardSheetUpload />)
                : (isCombo ? <ComboSingleForm /> : <StandardSingleForm />)}
            </div>
          </PosterPreviewContext.Provider>
          <p className="editor-footnote"><LuArrowDownToLine aria-hidden="true" /> Seu cartaz será gerado em PDF para impressão.</p>
        </section>

        <section className="preview-panel" aria-labelledby="preview-title">
          <div className="preview-heading">
            <div><span className="eyebrow">02 · CONFIRA SUA OFERTA</span><h2 id="preview-title">Uma ideia de como vai ficar.</h2></div>
            <span className="preview-badge"><span /> Prévia de conteúdo</span>
          </div>

          <div className="preview-stage">
            <span className="paper-dimension">{isSmall ? "A5 · 148 × 210 mm" : "A4 · 210 × 297 mm"}</span>
            <div className={`poster-paper ${isSmall ? "small-poster" : ""}`} aria-label="Conteúdo do cartaz">
              <div className={`poster-product ${product.length > 45 ? "long-product" : ""}`}>{product}</div>
              <div className="poster-offer">
                <p className="poster-prefix">{isCombo ? `LEVE ${preview.comboQtd || "03"} ${preview.medida || "UN"} POR:` : "POR:"}</p>
                <div className={`poster-price ${integer.length > 4 ? "long-price" : ""}`}><span>R$</span><strong>{integer}<sup>,{decimal}</sup></strong></div>
                <span className="poster-unit">{isCombo ? "O COMBO" : preview.medida || "UN"}</span>
                {!isCombo && preview.limite && <p className="poster-limit">LIMITADO A {preview.limite} POR CLIENTE</p>}
              </div>
            </div>
            <div className="paper-caption"><LuScanLine aria-hidden="true" /><span>{isCombo ? "Modelo combo" : "Modelo padrão"}</span><span className="caption-dot">·</span><span>{isSmall ? "Formato A5" : "Formato A4"}</span></div>
          </div>

          <div className="preview-bottom">
            <div><LuCheck aria-hidden="true" /><span>{isSheet ? `${preview.count || 0} produto(s) na planilha` : "Atualiza enquanto você preenche"}</span></div>
            <p>Prévia ilustrativa dos dados{isSheet ? " do primeiro produto" : ""}. Confira o PDF antes de imprimir.</p>
          </div>
        </section>
      </div>

      <aside className="studio-tip">
        <span className="tip-icon"><LuFileSpreadsheet aria-hidden="true" /></span>
        <div><strong>Muitas ofertas? Crie de uma vez.</strong><p>Use nossa planilha modelo para gerar vários cartazes em poucos cliques.</p></div>
        <a href={templatePath} download>Baixar planilha modelo <LuArrowUpRight aria-hidden="true" /></a>
      </aside>
      <footer className="studio-footer"><span>Poster Generator</span><span>Mais tempo para o que importa. Mais destaque para suas ofertas.</span></footer>
    </main>
  );
}

export default Home;
