const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports.isLocalPath = function isLocalPath(p) {
  const absolutePath = path.resolve(p);
  try {
    fs.statSync(absolutePath);
    return true; // Path exists
  } catch (error) {
    return false; // Path does not exist
  }
};

module.exports.dependants = async (name) => {
  const url = `https://www.npmjs.com/package/${name}?activeTab=dependents&t=${Date.now()}`;
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  const htmlStr = $("#package-tab-dependents span").html();
  const matches = htmlStr.match(/(?<=<\/svg>\s*)(\S+)(?=\s*Dependents)/);
  if (matches[0]) {
    return parseInt(matches[0].replace(/,/g, ""), 10);
  }
  throw new Error("Dependencies could not be analyzed");
};
