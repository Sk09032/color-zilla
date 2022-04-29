const colorBtn = document.querySelector(".chooseColorBtn");
const colorPreview = document.querySelector(".colorPreview");
const colorHexcode = document.querySelector(".colorHexcode");

colorBtn.addEventListener("click", async () => {


  chrome.storage.sync.get("color", ({ color }) => {
    console.log("color:", color);
  });

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: chooseColor,
    },
    async (injectionResults) => {
      const [data] = injectionResults;
      if (data.result) {
        const color = data.result.sRGBHex;
        colorPreview.style.backgroundColor = color;
        colorHexcode.innerText = data.result.sRGBHex;
        try {
          await navigator.clipboard.writeText(color);
        } catch (err) {
          console.log(err);
        }
      }
    }
  );
});

async function chooseColor() {
  try {
    const eyeDropper = new EyeDropper();
    return await eyeDropper.open();
  } catch (err) {
    console.error(err);
  }
}
