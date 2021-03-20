const fs = require("fs");

const scraperObject = {
    url: 'https://www.beeple-crap.com/everydays',
    async scraper(browser){
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);
        // await page.waitFor(1000);
        await page.waitForTimeout(2000);

        // await page.waitForSelector('._2Td_x');

        // let divNames = ['bDfMI', ]

        // await page.click('div.bDfMI')

        // await page.evaluate(() => { document.querySelector('.bDfMI').click(); });

        const selectAll = await page.$$('.bDfMI');
        console.log("SelectAll length", selectAll.length)

        const imgURLs = [];
        for(var i = 0; i < 14; i++){
          console.log("Looping times i", i)
          // randomize what order we iterate since it gets stuck sometimes for some reason
          let rand = Math.floor(Math.random() * 13);
          console.log("Indexing into rand", rand)
          await selectAll[rand].click();
          await page.waitForTimeout(4000);
          // await autoScroll(page);

          await page.evaluate(async () => {
              await new Promise((resolve, reject) => {
                  var totalHeight = 0;
                  var distance = 100;
                  var timer = setInterval(() => {
                      var scrollHeight = document.body.scrollHeight;
                      window.scrollBy(0, distance);
                      totalHeight += distance;

                      if(totalHeight >= scrollHeight){
                          clearInterval(timer);
                          resolve();
                      }
                  }, 100);
              });
          });

          const rawURLs = await page.$$eval('#pro-gallery-margin-container img', imgs => imgs.map(img => img.src));
          // Rm everything after .jpg here "https://static.wixstatic.com/media/d7f4ba_082d76715a4f4ec09d204bd807090337~mv2.jpg..."
          for(var j in rawURLs){
            imgURLs.push(rawURLs[j].split('.jpg')[0] + '.jpg')
          }
          console.log("IMGurl", imgURLs.length)
        }
        console.log("Done collecting imgURLs, printing to file")

        let r = Math.random().toString(36).substring(7);
        fs.writeFile(`data/imgURLs-${r}.txt`, JSON.stringify(imgURLs), function (err) {
          if (err) throw err;
          console.log("Saved!");
        });

        // should be 205 on first page

    }
}

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

module.exports = scraperObject;

/*
Used https://www.digitalocean.com/community/tutorials/how-to-scrape-a-website-using-node-js-and-puppeteer
*/
