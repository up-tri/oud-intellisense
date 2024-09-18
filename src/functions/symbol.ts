import { Oud2JSON } from "@route-builders/oud-to-json";
import * as vscode from "vscode";

export class OuDiaDocumentSymbolProvider
  implements vscode.DocumentSymbolProvider
{
  provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.DocumentSymbol[]> {
    const symbols: vscode.DocumentSymbol[] = [];

    const jsonOud = this.parseOud(document);
    const fileTypeSymbol = new vscode.DocumentSymbol(
      "FileType",
      `FileType=${jsonOud.FileType}`,
      vscode.SymbolKind.Key,
      new vscode.Range(0, 0, 0, document.lineAt(0).text.length),
      new vscode.Range(0, 0, 0, document.lineAt(0).text.length),
    );
    symbols.push(fileTypeSymbol);

    const rosenList: vscode.DocumentSymbol[] = jsonOud.Rosen.map(
      (rosen: any, i: number) => {
        const rosenSymbol = new vscode.DocumentSymbol(
          "Rosen",
          rosen.Rosenmei,
          vscode.SymbolKind.Namespace,
          new vscode.Range(rosen.__meta__.entry, 0, rosen.__meta__.last, 0),
          new vscode.Range(rosen.__meta__.entry, 0, rosen.__meta__.last, 0),
        );
        const { line: kitenJikokuLine, length: kitenJikokuLength } =
          this.findLineNumByKey(
            document,
            "KitenJikoku",
            rosen.__meta__.entry,
            rosen.__meta__.last,
          );
        if (kitenJikokuLine !== -1) {
          rosenSymbol.children.push(
            new vscode.DocumentSymbol(
              "KitenJikoku",
              rosen.KitenJikoku,
              vscode.SymbolKind.Variable,
              new vscode.Range(
                kitenJikokuLine,
                0,
                kitenJikokuLine,
                kitenJikokuLength,
              ),
              new vscode.Range(
                kitenJikokuLine,
                0,
                kitenJikokuLine,
                kitenJikokuLength,
              ),
            ),
          );
        }
        const {
          line: diagramDgrYZahyouKyoriDefaultLine,
          length: diagramDgrYZahyouKyoriDefaultLength,
        } = this.findLineNumByKey(
          document,
          "DiagramDgrYZahyouKyoriDefault",
          rosen.__meta__.entry,
          rosen.__meta__.last,
        );
        if (diagramDgrYZahyouKyoriDefaultLine !== -1) {
          rosenSymbol.children.push(
            new vscode.DocumentSymbol(
              "DiagramDgrYZahyouKyoriDefault",
              rosen.DiagramDgrYZahyouKyoriDefault,
              vscode.SymbolKind.Variable,
              new vscode.Range(
                diagramDgrYZahyouKyoriDefaultLine,
                0,
                diagramDgrYZahyouKyoriDefaultLine,
                diagramDgrYZahyouKyoriDefaultLength,
              ),
              new vscode.Range(
                diagramDgrYZahyouKyoriDefaultLine,
                0,
                diagramDgrYZahyouKyoriDefaultLine,
                diagramDgrYZahyouKyoriDefaultLength,
              ),
            ),
          );
        }
        const { line: commentLine, length: commentLength } =
          this.findLineNumByKey(
            document,
            "Comment",
            rosen.__meta__.entry,
            rosen.__meta__.last,
          );
        if (commentLine !== -1) {
          rosenSymbol.children.push(
            new vscode.DocumentSymbol(
              "Comment",
              rosen.Comment,
              vscode.SymbolKind.Variable,
              new vscode.Range(commentLine, 0, commentLine, commentLength),
              new vscode.Range(commentLine, 0, commentLine, commentLength),
            ),
          );
        }

        // 駅一覧
        const ekiListStartEnd = this.parseListItemStartEnd(rosen.Eki);
        const ekiListSymbol = new vscode.DocumentSymbol(
          "List<Eki>",
          "",
          vscode.SymbolKind.Namespace,
          new vscode.Range(ekiListStartEnd.entry, 0, ekiListStartEnd.last, 0),
          new vscode.Range(ekiListStartEnd.entry, 0, ekiListStartEnd.last, 0),
        );
        ekiListSymbol.children = rosen.Eki.map((eki: any, j: number) => {
          const ekiKeys = Object.keys(eki).filter((key) => key !== "__meta__");
          const ekiSymbol = new vscode.DocumentSymbol(
            "Eki",
            eki.Ekimei,
            vscode.SymbolKind.Namespace,
            new vscode.Range(eki.__meta__.entry, 0, eki.__meta__.last, 0),
            new vscode.Range(eki.__meta__.entry, 0, eki.__meta__.last, 0),
          );
          ekiSymbol.children = ekiKeys.map((key) => {
            const { line: keyLine, length: keyLength } = this.findLineNumByKey(
              document,
              key,
              eki.__meta__.entry,
              eki.__meta__.last,
            );
            return new vscode.DocumentSymbol(
              key,
              eki[key],
              vscode.SymbolKind.Variable,
              new vscode.Range(keyLine, 0, keyLine, keyLength),
              new vscode.Range(keyLine, 0, keyLine, keyLength),
            );
          });
          return ekiSymbol;
        });
        rosenSymbol.children.push(ekiListSymbol);

        // 列車種別一覧
        const ressyasyubetsuListStartEnd = this.parseListItemStartEnd(
          rosen.Ressyasyubetsu,
        );
        const ressyasyubetsuListSymbol = new vscode.DocumentSymbol(
          "List<Ressyasyubetsu>",
          "",
          vscode.SymbolKind.Namespace,
          new vscode.Range(
            ressyasyubetsuListStartEnd.entry,
            0,
            ressyasyubetsuListStartEnd.last,
            0,
          ),
          new vscode.Range(
            ressyasyubetsuListStartEnd.entry,
            0,
            ressyasyubetsuListStartEnd.last,
            0,
          ),
        );
        ressyasyubetsuListSymbol.children = rosen.Ressyasyubetsu.map(
          (ressyasyubetsu: any, j: number) => {
            const ressyasyubetsuKeys = Object.keys(ressyasyubetsu).filter(
              (key) => key !== "__meta__",
            );
            const ressyasyubetsuSymbol = new vscode.DocumentSymbol(
              "Ressyasyubetsu",
              ressyasyubetsu.Ressyasyubetsu,
              vscode.SymbolKind.Namespace,
              new vscode.Range(
                ressyasyubetsu.__meta__.entry,
                0,
                ressyasyubetsu.__meta__.last,
                0,
              ),
              new vscode.Range(
                ressyasyubetsu.__meta__.entry,
                0,
                ressyasyubetsu.__meta__.last,
                0,
              ),
            );
            ressyasyubetsuSymbol.children = ressyasyubetsuKeys.map((key) => {
              const { line: keyLine, length: keyLength } =
                this.findLineNumByKey(
                  document,
                  key,
                  ressyasyubetsu.__meta__.entry,
                  ressyasyubetsu.__meta__.last,
                );
              return new vscode.DocumentSymbol(
                key,
                ressyasyubetsu[key],
                vscode.SymbolKind.Variable,
                new vscode.Range(keyLine, 0, keyLine, keyLength),
                new vscode.Range(keyLine, 0, keyLine, keyLength),
              );
            });
            return ressyasyubetsuSymbol;
          },
        );
        rosenSymbol.children.push(ressyasyubetsuListSymbol);

        // ダイヤ一覧
        const diaListStartEnd = this.parseListItemStartEnd(rosen.Dia);
        const diaListSymbol = new vscode.DocumentSymbol(
          "List<Dia>",
          "",
          vscode.SymbolKind.Namespace,
          new vscode.Range(diaListStartEnd.entry, 0, diaListStartEnd.last, 0),
          new vscode.Range(diaListStartEnd.entry, 0, diaListStartEnd.last, 0),
        );
        diaListSymbol.children = rosen.Dia.map((dia: any, j: number) => {
          const diaKeys = Object.keys(dia).filter(
            (key) => key !== "__meta__" && key !== "Kudari" && key !== "Nobori",
          );
          const diaSymbol = new vscode.DocumentSymbol(
            "Dia",
            dia.DiaName,
            vscode.SymbolKind.Namespace,
            new vscode.Range(dia.__meta__.entry, 0, dia.__meta__.last, 0),
            new vscode.Range(dia.__meta__.entry, 0, dia.__meta__.last, 0),
          );
          diaSymbol.children = diaKeys.map((key) => {
            const { line: keyLine, length: keyLength } = this.findLineNumByKey(
              document,
              key,
              dia.__meta__.entry,
              dia.__meta__.last,
            );
            return new vscode.DocumentSymbol(
              key,
              dia[key],
              vscode.SymbolKind.Variable,
              new vscode.Range(keyLine, 0, keyLine, keyLength),
              new vscode.Range(keyLine, 0, keyLine, keyLength),
            );
          });

          // 下りダイヤ
          const kudariListStartEnd = dia.Kudari.__meta__;
          const kudariListSymbol = new vscode.DocumentSymbol(
            "下り",
            "",
            vscode.SymbolKind.Namespace,
            new vscode.Range(
              kudariListStartEnd.entry,
              0,
              kudariListStartEnd.last,
              0,
            ),
            new vscode.Range(
              kudariListStartEnd.entry,
              0,
              kudariListStartEnd.last,
              0,
            ),
          );
          const kudariRessyaListStartEnd = this.parseListItemStartEnd(
            dia.Kudari.Ressya,
          );
          const kudariRessyaListSymbol = new vscode.DocumentSymbol(
            "List<Ressya>",
            "",
            vscode.SymbolKind.Namespace,
            new vscode.Range(
              kudariRessyaListStartEnd.entry,
              0,
              kudariRessyaListStartEnd.last,
              0,
            ),
            new vscode.Range(
              kudariRessyaListStartEnd.entry,
              0,
              kudariRessyaListStartEnd.last,
              0,
            ),
          );
          kudariRessyaListSymbol.children = dia.Kudari.Ressya.map(
            (ressya: any, k: number) => {
              const ressyaKeys = Object.keys(ressya).filter(
                (key) => key !== "__meta__",
              );
              const ressyaSymbol = new vscode.DocumentSymbol(
                "Ressya",
                ressya.RessyaName,
                vscode.SymbolKind.Namespace,
                new vscode.Range(
                  ressya.__meta__.entry,
                  0,
                  ressya.__meta__.last,
                  0,
                ),
                new vscode.Range(
                  ressya.__meta__.entry,
                  0,
                  ressya.__meta__.last,
                  0,
                ),
              );
              ressyaSymbol.children = ressyaKeys.map((key) => {
                const { line: keyLine, length: keyLength } =
                  this.findLineNumByKey(
                    document,
                    key,
                    ressya.__meta__.entry,
                    ressya.__meta__.last,
                  );
                return new vscode.DocumentSymbol(
                  key,
                  ressya[key],
                  vscode.SymbolKind.Variable,
                  new vscode.Range(keyLine, 0, keyLine, keyLength),
                  new vscode.Range(keyLine, 0, keyLine, keyLength),
                );
              });
              return ressyaSymbol;
            },
          );
          kudariListSymbol.children.push(kudariRessyaListSymbol);

          // 上りダイヤ
          const noboriListStartEnd = dia.Nobori.__meta__;
          const noboriListSymbol = new vscode.DocumentSymbol(
            "上り",
            "",
            vscode.SymbolKind.Namespace,
            new vscode.Range(
              noboriListStartEnd.entry,
              0,
              noboriListStartEnd.last,
              0,
            ),
            new vscode.Range(
              noboriListStartEnd.entry,
              0,
              noboriListStartEnd.last,
              0,
            ),
          );
          const noboriRessyaListStartEnd = this.parseListItemStartEnd(
            dia.Nobori.Ressya,
          );
          const noboriRessyaListSymbol = new vscode.DocumentSymbol(
            "List<Ressya>",
            "",
            vscode.SymbolKind.Namespace,
            new vscode.Range(
              noboriRessyaListStartEnd.entry,
              0,
              noboriRessyaListStartEnd.last,
              0,
            ),
            new vscode.Range(
              noboriRessyaListStartEnd.entry,
              0,
              noboriRessyaListStartEnd.last,
              0,
            ),
          );
          noboriRessyaListSymbol.children = dia.Nobori.Ressya.map(
            (ressya: any, k: number) => {
              const ressyaKeys = Object.keys(ressya).filter(
                (key) => key !== "__meta__",
              );
              const ressyaSymbol = new vscode.DocumentSymbol(
                "Ressya",
                ressya.RessyaName,
                vscode.SymbolKind.Namespace,
                new vscode.Range(
                  ressya.__meta__.entry,
                  0,
                  ressya.__meta__.last,
                  0,
                ),
                new vscode.Range(
                  ressya.__meta__.entry,
                  0,
                  ressya.__meta__.last,
                  0,
                ),
              );
              ressyaSymbol.children = ressyaKeys.map((key) => {
                const { line: keyLine, length: keyLength } =
                  this.findLineNumByKey(
                    document,
                    key,
                    ressya.__meta__.entry,
                    ressya.__meta__.last,
                  );
                return new vscode.DocumentSymbol(
                  key,
                  ressya[key],
                  vscode.SymbolKind.Variable,
                  new vscode.Range(keyLine, 0, keyLine, keyLength),
                  new vscode.Range(keyLine, 0, keyLine, keyLength),
                );
              });
              return ressyaSymbol;
            },
          );
          noboriListSymbol.children.push(noboriRessyaListSymbol);

          diaSymbol.children.push(kudariListSymbol);
          diaSymbol.children.push(noboriListSymbol);

          return diaSymbol;
        });
        rosenSymbol.children.push(diaListSymbol);

        return rosenSymbol;
      },
    );
    symbols.push(...rosenList);

    return symbols;
  }

  private parseOud(document: vscode.TextDocument) {
    return JSON.parse(new Oud2JSON(document.getText().split("\n")).parse());
  }

  private findLineNumByKey(
    document: vscode.TextDocument,
    key: string,
    from: number,
    to: number,
  ): { line: number; length: number } {
    for (let i = from; i <= to; i++) {
      if (document.lineAt(i).text.startsWith(`${key}=`)) {
        return { line: i, length: document.lineAt(i).text.length };
      }
    }
    return { line: -1, length: -1 };
  }

  private parseListItemStartEnd(
    items: { __meta__: { entry: number; last: number } }[],
  ) {
    return items.reduce(
      (acc, item) => {
        if (item.__meta__.entry < acc.entry) {
          acc.entry = item.__meta__.entry;
        }
        if (item.__meta__.last > acc.last) {
          acc.last = item.__meta__.last;
        }
        return acc;
      },
      { entry: Infinity, last: -Infinity },
    );
  }
}
