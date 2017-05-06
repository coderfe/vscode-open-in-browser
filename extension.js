const vscode = require('vscode')
const opn = require('opn')
const platform = require('os').platform()
const defaultBrowser = require('x-default-browser')

const WIN_CHROME = 'chrome'
const OSX_CHROME = 'google chrome'
const LINUX_CHROME = 'google-chrome'
const LINUX_CHROMIUM = 'chromium-browser'

function activate (context) {
  let editor = vscode.window.activeTextEditor
  let doc = editor.document
  const disposable = vscode.commands.registerCommand('extension.openWith', function () {
    let quickPick
    if (platform === 'win32') {  // Windows
      quickPick = [WIN_CHROME, 'firefox', 'iexplore']
    } else if (platform === 'darwin') {  // OS X
      quickPick = [OSX_CHROME, 'firefox']
    } else {  // Linux
      quickPick = ['chromium-browser', LINUX_CHROME, 'firefox']
    }
    vscode.window.showQuickPick(quickPick, { placeHolder: 'Which browser?' }).then((val) => {
      if (val) {
        doc.save()
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
            appName = WIN_CHROME
          } else if (platform === 'darwin') {
            appName = OSX_CHROME
          } else {
            appName = LINUX_CHROME
          }
        } else if (result.commonName === 'chromium') {
          appName = LINUX_CHROMIUM
        }
        doc.save();
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
