// arquivo Typescript que lê um CSV e guarda, na forma de um array, os valores das células em um array bidimensional da forma
// a[linha][coluna] := valores
// para compilar e rodar, .... {perguntar ao marcos} -- rm DesconverteCSV.js; tsc DesconverteCSV.ts; node DesconverteCSV.js

export class DesconverteCSV {

  /** file manipulation under node.js */
  private static fs: any = require('fs');

  public static leCSV(arquivo: string): string[][] {

    let resultado: string[][] = [];

    let contentCSV: string = DesconverteCSV.fs.readFileSync(arquivo, 'UTF-8');

    // CORREÇÕES
    // remove \n dentro de campos
    contentCSV = contentCSV.replace(/[^"]\n/g, '\\n');

    // lê linhas
    let linhasCSV: string[] = contentCSV.split('\n');

    // para cada linha
    for (let linha of linhasCSV) {

        let camposResultado: string[] = [];

        let camposCSV: string[] = linha.split('\t');     // se \t não servir, usar outro separador na hora de exportar pra CSV -- algo como §

        // tipos de campo:
        // 1) "(conteúdo)"
        // 2) (conteúdo)
        for (let campo of camposCSV) {
            let valorCampo = campo.replace(/^"(.*)"$/g, '$1');
            camposResultado.push(valorCampo);
        }

        resultado.push(camposResultado);

    }
    
    return resultado;
  }

  public static salvaJSON(json: any, arquivo: string) {
    let texto: string = JSON.stringify(json);    // função de serialização de um JSON
    DesconverteCSV.writeFile(arquivo, [texto]);
  }

  public static writeFile(filePath: string, lines: string[]) {
    let fileContents: string = '';
    for (let line of lines) {
      fileContents = fileContents.concat(`${line}\n`);
    }

    DesconverteCSV.fs.writeFile(filePath, fileContents, function (err: any) {
      if (err) {
        let errorMsg: string = `mutua.available.modules.and.components.config.ts: could not write to ${filePath}`;
        console.log(errorMsg);
        throw new Error(errorMsg);
      }
    });
  }
}

  // 1) lê CSV
  let a: string[][] = DesconverteCSV.leCSV('arquivo.csv');

  console.log(a[0][0]);
  console.log(a[0][1]);
  console.log(a[1][0]);
  console.log(a[1][1]);
  
  // 2) converte dados
//  json = [];
//  json[0].a = a[linha_1][col_3];

  // 3) salva JSON
//  DesconverteCSV.salvaJSON(json, 'arquivo.json');


