// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "mark-greek-and-hebrew" is now active!');

	let replaceDisposable = vscode.commands.registerCommand('mark-greek-and-hebrew.markGreekAndHebrew', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active text editor!');
			return;
		}

		// 获取用户输入的正则表达式和替换字符串
		const greekPattern = "[\\u0370-\\u03ff\\u1f00-\\u1fff]+";
		const hebrewPattern = "[\\u0590-\\u05FF\\uFB2A-\\uFB4E]+";

		const greekRegex = new RegExp(greekPattern, 'g'); // 全局匹配
		const hebrewRegex = new RegExp(hebrewPattern, 'g'); // 全局匹配

		editor.edit(editBuilder => {
			if (editor.selection.isEmpty) {
				// 如果没有选中任何内容，替换整个文档
				const fullText = editor.document.getText();
				const replacedText = fullText.replace(greekRegex, `<mark class="greek">$&</mark>`).replace(hebrewRegex, `<mark class="hebrew">$&</mark>`);
				const fullRange = new vscode.Range(
					editor.document.positionAt(0),
					editor.document.positionAt(fullText.length)
				);
				editBuilder.replace(fullRange, replacedText);
			} else {
				// 如果有选中内容，仅替换选中文本
				editor.selections.forEach(selection => {
					const selectedText = editor.document.getText(selection);
					const replacedText = selectedText.replace(greekRegex, `<mark class="greek">$&</mark>`).replace(hebrewRegex, `<mark class="hebrew">$&</mark>`);
					editBuilder.replace(selection, replacedText);
				});
			}
		}).then(success => {
			if (success) {
				vscode.window.showInformationMessage('Text replaced successfully!');
			} else {
				vscode.window.showErrorMessage('Failed to replace text!');
			}
		});
	});

	context.subscriptions.push(replaceDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
