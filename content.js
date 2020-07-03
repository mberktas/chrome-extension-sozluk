console.log("Chrome extension go");

// istekleri fetchleri background js e geçir iconu degiştir

window.addEventListener("mouseup", seciliKelime);
window.addEventListener("mousedown", elementKaldir);

let a = document.createElement("turkce-sozluk");
var sonuc, tur, ornekCumle;
let b = a.attachShadow({
  mode: "open",
});

function elementKaldir() {
  if (document.body.appendChild(a)) a.parentNode.removeChild(a);
}

function seciliKelime(event) {
  let secili = window.getSelection().toString().toLowerCase();
  if (secili.trim() != "") {
    var port = chrome.runtime.connect();
    port.postMessage({
      kelime: `${secili}`,
    });
    port.onMessage.addListener((data) => {
      return elementOlustur(event, data.data);
    });
  }
}

function elementOlustur(event, data) {
  let pozisyon = mousePozisyon(event);
  if (!data.hasOwnProperty("error")) {
    sonuc = data[0].anlamlarListe[0].anlam;
    tur = data[0].anlamlarListe[0].ozelliklerListe[0].tam_adi + ":";
    if (data[0].anlamlarListe[0].hasOwnProperty("orneklerListe")) {
      ornekCumle = data[0].anlamlarListe[0].orneklerListe[0].ornek;

      ornekCumle = ornekCumle.replace(
        seciliKelime,
        `<strong><i>${seciliKelime}</i></strong>`
      );
    } else ornekCumle = "";
  } else {
    sonuc = "Kelime bulunamadi...!";
    tur = "";
    ornekCumle = "";
  }
  a.shadowRoot.innerHTML = `
        <style>
        main {
          color: #333;
          font-family: Arial, sans-serif;
          font-size: 14px;
          font-weight: 300;
          letter-spacing: initial;
    
          background: #fcf7d9;
          text-align: left;
          border-style: solid;
          border-width: 1px;
          border-color: #ccc;
          box-shadow: rgba(0,0,0,0.2) 0px 2px 5px;
          border-radius: 5px;
          padding: 6px 8px 3px 8px;
          position: absolute;
          z-index: 2147483649;
          top: ${pozisyon[1]}px;
          left: ${pozisyon[0]}px;
          box-sizing: content-box;
          -webkit-font-smoothing: antialiased;
          font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        strong{
            font-weight: 700;
        }

        p:nth-child(1){
            margin-top: 0px;
        }

        p:nth-child(2){
          margin-top: 3px;
        }
        </style>

        <main>
           <p> 
           <strong>${tur}</strong>
            ${sonuc} </p>
            <p>${ornekCumle != "" ? "<strong>örnek:</strong>" : ""}
            ${ornekCumle}</p>
        </main>

      `;
  document.body.appendChild(a);
}

function mousePozisyon(event) {
  var eventDoc, doc, body;

  event = event || window.event;

  if (event.pageX == null && event.clientX != null) {
    eventDoc = (event.target && event.target.ownerDocument) || document;
    event.pageX = doc = eventDoc.documentElement;
    body = eventDoc.body;

    event.clientX +
      ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
      ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
    event.pageY =
      event.clientY +
      ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
      ((doc && doc.clientTop) || (body && body.clientTop) || 0);
  }

  return [event.pageX, event.pageY];
}
