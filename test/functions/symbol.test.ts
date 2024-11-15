import * as assert from "assert";
import * as vscode from "vscode";
import { OuDiaDocumentSymbolProvider } from "../../src/functions/symbol";
import path = require("path");

suite("OuDiaDocumentSymbolProvider#provideDocumentSymbols", () => {
  test("should ok", async () => {
    const provider = new OuDiaDocumentSymbolProvider();
    const uri = vscode.Uri.parse(
      path.join(__dirname, "../../test/resources/mock/eki_patterns.oud"),
    );

    const document = await vscode.workspace.openTextDocument(uri);
    const symbols = await provider.provideDocumentSymbols(
      document,
      new vscode.CancellationTokenSource().token,
    );

    assert.notEqual(symbols, null);
    assert.equal((symbols as vscode.DocumentSymbol[])[0].range.start.line, 0);
    assert.equal((symbols as vscode.DocumentSymbol[])[0].range.end.line, 83);
    assert.strictEqual(
      (symbols as vscode.DocumentSymbol[])[1].name,
      "駅パターン",
    );
  });
});
