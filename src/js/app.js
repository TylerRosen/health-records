var patient = $('#patient');
var medical_issues = $('#medical_issues');
var medications = $('#medications');
var allergies = $('#allergies');
var weight = $('#weight');
var height = $('#height');
var contact_id = $('#contact_id');

var update_patient = $('#update_patient');
var update_medical_issues = $('#update_medical_issues');
var update_medications = $('#update_medications');
var update_allergies = $('#update_allergies');
var update_weight = $('#update_weight');
var update_height = $('#update_height');
var update_contact_id = $('#update_contact_id');

function addTransactionToDOM(ob, transactionsDiv){
  //start a virtual unordered list (list with bullets - no numbers)
  var ul = $('<ul>');

  //the tx is in a key in ob, so we get to it directly
  var firstLi = $('<li>');
  var txTerm = $('<span>').html('<strong>tx</strong>').addClass('right-margin-5');
  var txVal = $('<span>').html(ob.tx);
  firstLi.append(txTerm);
  firstLi.append(txVal);

  ul.append(firstLi);

  //the rest of the data are grand childs of ob in ob.receipt

  var li, term, val;

  for (key in ob.receipt){
    li = $('<li>');
    term = $('<span>').html(`<strong>${key}</strong>`).addClass('right-margin-5');
    val = $('<span>').html(ob.receipt[key]);

    li.append(term)
    li.append(val);

    ul.append(li);
  }

  //we add the virtual unordered list onto the html
  transactionsDiv.append(ul);
}

App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Records.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var RecordsArtifact = data;
      App.contracts.Records = TruffleContract(RecordsArtifact);

      // Set the provider for our contract.
      App.contracts.Records.setProvider(App.web3Provider);
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#submitContact', App.createContact);
    $(document).on('click', '#getContact', App.getContact);
    $(document).on('click', '#updateContact', App.updateCon);
    $(document).on('click', '#grabNum', App.grabNum);
    $(document).on('click', '#updateNum', App.updateNum);
  },

  createContact: function(event) {
    event.preventDefault();

    var RecordsInstance;

    App.contracts.Records.deployed().then(function(instance) {
      RecordsInstance = instance;
      
      return RecordsInstance.newContact(patient.val(), medical_issues.val(), medications.val(), allergies.val(), weight.val(), height.val());

    }).then(function(result) {
      //reference the div with an id of transactions from the html
      var transactionsDiv = $('#transactions');

      transactionsDiv.html("");

      //add a header to the div
      transactionsDiv.append($('<h2>').text('Your Transactions'));

      //add a hr to the div
      transactionsDiv.append($('<hr>'));

      addTransactionToDOM(result, transactionsDiv);

    }).catch(function(err) {
      $('#errors').addClass('bad').text(err.toString());
    });
  },
  updateCon: function(event) {
    event.preventDefault();

    var RecordsInstance;

    App.contracts.Records.deployed().then(function(instance) {
      RecordsInstance = instance;

      return RecordsInstance.updateContact(update_contact_id.val(), update_patient.val(), update_medications.val(), update_allergies.val(), update_weight.val(), update_height.val());

    }).then(function(result) {
      //reference the div with an id of transactions from the html
      var transactionsDiv = $('#updateTransactions');

      transactionsDiv.html("");

      //add a header to the div
      transactionsDiv.append($('<h2>').text('Your Transactions'));

      //add a hr to the div
      transactionsDiv.append($('<hr>'));

      addTransactionToDOM(result, transactionsDiv);

    }).catch(function(err) {
      $('#errors').addClass('bad').text(err.toString());
    });

  },
  getContact: function(event) {
    event.preventDefault();

    var RecordsInstance;

    App.contracts.Records.deployed().then(function(instance) {
      RecordsInstance = instance;

      return RecordsInstance.getContact(contact_id.val());

    }).then(function(result) {
      
      var res = result.toString();

      $('#contact').text(res);

    }).catch(function(err) {
      console.log(err.message);
    });
  },
  grabNum: function(event){
    event.preventDefault(); 

    var RecordsInstance;

    App.contracts.Records.deployed().then(function(instance) {
      RecordsInstance = instance;

      return RecordsInstance.a();

    }).then(function(result) {
      
      var res = result.toString();
      $('#displayNum').text(res);

    }).catch(function(err) {
      console.log(err.message);
    });
  },
  updateNum: function(event){
    event.preventDefault();

    var RecordsInstance;

    App.contracts.Records.deployed().then(function(instance) {
      RecordsInstance = instance;

      return RecordsInstance.addToNum();

    }).then(function(result) {
      
      $('#displayNum').text('it was updated');

    }).catch(function(err) {
      console.log(err.message);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
