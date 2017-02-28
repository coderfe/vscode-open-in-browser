const vscode = require('vscode')
const opn = require('opn')
const platform = require('os').platform()

function activate (context) {
  const disposable = vscode.commands.registerCommand('extension.openWith', function () {
    let editor = vscode.window.activeTextEditor
    let doc = editor.document
    let quickPick
    if (platform === 'win32') {
      quickPick = ['chrome', 'firefox', 'iexplore']
    } else {
      quickPick = ['google-chrome', 'firefox']
    }
    vscode.window.showQuickPick(quickPick, { placeHolder: 'Which browser?' }).then((val) => {
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
