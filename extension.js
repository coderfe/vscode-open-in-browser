const vscode = require('vscode')
const opn = require('opn')

function activate (context) {
  const disposable = vscode.commands.registerCommand('extension.openWith', function () {
    let editor = vscode.window.activeTextEditor
    let doc = editor.document
    vscode.window.showQuickPick(['chrome', 'firefox'], { placeHolder: 'Which app?' }).then((val) => {
      if (val) {
        opn(doc.fileName, { app: val })
      } else {
        return
      }
    })
  })
  context.subscriptions.push(disposable)
}
exports.activate = activate

function deactivate () {}
exports.deactivate = deactivate
