//var chalk = require('chalk');
//var error = chalk.bold.green;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/scrapper');

var inquirer = require('inquirer');
var articles = require('./articles');
var journals = require('./journals');
var keywords = require('./keywords');
var authors = require('./authors');

start();

function start() {
  inquirer.prompt([
    {
      type: "list",
      name: "what",
      message: "What would you like to do?",
      choices: [
        "Clean",
        "Scrap",
        "Check",
        "Make stats"
      ]
    }
  ],
    function( answers ) {
      switch (answers.what) {
        case 'Clean':
          clean();
          break;
        case 'Scrap':
          scrap();
          break;
        case 'Check':
          check();
          break;
        case 'Make stats':
          stats();
          break;
        default:
          console.log('Doing not much');
      }
    }
  );
}

function clean() {
  inquirer.prompt([
    {
      type: "list",
      name: "cleaningType",
      message: "What would you like to clean?",
      choices: [
        "Authors",
        "Journals",
        "Keywords",
        "Articles"
      ]
    }
  ],
    function( answers ) {
      switch (answers.cleaningType) {
        case 'Authors':
          console.log('Cleaning Authors');
          break;
        case 'Journals':
          console.log('Cleaning Journals');
          journals.cleanJournals(afterCleaning);
          break;
        case 'Keywords':
          console.log('Cleaning Keywords');
          break;
        case 'Articles':
          cleanArticles();
          break;
        default:
          console.log('Doing not much');
      }
    }
  );
}

function cleanArticles() {
  inquirer.prompt([
    {
      type: "list",
      name: "processed",
      message: "What would you like to set to false?",
      choices: [
        "processedKeywords",
        "processedJournal",
        "processedAuthors"
      ]
    },
    {
      type: "input",
      name: "year",
      message: "What year?",
    }
  ],
    function( answers ) {
      articles.unsetProcessed(answers.year || 2014, answers.processed, afterCleaning);
    }
  );
}


function afterCleaning() {
  console.log('Done cleaning');
  process.exit();
}


function scrap() {
  inquirer.prompt([
    {
      type: "input",
      name: "year",
      message: "What year would like to scrap?",
    },
    {
      type: "input",
      name: "page",
      message: "What page to start at?"
    }
  ],
    function( answers ) {
      articles.scrap(answers.year || 2014, answers.page || 1);
    }
  );
}

function check() {
  inquirer.prompt([
    {
      type: "input",
      name: "year",
      message: "What year would like to check?",
    },
    {
      type: "input",
      name: "page",
      message: "What page to start at?"
    }
  ],
    function( answers ) {
      articles.checkPMIDs(answers.year || 2014, answers.page || 1);
    }
  );
}

function stats() {
  inquirer.prompt([
    {
      type: "list",
      name: "statsType",
      message: "What stats?",
      choices: [
        "Journals stats",
        "Authors stats",
        "Keywords stats"
      ]
    },
    {
      type: "input",
      name: "year",
      message: "What year?",
    }
  ],
    function( answers ) {
      switch (answers.statsType) {
        case 'Journals stats':
          journalStats(answers.year);
          break;
        case 'Authors stats':
          authorsStats(answers.year);
          break;
        case 'Keywords stats':
          keywordsStats();
          break;
        default:
          //journalStats();
          break;

      }
    }
  );
}

function authorsStats(year) {
  inquirer.prompt([
    {
      type: "confirm",
      name: "clean",
      message: "Would you like to clean first?"
    }
  ],
  function (answers) {
    if (answers.clean) {
      authors.cleanAuthorsPerYear(year, function(){
        articles.unsetProcessed(year || 2014, 'processedAuthors', function() {
          authors.unprocessedCount(year || 2014, function(count){
            authors.makeAuthorList(year || 2014, count);
          });
        });
      });
    }
    else {
      authors.unprocessedCount(year, function(count){
        authors.makeAuthorList(year || 2014, count);
      });
    }
  });
}

function journalStats(year) {
  inquirer.prompt([
    {
      type: "confirm",
      name: "clean",
      message: "Would you like to clean first?"
    }
  ],
  function (answers) {
    if (answers.clean) {
      journals.cleanJournalsPerYear(year, function(){
        articles.unsetProcessed(year || 2014, 'processedJournal', function() {
          journals.unprocessedCount(year || 2014, function(count){

            journals.makeJournalList(year || 2014, count);
          });
        });
      });
    }
    else {
      journals.unprocessedCount(year, function(count){
        journals.makeJournalList(year || 2014, count);
      });
    }
  });
}


function keywordsStats()
{
  inquirer.prompt([
    {
      type: "confirm",
      name: "clean",
      message: "Would you like to clean first? (Set all articles unprocessed, drop keywords base and reset count on whitelist)"
    }
  ],
  function (answers) {
    if (answers.clean) {
      articles.unsetProcessed(2014, 'processedKeywords', function() {
        keywords.reset(keywords.makelist);
      });
    }
    else {
      keywords.makelist();
    }
  });
}
