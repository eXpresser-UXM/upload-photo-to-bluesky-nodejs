# Getting Started

* Rename `local.settings.sample.json` to `local.settings.json`.
* Modify each item in `local.settings.json` with your own information.
* Install Node.js 18.
* Install [Visual Studio Code](https://code.visualstudio.com/).
* Install [Azure Functions Extensions for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools).
* Install the [Azure Functions Core Tools v4](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-javascript#install-the-azure-functions-core-tools).
* Open this folder with Visual Studio Code.
* Press F5 Button.
* When the following message is displayed in the terminal, please access http://localhost:7071/api/postPhotoImmediately.
```
  [2024-02-25T07:50:28.096Z] For help, see: https://nodejs.org/en/docs/inspector
  [2024-02-25T07:50:28.185Z] Worker process started and initialized.
  [2024-02-25T07:50:28.251Z] Debugger attached.

  Functions:

        postPhotoImmediately: [GET,POST] http://localhost:7071/api/postPhotoImmediately

        postPhotoDaily: timerTrigger
        
  For detailed output, run func with --verbose flag.
```