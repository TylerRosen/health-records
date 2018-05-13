pragma solidity ^0.4.18;

contract Records{
	struct Contact {
		string patient;
		string medical_issues;
		string medications;
		string allergies;
		string weight;
		string height;
	}

	//keeping track of the next contact id
	uint public nextContactNum; //uint is an alias for uint256. it defaults to 0. the highest it goes up to is 2^256-1

	//data structure that maps one data type to another, generally one maps uint, address or bytes32 to another data structure
	mapping (uint => Contact) contacts;


	function newContact(string _patient, string _medical_issues, string _medications, string _allergies, string _weight, string _height) external returns (uint contactID) {

		require( (bytes(_patient).length <= 50) && (bytes(_medical_issues).length <= 50) && (bytes(_medications).length <= 50) && (bytes(_allergies).length <= 50) && (bytes(_weight).length <= 50) && (bytes(_height).length <= 50));

	    contactID = nextContactNum++; // contactID is return variable

	    // Creates new struct and saves in storage. We leave out the mapping type.
	    contacts[contactID] = Contact(_patient, _medical_issues, _medications, _allergies, _weight, _height);

	    return contactID;
	}

	//external means that this can only be called outside the contract
	//view means that the function accesses state but doesn't change it
	//last argument returns _work_address, _notes, _weight concat'd together to avoid stack too deep error
	function getContact(uint contactID) view external returns (string patient, string _medical_issues, string _medications, string _allergies, string _weight, string _height) {
	    require(contactID < nextContactNum);
	    Contact memory con = contacts[contactID];

	    return (con.patient, con.medical_issues, con.medications, con.allergies, con.weight, con.height);
	}

	function updateContact(uint contactID, string _patient, string _medical_issues, string _medications, string _allergies, string _weight, string _height) external {
		Contact storage con = contacts[contactID];

		con.patient = _patient;
		con.medical_issues = _medical_issues;
		con.medications = _medications;
		con.allergies = _allergies;
		con.weight = _weight;
		con.height = _height;
	}
}