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
  const disposable = vscode.commands.registerCommand('extension.openWith', () => {
    let quickPick
    if (platform === 'win32') {  // Windows
      quickPick = [
        {label: WIN_CHROME, description: 'Open in Chrome'},
        {label: 'firefox', description: 'Open in Firefox'},
        {label: 'iexplore', description: 'Open in IE'}
      ]
    } else if (platform === 'darwin') {  // OS X
      quickPick = [
        {label: OSX_CHROME, description: 'Open in Chrome'},
        {label: 'firefox', description: 'Open in Firefox'}
      ]
    } else {  // Linux
      quickPick = [
        {label: LINUX_CHROMIUM, description: 'Open in Chromium'},
        {label: LINUX_CHROME, description: 'Open in Chrome'},
        {label: 'firefox', description: 'Open in Firefox'}
      ]
    }
    vscode.window.showQuickPick(quickPick, {
      matchOnDescription: true,
      placeHolder: 'Which browser you want to use?'
    }).then((val) => {
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
