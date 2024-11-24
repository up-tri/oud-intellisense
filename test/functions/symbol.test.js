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
    assert.equal(symbols.length, 2, "symbols.length");
    assert.equal(symbols[0].range.start.line, 0, "symbols[0].range.start.line");
    assert.equal(symbols[0].range.end.line, 0, "symbols[0].range.end.line");
    assert.strictEqual(symbols[0].name, "FileType", "symbols[0].name");
    assert.equal(symbols[1].range.start.line, 1, "symbols[1].range.start.line");
    assert.equal(symbols[1].range.end.line, 60, "symbols[1].range.end.line");
    assert.strictEqual(symbols[1].name, "Rosen", "symbols[1].name");
  });
});
