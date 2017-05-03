const vscode = require('vscode')
const opn = require('opn')
const platform = require('os').platform()
const defaultBrowser = require('x-default-browser')

let winChrome = 'chrome'
let osxChrome = 'google chrome'
let linuxChrome = 'google-chrome'
let linuxChromium = 'chromium-browser'

function activate (context) {
  let editor = vscode.window.activeTextEditor
  let doc = editor.document
  const disposable = vscode.commands.registerCommand('extension.openWith', function () {
    let quickPick
    if (platform === 'win32') {  // Windows
      quickPick = [winChrome, 'firefox', 'iexplore']
    } else if (platform === 'darwin') {  // OS X
      quickPick = [osxChrome, 'firefox']
    } else {  // Linux
      quickPick = ['chromium-browser', linuxChrome, 'firefox']
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

    defaultBrowser(function (error, result){
      if(!error) {
        let appName = null;
        if (result.commonName === 'chrome') {
          if (platform === 'win32') {
            appName = winChrome
          } else if (platform === 'darwin') {
            appName = osxChrome
          } else {
            appName = linuxChrome
          }
        } else if (result.commonName === 'chromium') {
          appName = linuxChromium
        }
        opn(doc.fileName, { app: appName })
      }
      else
        opn(doc.fileName)
    })

  })
  context.subscriptions.push(disposableDefault)
}
exports.activate = activate

function deactivate () {}
exports.deactivate = deactivate
