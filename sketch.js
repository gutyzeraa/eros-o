let gotas = [];
let solo;
let tipoSolo = "vegetacao"; // valor inicial
let rio = [];
let larguraRio = 5;
let estadoRio = "fluindo"; // Pode ser "fluindo" ou "secando"
let taxaSecagem = 0.05;

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("canvas-holder");
  solo = new Solo(tipoSolo);
}

function draw() {
  background(200, 220, 255); // céu

  for (let i = gotas.length - 1; i >= 0; i--) {
    gotas[i].cair();
    gotas[i].mostrar();

    if (gotas[i].atingeSolo(solo.altura)) {
      solo.aumentarErosao();
      // Adiciona pontos ao rio na área de erosão
      rio.push(createVector(gotas[i].x, solo.altura));
      gotas.splice(i, 1);
    }
  }

  // Desenha o rio
  noStroke();
  fill(0, 100, 200, 150); // Azul com transparência
  beginShape();
  for (let v of rio) {
    vertex(v.x, v.y);
  }
  vertex(width, solo.altura);
  vertex(0, solo.altura);
  endShape(CLOSE);

  solo.mostrar();

  if (frameCount % 5 === 0) {
    gotas.push(new Gota());
  }

  // Simula o rio secando
  if (estadoRio === "fluindo" && solo.erosao > 50) { // Começa a secar após um pouco de erosão
    estadoRio = "secando";
  }

  if (estadoRio === "secando" && larguraRio > 0) {
    larguraRio -= taxaSecagem;
    // Faz o rio encolher gradualmente
    for (let i = 0; i < rio.length; i++) {
      let deslocamento = map(i, 0, rio.length - 1, -taxaSecagem * 5, taxaSecagem * 5); // Pequeno deslocamento para dar um efeito irregular
      rio[i].y += taxaSecagem * 0.5 + deslocamento * 0.1; // Move os pontos para baixo
    }
  } else if (estadoRio === "secando" && larguraRio <= 0) {
    rio = []; // Remove o rio quando estiver completamente seco
    estadoRio = "seco";
  }
}

function setSoilType(tipo) {
  tipoSolo = tipo;
  solo = new Solo(tipoSolo);
  rio = []; // Limpa o rio ao mudar o tipo de solo
  larguraRio = 5;
  estadoRio = "fluindo";
}

class Gota {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.vel = random(4, 6);
  }

  cair() {
    this.y += this.vel;
  }

  mostrar() {
    stroke(0, 0, 200);
    line(this.x, this.y, this.x, this.y + 10);
  }

  atingeSolo(ySolo) {
    return this.y > ySolo;
  }
}

class Solo {
  constructor(tipo) {
    this.tipo = tipo;
    this.altura = height - 80;
    this.erosao = 0;
  }

  aumentarErosao() {
    let taxa;
    if (this.tipo === "vegetacao") taxa = 0.1;
    else if (this.tipo === "exposto") taxa = 0.5;
    else if (this.tipo === "urbanizado") taxa = 0.3;

    this.erosao += taxa;
    this.altura += taxa;
  }

  mostrar() {
    noStroke();
    if (this.tipo === "vegetacao") fill(60, 150, 60);
    else if (this.tipo === "exposto") fill(139, 69, 19);
    else if (this.tipo === "urbanizado") fill(120);

    rect(0, this.altura, width, height - this.altura);

    fill(0);
    textSize(14);
    textAlign(LEFT);
    text(`Erosão: ${this.erosao.toFixed(1)}`, 10, 20);
    text(`Tipo de solo: ${this.tipo}`, 10, 40);
    text(`Estado do Rio: ${estadoRio}`, 10, 60);
  }
}
