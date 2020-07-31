import { readFileSync } from "fs"

const hookContent = readFileSync(__dirname + "/hookContent.js", "utf-8");

window.addEventListener('message', ev => {
  if (ev.source !== window || !ev.data) {
    return;
  }

  if (ev.data.type === '__POSTWOMAN_EXTENSION_REQUEST__') {
    chrome.runtime.sendMessage({
      messageType: "send-req",
      data: ev.data.config
    }, (message) => {
      if (message.data.error) {
        window.postMessage({
          type: '__POSTWOMAN_EXTENSION_ERROR__',
          error: message.data.error
        }, '*');
      } else {
        window.postMessage({
          type: '__POSTWOMAN_EXTENSION_RESPONSE__',
          response: message.data.response,
          isBinary: message.data.isBinary
        }, '*');
      }
    })
  } else if (ev.data.type === '__POSTWOMAN_EXTENSION_CANCEL__') {
    chrome.runtime.sendMessage({
      messageType: "cancel-req"
    });
  }
});

const VERSION = { major: 0, minor: 15 };

const script = document.createElement('script');
script.textContent = hookContent;

document.documentElement.appendChild(script);
script.parentNode.removeChild(script);

console.log(`Connected to Postwoman Browser Extension v${VERSION.major}.${VERSION.minor}`);
