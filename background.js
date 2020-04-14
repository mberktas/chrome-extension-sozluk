chrome.runtime.onConnect.addListener(
    (port) => {

        port.onMessage.addListener((kelime) => {
            console.log(kelime.kelime);
            let url = "https://sozluk.gov.tr/gts?ara=" + kelime.kelime;
              fetch(url, {
                method: "post",
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
              })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    console.log(data);
                    port.postMessage({data : data});
                })
        
        })
    });

