const assert = require("assert");
const path = require("path");
const vscode = require("vscode");
const { OuDiaDocumentSymbolProvider } = require("../../dist/functions/symbol");

suite("OuDiaDocumentSymbolProvider#provideDocumentSymbols", () => {
  test("should ok", async () => {
    const provider = new OuDiaDocumentSymbolProvider();
    const uri = vscode.Uri.parse(
      path.join(__dirname, "../resources/mock/eki_patterns.oud")
    );

    const document = await vscode.workspace.openTextDocument(uri);
    const symbols = provider.provideDocumentSymbols(
      document,
      new vscode.CancellationTokenSource().token
    );

    assert.notEqual(symbols, null);
    assert.equal(symbols[0].range.start.line, 0);
    assert.equal(symbols[0].range.end.line, 83);
    assert.strictEqual(symbols[1].name, "駅パターン");
  });
});
