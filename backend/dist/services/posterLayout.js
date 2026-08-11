"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMBO_PRECO = exports.COMBO_SELO = exports.STACK_MARGINS = exports.PAGE_MARGINS = exports.COMBO_POSTER = exports.SMALL_POSTER = exports.BIG_POSTER = void 0;
exports.BIG_POSTER = {
    produto: { x: 35, y: 230, fontSize: 50, alignment: "center" },
    por: { x: 50, y: 500, fontSize: 30, alignment: "left" },
    moeda: { x: 17, y: 720, fontSize: 30, alignment: "left" },
    preco: { x: 10, y: 520, fontSize: 170, alignment: "center" },
    medida: { x: 0, y: 720, fontSize: 30, alignment: "right" },
    limite: { x: 10, y: 760, fontSize: 24, alignment: "center" }
};
exports.SMALL_POSTER = {
    top: {
        produto: { x: 280, y: 80, fontSize: 37, alignment: "center" },
        moeda: { x: 280, y: 335, fontSize: 20, alignment: "left" },
        preco: { x: 280, y: 276, fontSize: 76, alignment: "center" },
        medida: { x: 0, y: 335, fontSize: 20, alignment: "right" },
        limite: { x: 280, y: 370, fontSize: 12, alignment: "center" }
    },
    bottom: {
        produto: { x: 280, y: 510, fontSize: 37, alignment: "center" },
        moeda: { x: 280, y: 745, fontSize: 20, alignment: "left" },
        preco: { x: 280, y: 688, fontSize: 76, alignment: "center" },
        medida: { x: 0, y: 745, fontSize: 20, alignment: "right" },
        limite: { x: 280, y: 780, fontSize: 12, alignment: "center" }
    }
};
exports.COMBO_POSTER = {
    selo: { x: 247, y: 128, fontSize: 90, alignment: "right" },
    produto: { x: 20, y: 262, fontSize: 45, alignment: "center" },
    chamada: { x: 0, y: 515, fontSize: 40, alignment: "center" },
    moeda: { x: 12, y: 680, fontSize: 24, alignment: "left" },
    preco: { x: -3, y: 525, fontSize: 175, alignment: "center" },
    medida: { x: 534, y: 680, fontSize: 24, noWrap: true },
    unidade: { x: 0, y: 750, fontSize: 18, alignment: "center" }
};
exports.PAGE_MARGINS = {
    big: [10, 10, 20, 10],
    small: [10, 10, 28, 10],
    combo: [10, 10, 25, 10]
};
exports.STACK_MARGINS = {
    big: [0, 0, 0, 20],
    small: [0, 0, 0, 20],
    combo: [0, 0, 0, 25]
};
exports.COMBO_SELO = "10ZÃO";
exports.COMBO_PRECO = "10,00";
