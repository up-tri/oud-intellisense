import * as vscode from "vscode";
import { OuDiaDocumentSymbolProvider } from "./functions/symbol";

export function activate(context: vscode.ExtensionContext) {
  const symbolProvider = vscode.languages.registerDocumentSymbolProvider(
    { scheme: "file", language: "oudia" },
    new OuDiaDocumentSymbolProvider(),
  );
  context.subscriptions.push(symbolProvider);
}

export function deactivate() {}
