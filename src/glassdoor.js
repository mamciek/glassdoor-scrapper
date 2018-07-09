const logger = require('./logger.js')
const fs = require('fs')

const login = async (page, credentials) => {
  logger.info(`Logging in user: ${credentials.username}`)
  await page.goto('https://www.glassdoor.com/profile/login_input.htm')

  await page.type('input[name=username]', credentials.username)
  await page.type('input[name=password]', credentials.password)

  await page.click('div.emailSignInForm > form > button')

  await page.waitForNavigation()
}

const collectCompanies = async (page, companies, pageLimit = 0, pageIndex = 1) => {
  const count = await page.evaluate(async () => {
    return document.body.querySelectorAll('.count')[0].innerText
  })
  logger.info(`Collecting companies - page ${pageIndex}. ${count}`)

  const partResult = await page.evaluate(async () => {
    const cs = [...document.querySelectorAll('a.tightAll.h2')]
    return cs.map(c => {
      return {
        name: c.innerText,
        url: c.href }
    })
  })
  const allCompanies = companies.concat(partResult)

  const disabled = await page.$('#FooterPageNav > div > ul > li.next > span.disabled')
  if (disabled != null) {
    return allCompanies
  }
  const next = await page.$('#FooterPageNav > div > ul > li.next > a')

  const navProm = page.waitForNavigation()
  await next.click()
  await navProm

  if (pageLimit > 0 && pageIndex >= pageLimit) { return allCompanies }
  return collectCompanies(page, allCompanies, pageLimit, pageIndex + 1)
}

const doSearch = async (page, credentials, searchString) => {
  await page.goto('https://www.glassdoor.com/Reviews/index.htm', {waitFor: 'networkidle2'})
  await page.waitFor(3000)
  const elementHandle = await page.$('input#LocationSearch')
  await elementHandle.click()
  await elementHandle.focus()
  // click three times to select all
  await elementHandle.click({clickCount: 3})
  await elementHandle.press('Backspace')
  await elementHandle.type(searchString)
  await page.click('#HeroSearchButton')
  return page.waitForNavigation()
}

const search = async (browser, credentials, searchString, outfile) => {
  const page = await browser.newPage()
  await page.setViewport({width: 1024, height: 768})

  await login(page, credentials)

  logger.info(`Searching reviews for: ${searchString}`)
  await doSearch(page, searchString)
  await doSearch(page, searchString)

  const companies = await collectCompanies(page, [], 4)
  const json = JSON.stringify(companies, null, 2)
  fs.writeFile(outfile, json, 'utf8', function (err) {
    if (err) {
      logger.error(err)
    }
  })
}

module.exports = {
  search
}
