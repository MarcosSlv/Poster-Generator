export type posterContent = {
  produto: string;
  medida: string;
  preco: string;
  limite?: string;
};

export type comboPosterContent = {
  produto: string;
  medida: string;
  comboQtd?: string;
  comboVlr?: string;
};