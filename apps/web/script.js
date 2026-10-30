const readline = require("readline");
const fs = require("fs");
const crypto = require("crypto");

const FILE = "codes.json";
const codes = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, "utf8")) : {};
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function generer(nom) {
  const key = nom.trim().toLowerCase().replace(/\s+/g, " ");
  if (codes[key]) return codes[key];

  const used = new Set(Object.values(codes));
  let n = crypto.createHash("sha256").update(key).digest().readUInt32BE(0) % 10000;
  while (used.has(String(n).padStart(4, "0"))) n = (n + 1) % 10000;

  const code = String(n).padStart(4, "0");
  codes[key] = code;
  fs.writeFileSync(FILE, JSON.stringify(codes, null, 2));
  return code;
}

function demander() {
  rl.question("Nom et prénom (vide pour quitter) : ", (nom) => {
    if (!nom.trim()) return rl.close();
    console.log("Code :", generer(nom), "\n");
    demander();
  });
}

demander();