const puppeteer = require("puppeteer");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
let scrape = async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("http://www.orquestraouropreto.com.br/site/noticias/");
  await page.waitForSelector("article");
  let sum = 0;
  let haveNext = false;
  const links = [];
  do {
    haveNext = false;
    const post_sec = await page.$$("article");
    sum += post_sec.length;
    for (const post of post_sec) {
      const url = await post.$eval("a", (b) => b.getAttribute("href"));
      links.push(url);
    }
    const button_next_page = await page.$("#pagination > div.next > a");
    if (button_next_page) {
      await Promise.all([page.waitForNavigation(), button_next_page.click()]);
      haveNext = true;
    }
  } while (haveNext);

  const news = [];
  for (let i = 0; i < links.length; i++) {
    await page.goto(links[i]);
    await page.waitForSelector("div.main-content");
    const content = await page.$("div.main-content");
    const title = await content.$eval("h1", (title) => title.innerText);
    const image = await content.$eval("img", (image) =>
      image.getAttribute("src")
    );
    const content_text = await content.$$eval("div > p", (sub) => {
      return sub.map((s) => s.innerText);
    });

    const author = await content.$eval(
      "#single-below-header > span.meta-author.vcard.author > span > a",
      (author) => author.innerText
    );
    const date = await content.$eval(
      "#single-below-header > span.meta-date.date.updated",
      (date) => {
        const months = [
          "Janeiro",
          "Fevereiro",
          "Março",
          "Abril",
          "Maio",
          "Junho",
          "Julho",
          "Agosto",
          "Setembro",
          "Outubro",
          "Novembro",
          "Dezembro",
        ];
        let d = date.innerText;
        d = d.split(" ");
        d = d.filter((i) => i != "de");
        const day = d[0];
        let month = d[1];
        for (let i = 0; i < months.length; i++) {
          if (month.toUpperCase() === months[i].toUpperCase()) {
            month = i + 1;
            break;
          }
        }
        year = d[2];

        return day + "/" + month + "/" + year;
      }
    );
    const subtitle = content_text[0];
    const text_aux = content_text.filter((t) => t != " " && t != "");
    let text = "";
    for (let i = 1; i < text_aux.length; i++) {
      text += text_aux[i];
      text += "\n";
    }

    let n = {
      title: title,
      photoUrl: image,
      headline: subtitle != "" ? subtitle : " ",
      content: text != "" ? text : " ",
      author: author,
      date: date,
    };
    news.push(n);
  }
  browser.close();
  return news;
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

scrape()
  .then((value) => {
    const csvWriter = createCsvWriter({
      path: "file.csv",
      header: [
        { id: "title", title: "Título" },
        { id: "photoUrl", title: "Imagem" },
        { id: "headline", title: "Subtítulo" },
        { id: "content", title: "Conteúdo" },
        { id: "author", title: "Autor" },
        { id: "date", title: "Data" },
      ],
    });

    csvWriter
      .writeRecords(value) // returns a promise
      .then(() => {
        console.log("...Done");
      });
  })
  .catch((error) => console.log(error));
