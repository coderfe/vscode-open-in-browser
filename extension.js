const vscode = require('vscode')
const opn = require('opn')
const platform = require('os').platform()

function activate (context) {
  let editor = vscode.window.activeTextEditor
  let doc = editor.document
  const disposable = vscode.commands.registerCommand('extension.openWith', function () {
    let quickPick
    if (platform === 'win32') {  // Windows
      quickPick = ['chrome', 'firefox', 'iexplore']
    } else if (platform === 'darwin') {  // OS X
      quickPick = ['google chrome', 'firefox']
    } else {  // Linux
      quickPick = ['chromium-browser', 'google-chrome', 'firefox']
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

  const disposableDefault = vscode.commands.registerCommand('extension.openWithDefault', () => {
    opn(doc.fileName)
  })
  context.subscriptions.push(disposableDefault)
}
exports.activate = activate

function deactivate () {}
exports.deactivate = deactivate
