const vscode = require('vscode');
const opn = require('opn');
const platform = require('os').platform();
const defaultBrowser = require('x-default-browser');

const WIN_CHROME = 'chrome';
const OSX_CHROME = 'google chrome';
const LINUX_CHROME = 'google-chrome';
const LINUX_CHROMIUM = 'chromium-browser';


function activate(context) {

  // use any browser
  const disposable = vscode.commands.registerCommand('extension.openWith', () => {
    let editor = vscode.window.activeTextEditor;
    let doc = editor.document;

    vscode.window.showQuickPick(getQuickPick(), {
      matchOnDescription: true,
      placeHolder: 'Which browser you want to use?'
    }).then((val) => {
      if (val) {
        doc.save();
        opn(doc.fileName, { app: val });
      } else {
        return;
      }
    });
  });
  context.subscriptions.push(disposable);

  // use default browser
  const disposableDefault = vscode.commands.registerCommand('extension.openWithDefault', () => {
    let editor = vscode.window.activeTextEditor;
    let doc = editor.document;

    defaultBrowser(function (error, result) {
      if (!error) {
        let appName = null;
        if (result.commonName === 'chrome') {
          if (platform === 'win32') {
            appName = WIN_CHROME;
          } else if (platform === 'darwin') {
            appName = OSX_CHROME;
          } else {
            appName = LINUX_CHROME;
          }
        } else if (result.commonName === 'chromium') {
          appName = LINUX_CHROMIUM;
        }
        doc.save();
        opn(doc.fileName, { app: appName });
      }
      else {
        opn(doc.fileName);
      }
    });
  });
  context.subscriptions.push(disposableDefault)
}


function getQuickPick() {
  let quickPick = [];
  if (platform === 'win32') {  // Windows
    quickPick = [
      WIN_CHROME,
      'firefox',
      'iexplore'
    ];
  } else if (platform === 'darwin') {  // OS X
    quickPick = [
     OSX_CHROME,
     'firefox'
    ];
  } else {  // Linux
    quickPick = [
     LINUX_CHROMIUM,
     LINUX_CHROME,
     'firefox'
    ];
  }
  return quickPick;
};



exports.activate = activate;

function deactivate() { };
exports.deactivate = deactivate;
