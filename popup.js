let anlam = document.getElementById("content");
let kelime = document.getElementById("word");
let eskiKelime = "";
setInterval(() => {
  if (kelime.value != eskiKelime) {
    eskiKelime = kelime.value;
    var port = chrome.runtime.connect();
    console.log(kelime.value);
    port.postMessage({
      kelime: `${kelime.value}`,
    });
    port.onMessage.addListener((data) => {
      if (Object.keys(data.data)[0] != "error") {
        anlam.innerHTML = data.data[0].anlamlarListe[0].anlam;
      } else {
        anlam.innerHTML = "Sonuc Bulunamadi.";
      }
    });
  }
}, 1000);
