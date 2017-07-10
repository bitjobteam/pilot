"use strict";

var proposalHash, totalVotes, proposal, totalPro, totalAgainst, proposalID, beneficiary, etherAmount, jobDescription, userAccount, supportsProposal, proposalNumber, yea, nay, quorum, proposalPassed, canVote, firstName, lastName, userID, minimumSharesToPassAVote, minutesForDebate, nominatedAddress, sender, voteIndex, status, minimumMembers, numOfTokens, actionButton, proposalTitle, proposalDescription, buyer, creator, dateProposlaEntered, tokenAmountForProject, amountSpent, refernce;


var addr;



var startingBlock = 1800000;
var Web3;
var web3;
var logedIn = false;
var message;
var gasAmount;
var gasPrice;
var currAccount;
var supportEmail;
var token;
var eventsMinDistance = 50;
var timelines;
var memberContrat;
var memberHandle;
var ledgerHandle;
var ldHandle;
var singleTokenCost = 1000000000000000;
var valueIinFIAT;
var exchangeFIAT;
var totalTokens;
var tokenBalance;
var votingPower;
var ownedPercentage;
var accountBalance;



function init() {

    var proposal,
        mode,
        newProposalInput,
        newRegistration,
        newProposalButton,
        loginButton,
        newRegistrationButton,
        rulesChangeButton,
        investButton;


    currAccount = getCookie("account");


    $("#title-brand").text(organizationName);
    $("#page-title").text(organizationName);
    $("#logo-title-link").html('<a href="http://' + domainLink + '" class="simple-text"> <img style="width:160px" src="../dist/img/bitJobwhitelogo.png"  alt="BitJob">  </a>');
    $("#logo-mini-link").html('<a href="http://' + domainLink + '" class="simple-text">' + organizationName + ' </a>');
    $("#copyright").html("<a href='" + domainLink + "'>" + organizationName + "<Ledger></Ledger></a>")





    // mode = decodeURI(getParameterByName('mode'));
    //document.getElementById('proposal').textContent = proposal;

    if (getCookie("emailAddress") != "") {
        //$("#menu-signup").html( "<span class='glyphicon glyphicon-user'></span> " + getCookie("firstName") + " " + getCookie("lastName") );
        $("#user-drop-down").prepend(getCookie("firstName") + " " + getCookie("lastName"));

        $("#menu-signup").hide();
        $("#menu-login").hide();
        $("#menu-signup").css("background-color", "lightgreen");
    }

    /*
    if (addr.length === 42 && addr.includes("0x", 0)) {
		logedIn = true;
		enableMenuAll();
	} */






    // Checks Web3 support
    if (typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
        // If there's a web3 library loaded, then make your own web3
        web3 = new Web3(web3.currentProvider);
    } else if (typeof Web3 !== 'undefined') {
        // If there isn't then set a provider
        //var Method = require('./web3/methods/personal');
        web3 = new Web3(new Web3.providers.HttpProvider(connectionString));

        if (!web3.isConnected()) {

            $("#alert-danger-span").text(" Problem with connection to the newtwork. Please contact " + supportEmail + " abut it. ");
            $("#alert-danger").show();
            return;
        }
    } else if (typeof web3 == 'undefined' && typeof Web3 == 'undefined') {

        Web3 = require('web3');
        web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider(onnectionString));
    }









    memberContrat = web3.eth.contract(ldABI);
    memberHandle = memberContrat.at(ldAddress);


    var ledgerContract = web3.eth.contract(ldABI);
    ledgerHandle = ledgerContract.at(ldAddress);

    var ldContradct = web3.eth.contract(ldABI);
    ldHandle = ldContradct.at(ldAddress);

    gasPrice = web3.eth.gasPrice;
    gasAmount = 4000000;

    var etherTokenContract = web3.eth.contract(toeknContractABI);
    token = etherTokenContract.at(tokenContractAddress);



    viewAbout();
    checkBalance();
    enableMenu();



    // renderFrontPage();
    // watchevents();


    //       $("#includedContent").load("investment.html"); 


    //printTransaction("0xf28b5331e2171f50dfb25d18a5cb0de7cfc5f67f8c8f5943de7eb2ecb468e25d");

}


function printTransaction(txHash) {
    var tx = web3.eth.getTransaction(txHash);
    if (tx != null) {
        console.log("  tx hash          : " + tx.hash + "\n"
            + "   nonce           : " + tx.nonce + "\n"
            + "   blockHash       : " + tx.blockHash + "\n"
            + "   blockNumber     : " + tx.blockNumber + "\n"
            + "   transactionIndex: " + tx.transactionIndex + "\n"
            + "   from            : " + tx.from + "\n"
            + "   to              : " + tx.to + "\n"
            + "   value           : " + tx.value + "\n"
            + "   gasPrice        : " + tx.gasPrice + "\n"
            + "   gas             : " + tx.gas + "\n"
            + "   input           : " + tx.input);
    }
}

function renderPage() {


    if (window.location.href.indexOf("wallet.html") > 0) renderWallet();
    else if (window.location.href.indexOf("adminStats.html") > 0) renderAdmin();
    else if (window.location.href.indexOf("adminMembers.html") > 0) renderMembers();
    else if (window.location.href.indexOf("myProfile.html") > 0) renderProfile();
    else if (window.location.href.indexOf("proposals.html") > 0) renderProposals();
    else if (window.location.href.indexOf("adminProposals.html") > 0) renderAdminProposals();
    else if (window.location.href.indexOf("projectsVoting.html") > 0) renderProjects("voting");
    else if (window.location.href.indexOf("projectsFunded.htm") > 0) renderProjects("funded");
    else if (window.location.href.indexOf("delegations.htm") > 0) renderMembers("delegate");
    else if (window.location.href.indexOf("index.html?ref=true") > 0) $("#modal-register").modal();
    else if (window.location.href.indexOf("mining.html") > 0) listReferrals();
    else if (window.location.href.indexOf("funding.html") > 0) renderFunding();





}



function renderFunding() {

    getInvestmentProjects(getCookie("account"));

}

function renderAdminProposals() {

    getInvestmentProjects();

}


function renderProfile() {



    var profileTable = "<tr><td>Ethereum address</td>" +
        "<td style='text-align:right'>" + getCookie("account") + "</td></tr>" +
        "<tr><td>First Name</td>" +
        "<td style='text-align:right'>" + getCookie("firstName") + "</td></tr>" +
        "<tr><td>Last Name</td>" +
        "<td style='text-align:right'>" + getCookie("lastName") + "</td></tr>" +
        "<tr><td>Email Address</td>" +
        "<td style='text-align:right'>" + getCookie("emailAddress") + "</td></tr>" +
        "<tr><td>Can Vote</td>" +
        "<td style='text-align:right'>" + getCookie("canvote") + "</td></tr>" +
        "<tr><td>Delegated Votes</td>" +
        "<td style='text-align:right'>" + getCookie("delegated") + "</td></tr>"


    $("#profile-table").append(profileTable);


}

function renderAdmin() {


    totalTokens = ledgerHandle.tokensInCirculation();
    var totalProposals = ldHandle.numProposals();
    var totalAllocatedTokens = ledgerHandle.totalLockedToken();
    var tokenPrice = ledgerHandle.singleTokenCost();
    var tokenPriceETH = tokenPrice / 1000000000000000000;
    var totalEth = Math.round(ledgerHandle.tokensInCirculation() / 1000);
    var totalEthAllocated = Math.round(totalAllocatedTokens / 1000);
    var totalMembers = memberHandle.numMembers();
    var memberWithTokens = 5; //to be implemented
    var blockedMembers = 1; // to be implemented
    var newMembers = 1; // to be implemented
    var totalProjects = 10; //to be implemented
    var projectAwaitingFunding = 3; // to be implemented
    var projectFundedNotCompleted = 4; // to be completed
    var projectsCompleted = 3; // to be completed

    var ideaProposals = 4; //to be implementd
    var projectProposals = 6; // to be implemnted
    var executedProposals = 4; // to be implemented


    var minimumQuorum = ldHandle.minimumQuorum({ from: adminAccount });
    var debatingPeriodInMinutes = ldHandle.debatingPeriodInMinutes({ from: adminAccount });
    var profits = ledgerHandle.calculateTotalRewards();



    var tokenTable = "<tr><td>Tokens in circulation</td>" +
        "<td style='text-align:right'>" + formatNumber(totalTokens) + "</td></tr>" +
        "<tr><td>Tokens allocated</td>" +
        "<td style='text-align:right'>" + formatNumber(totalAllocatedTokens) + "</td></tr>" +
        "<tr><td>Total value of Ether</td>" +
        "<td style='text-align:right'>" + totalEth.formatMoney(2, '.', ',') + "</td></tr>" +
        "<tr><td>Ether allocated</td>" +
        "<td style='text-align:right'>" + totalEthAllocated.formatMoney(2, '.', ',') + "</td></tr>" +
        "<tr><td>Profits to date</td>" +
        "<td style='text-align:right'>" + formatNumber(profits[0]) + "</td></tr>" +
        "<tr><td>Profits pending</td>" +
        "<td style='text-align:right'>" + formatNumber(profits[1]) + "</td></tr>";

    var memberTable = "<tr><td>Total members</td>" +
        "<td style='text-align:right'>" + totalMembers + "</td></tr>" +
        "<tr><td>Members with tokens</td>" +
        "<td style='text-align:right'>" + memberWithTokens + "</td></tr>" +
        "<tr><td>Blocked members</td>" +
        "<td style='text-align:right'>" + blockedMembers + "</td></tr>" +
        "<tr><td>New Members</td>" +
        "<td style='text-align:right'>" + newMembers + "</td></tr>"


    var proposalTable = "<tr><td>Total proposals</td>" +
        "<td style='text-align:right'>" + totalProposals + "</td></tr>" +
        "<tr><td>Idea proposals</td>" +
        "<td style='text-align:right'>" + ideaProposals + "</td></tr>" +
        "<tr><td>Project proposals</td>" +
        "<td style='text-align:right'>" + projectProposals + "</td></tr>" +
        "<tr><td>Executed proposals</td>" +
        "<td style='text-align:right'>" + executedProposals + "</td></tr>"

    var projectTable = "<tr><td>Total Projects</td>" +
        "<td style='text-align:right'>" + totalProjects + "</td></tr>" +
        "<tr><td>Projects awaiting funding</td>" +
        "<td style='text-align:right'>" + projectAwaitingFunding + "</td></tr>" +
        "<tr><td>Funded not completed</td>" +
        "<td style='text-align:right'>" + projectFundedNotCompleted + "</td></tr>" +
        "<tr><td>Completed Projects</td>" +
        "<td style='text-align:right'>" + projectsCompleted + "</td></tr>"


    var votingRulesTable = "<tr><td>Quorum</td>" +
        "<td style='text-align:right'>" + minimumQuorum + "</td></tr>" +
        "<tr><td>Debating periods (min)</td>" +
        "<td style='text-align:right'>" + debatingPeriodInMinutes + "</td></tr>"


    $("#token-table").append(tokenTable);
    $("#member-table").append(memberTable);
    $("#proposal-table").append(proposalTable);
    $("#project-table").append(projectTable);
    $("#voting-rules-table").append(votingRulesTable);

}

function renderProposals() {

    listProposals();

}

function renderMembers(flag) {

    if (getCookie("delegated") == 1) {
        $("#delegation-note").text("Click this button to withdraw delgation of your vote from the member which you delegated it to before.");
    } else {
        $("#withdraw-delegation").attr('disabled', 'disabled');
        $("#delegation-note").text("You are currently not delegating your votes.");
    }
    listMembers(flag);

}

function listReferrals() {



    var numOfReferrals = 0;
    var totalTokenEarned = 0;
    var totalTokenClaimed = 0;
    var totalTokenUnclaimed = 0;

    setTimeout(function () {
        var numMembers = memberHandle.numMembers();

        var htmlString = "<div class='table-responsive'><table  class='table  table-hover' style ='width: 90%;' id='responstable' align='center'>" +
            "<tr>" +
            "<th>User Name</th>" +
            "<th>Date Joined</th>" +
            "<th>Ethereum address</th>" +
            "<th>User ID</th>" +
            "<th>Tokens Amt</th>" +
            "<th>Ether Value</th>" +
            "</tr>"

        for (var i = numMembers - 1; i >= 0; i -= 1) {
            var member = memberHandle.members(i);
            if (member[9] == getCookie("account") && member[0] != getCookie("account")) {

                numOfReferrals++;

                // voteStrength = ldHandle.voteWeight(member[0])
                var tokenBalance = token.balanceOf(member[0]);
                var firstLastName = member[3] + "+" + member[4]
                var tokenPrice = ledgerHandle.singleTokenCost();

                var tokenPriceETH = tokenPrice / 1000000000000000000;
                var totalEthValue = tokenPriceETH * tokenBalance;


                htmlString += "<tr>" +
                    "<td style='text-align:left'>" + member[3] + " " + member[4] + " </td>" +
                    "<td style='text-align:left'>" + convertTimestamp(member[2]) + "</td>" +
                    "<td>" + member[0] + "</td>" +
                    "<td>" + member[5] + "</td>" +
                    "<td style='text-align:center'>" + formatNumber(tokenBalance) + "</td>" +
                    "<td style='text-align:center'>" + formatNumber(totalEthValue) + "</td>" +
                    "</tr>"



            }


        }
        htmlString += "</table></div>";
        $("#list-text").text("Members list");
        $("#referral-list").html(htmlString);

        var htmlString = "<div class='table-responsive'><table  class='table  table-hover' style ='width: 90%;' id='responstable' align='center'>" +
            "<tr>" +
            "<th>Ethereum address</th>" +
            "<th>Referral type</th>" +
            "<th style='text-align:right'>Tokens earned</th>" +
            "<th style='text-align:right'>Tokens paid</th>" +
            "</tr>"

        for (var i = 0; i < numOfReferrals; i++) {
            var references = memberHandle.returnReferrals(getCookie("account"), i);
            var referenceAllocatedTokens = ledgerHandle.returnAllocatedTokensForMember(references[0])

            totalTokenEarned += Number(referenceAllocatedTokens);
            totalTokenClaimed += Number(references[3]);

            totalTokenUnclaimed += referenceAllocatedTokens - references[3];




            htmlString += "<tr>" +
                "<td style='text-align:left'>" + references[0] + " </td>" +
                "<td style='text-align:center'>" + references[1] + "</td>" +
                "<td style='text-align:right'>" + formatNumber(referenceAllocatedTokens) + "</td>" +
                "<td style='text-align:right'>" + formatNumber(references[3]) + "</td>" +
                "</tr>"

        }


        htmlString += "</table></div>";

        $("#total-earned").text("Total earned:" + formatNumber(totalTokenEarned));
        $("#total-claimed").text("Total Claimed:" + formatNumber(totalTokenClaimed));
        $("#total-unclaimed").text("Total Unclaimed:" + formatNumber(totalTokenUnclaimed));


        $("#mining-rewards").html(htmlString);


    }, 3);


    if (totalTokenUnclaimed == 0) {


        swal({
            title: 'Good News',
            html: $('<div>')
                .addClass('some-class')
                .text('You have unclaimed tokens. Click button "Claim Mining Rewards" to get ' + '424,058' + ' tokens.'),
            animation: false,
            customClass: 'animated tada'
        })
    }

}


function changeTokenParms() {

    var minimumSharesToPassVote,
        minutesForDebate,
        minMembers, TokenPrice, startDate, endDate;



    if (!handlePassword("modal-change-token-parms", 0)) return;

    var newTokenPrice = document.getElementById("new-token-price").value;
    var newTokenSaleStartDate = document.getElementById("new-token-sale-start-date").value

    if (newTokenSaleStartDate != "")
        newTokenSaleStartDate = convertDateToTimeStamp(newTokenSaleStartDate);

    var newTokenSaleEndtDate = document.getElementById("new-token-sale-end-date").value;
    if (newTokenSaleEndtDate != "")
        newTokenSaleEndtDate = convertDateToTimeStamp(newTokenSaleEndtDate);

    progressActionsBefore();

    setTimeout(function () {

        ldHandle.changeTokenParms(newTokenSaleStartDate, newTokenSaleEndtDate, newTokenPrice, { from: currAccount, gasprice: gasPrice, gas: gasAmount });

        var logTokensParmChange = ldHandle.TokenParmsChange({ start: startDate }, { end: endDate }, { tokenPrice: TokenPrice });

        logTokensParmChange.watch(function (error, res) {
            var message = "New parms successfully applied to tokens.";
            progressActionsAfter(message, true);
        });
    }, 10);

}


function listMembers(action) {

    var htmlString,
        delegated,
        i,
        member,
        memberNumberToDisplay,
        voteStrength,
        htmlString;

    setTimeout(function () {


        var numMembers = memberHandle.numMembers();


        if (numMembers > 0) {
            htmlString = "<div class='table-responsive'><table  class='table  table-hover' style ='width: 90%;' id='responstable' align='center'>" +
                "<tr>" +
                "<th>User Name</th>" +
                "<th>Date Joined</th>" +
                "<th>Can Vote</th>" +
                "<th>User ID</th>" +
                "<th style='text-align:center'>Voting Power</th>" +
                "<th>Delegate Status</th>" +
                "<th style='text-align:center'>Delegate</th>" +
                "<th>Ban/Unban</th>" +
                "<th>Make admin</th>" +
                "<th>Add tokens</th>" +
                "</tr>";
            delegated = getCookie("delegated");

            for (i = numMembers - 1; i >= 0; i -= 1) {
                member = memberHandle.members(i, { from: adminAccount });
                voteStrength = ldHandle.voteWeight(member[0], { from: adminAccount })
                memberNumberToDisplay = i + 1;
                var firstLastName = member[3] + "+" + member[4]

                htmlString += "<tr>" +
                    "<td style='text-align:left'>" + member[3] + " " + member[4] + " </td>" +
                    "<td style='text-align:right'>" + convertTimestamp(member[2]) + "</td>" +
                    "<td>" + member[1] + "</td>" +
                    "<td>" + member[5] + "</td>";


                if (member[6]) {
                    htmlString += "<td align='center'> <font color='red'><B>" + voteStrength + "</B></font></td>";
                    htmlString += "<td align='center'> <font color='red'><B>" + member[6] + "</B></font></td>";

                }
                else {
                    htmlString += "<td align='center'>" + voteStrength + "</td>";
                    htmlString += "<td align='center'>" + member[6] + "</td>";
                }

                if (delegated == 1 || member[0] == currAccount || delegated == "1") {
                    htmlString += '<td align="center"><img style="max-width:42px;" src="../dist/img/no.png" alt="Not allowed" title="Not allowed" align="top" height="42" width="42"></td>';
                } else {
                    htmlString += "<td align='center'> <a class='linkDelegateClass' data-toggle='modal' id='urldelegate" + i + "' href='index.html?mode=d&pn=" + i + "&ui=" + member[5] + "&mi=" + member[0] + "&flname=" + firstLastName + "#myModal' title='Delegate your vote'>"
                        + "<img  style='max-width:42px;' src='../dist/img/delegate.png' alt='Delegate Vote' title='Delegate Vote' align='top'></td>";

                }
                //display icons for blocking and unblocking members
                //show not allowed for non admin
                if (getCookie("admin") == 0 || member[0] == currAccount) {
                    htmlString += '<td align="center"><img style="max-width:42px;" src="../dist/img/no.png" alt="Not allowed" title="Not allowed" align="top" height="42" width="42"></td>';

                } else {

                    if (member[1]) {
                        htmlString += "<td align='center'> <a class='linkbanClass' data-toggle='modal' id='urlban" + i + "' href='index.html?mode=0&pn=" + i + "&mi=" + member[0] + "&action=0&flname=" + firstLastName + "#myModal' title='Block member'>"
                            + "<img style='max-width:42px;' src='../dist/img/allow.png' alt='Block member' title='Block member' align='top' ></td>";
                    }
                    else {
                        htmlString += "<td align='center'> <a class='linkbanClass' data-toggle='modal' id='urlban" + i + "' href='index.html?mode=1&pn=" + i + "&mi=" + member[0] + "&action=1&flname=" + firstLastName + "#myModal' title='Unblock member'>"
                            + "<img  style='max-width:42px;' src='../dist/img/ban.png' alt='Unblock member' title='Unblock member' align='top' ></td>";

                    }
                }

                if (member[8] || getCookie("admin") == 0) {
                    htmlString += '<td align="center"><img style="max-width:42px;" src="../dist/img/no.png" alt="Not allowed" title="Not allowed" align="top" height="42" width="42"></td>';
                }
                else {

                    htmlString += "<td align='center'> <a class='linkAdminClass' data-toggle='modal' id='urladmin" + i + "' href='index.html?mode=admin&pn=" + i + "&mi=" + member[0] + "&flname=" + firstLastName + "#myModal' title='Transfer ownership'>"
                        + "<img style='max-width:42px;' src='../dist/img/admin.png' alt='Transfer ownership' title='Transfer ownership	' align='top'></td>";
                }

                htmlString += "<td align='center'> <a class='linkAdminTokens' data-toggle='modal' id='urladmin" + i + "' href='index.html?mode=admin&pn=" + i + "&mi=" + member[0] + "&flname=" + firstLastName + "#myModal' title='Add more tokens'>"
                    + "<img style='max-width:42px;' src='../dist/img/add.png' alt='Add more tokens' title='Add tokens' align='top'></td></tr>";



            }

            htmlString += "</table></div>";
            $("#list-text").text("Members list");
            $("#member-table").html(htmlString);

            if (action == "delegate") {

                $('#responstable tr > *:nth-child(2)').hide();
                $('#responstable tr > *:nth-child(3)').hide();
                $('#responstable tr > *:nth-child(4)').hide();
                $('#responstable tr > *:nth-child(6)').hide();
                $('#responstable tr > *:nth-child(8)').hide();
                $('#responstable tr > *:nth-child(9)').hide();
                $('#responstable tr > *:nth-child(10)').hide();
            } else if (action == "ban") {

                $('#responstable tr > *:nth-child(6)').hide();
                $('#responstable tr > *:nth-child(7)').hide();
                $('#responstable tr > *:nth-child(9)').hide();

            } else if (action == "transferadmin") {

                $('#responstable tr > *:nth-child(6)').hide();
                $('#responstable tr > *:nth-child(7)').hide();
                $('#responstable tr > *:nth-child(8)').hide();

            } else if (action == "front") {

                $('#responstable tr > *:nth-child(7)').hide();
                $('#responstable tr > *:nth-child(8)').hide();
                $('#responstable tr > *:nth-child(9)').hide();

            }

        }
    }, 3);

}

function listProposals() {


    var numProposals,
        numRegisteredMembers,
        i,
        closedMessage = "";

    setTimeout(function () {

        numProposals = ldHandle.numProposals();
        $("#list-body").html("<BR><i>*Click vote down or vote up icon to vote</i><BR><BR><BR>");

        if (numProposals > 0) {

            var htmlString = "<div class='table-responsive'><table id='proposals' class='table table-hover'  id='responstable' align='center'>" +
                "<tr>" +
                "<th>No.</th>" +
                "<th style='width:30%;'>Proposal title</th>" +
                "<th style='width:30%;'>Proposal Description</th>" +
                "<th ><span  class='glyphicon glyphicon-time'></th>" +
                "<th>Yes</th>" +
                "<th>No</th>" +
                "<th ><span  class='glyphicon glyphicon-info-sign'></th>" +
                "<th ><span  class='glyphicon glyphicon-pencil'></th>" +
                "<th ><span  class='glyphicon glyphicon-stats'></th>" +
                "<th ><span  class='glyphicon glyphicon-education'></th>" +
                "</tr>";

            for (i = numProposals - 1; i >= 0; i -= 1) {
                var result,
                    proposalNumberToDisplay;

                result = ldHandle.proposals(i);
                proposalNumberToDisplay = i + 1;

                htmlString += "<tr>" +
                    "<td>" + proposalNumberToDisplay + " </td>" +
                    "<td style='word-wrap: break-word; white-space:normal;' align='left;' width='30%'>" + result[3] + " </td>" +
                    "<td style='word-wrap: break-word; white-space:normal;' align='left;' width='30%'>" + result[2] + " </td>" +
                    "<td><div  style='float:left; font-size: 10px; color:red;' id='timemessage" + i + "'>&nbsp;</div></td>" +
                    "<td><a data-toggle='modal' id='urlvup" + i + "'   href='index.html?mode=v&pn=" + i + "&up=true#myModal' title='Vote Up' class='linkVoteClass'> <img align = 'top' id='voteup" + i + "' src='../dist/img/voteup.png' alt ='Vote Up' height='40' width='43'></a></td>" +
                    "<td><a data-toggle='modal' id='urlvdown" + i + "' href='index.html?mode=v&pn=" + i + "&up=false#myModal' title='Vote Down' class='linkVoteClass'><img id='votedown" + i + "' src='../dist/img/votedown.png'  alt='Vote down' height='40' width='43'></a> </td>" +
                    "<td><a data-toggle='modal' id='p-info" + i + "'   href='index.html?mode=r&pn=" + i + "#myModal' title='View proposal info' class='linkProposalViewClass'><img src='../dist/img/view.png' height='38' width='38' alt='View' ></a></td>" +
                    "<td><a data-toggle='modal' id='urlsum" + i + "'   href='index.html?mode=s&pn=" + i + "#myModal' title='Sum results' class='linkTallyClass'><img id='sum" + i + "' src='../dist/img/gavel.png' height='38' width='38' alt='Sum results'></a></td>" +
                    "<td id='updown" + i + "'></td>" +
                    "<td id='yesno" + i + "'></td>" +
                    "</tr>"




            }


            htmlString += "</table></div>"

            $("#proposal-table").append(htmlString);


            for (i = numProposals - 1; i >= 0; i -= 1) {

                var result,
                    proposalNumberToDisplay;

                result = ldHandle.proposals(i);
                proposalNumberToDisplay = i + 1;



                // check if voting deadline has passed
                var deadline = result[5];
                var nowInseconds = Date.now() / 1000;

                if (nowInseconds >= deadline) {

                    document.getElementById("sum" + i).style.opacity = "1";
                    document.getElementById("urlsum" + i).style.pointerEvents = "index.html?mode=s&pn=" + i;
                    document.getElementById("voteup" + i).style.opacity = "0.1";
                    document.getElementById("votedown" + i).style.opacity = "0.1";
                    document.getElementById("urlvup" + i).style.pointerEvents = "none";
                    document.getElementById("urlvdown" + i).style.pointerEvents = "none";
                    document.getElementById("timemessage" + i).innerHTML = "CLOSED <BR>for voting"
                } else {
                    var start1 = document.getElementById("timemessage" + i);
                    var tempMessageID = "timemessage" + i;
                    var timeLeft = (deadline - nowInseconds).toString().toHHMMSS();
                    countdown(tempMessageID, timeLeft, deadline);
                }


                // check if proposl can be still voted on
                // make sure that tally button is disabled

                if (deadline - nowInseconds > 0) {

                    document.getElementById("sum" + i).style.opacity = "0.1";
                    document.getElementById("urlsum" + i).style.pointerEvents = "none";
                }

                // check if proposal has been executed
                if (result[6] > 0) {
                    document.getElementById("sum" + i).style.opacity = "0.1";
                    document.getElementById("urlsum" + i).style.pointerEvents = "none";
                    //check if proposal passed
                    if (result[6] == 1) {
                        document.getElementById("updown" + i).innerHTML += "<img src='../dist/img/arrowup.png' title='Proposal passed' height='40' width='43'>";
                        //check how many votes it received
                    } else {
                        document.getElementById("updown" + i).innerHTML += "<img src='../dist/img/arrowdown.png' title='Proposal didn't pass' height='40' width='43'>";
                    }


                    var results = result[9];

                    results = results.replace(/'/g, "\"");
                    var myObj = JSON.parse(results);
                    var votes = myObj.votes;

                    document.getElementById("yesno" + i).innerHTML = votes;
                    document.getElementById("voteup" + i).style.opacity = "0.1";
                    document.getElementById("votedown" + i).style.opacity = "0.1";
                    document.getElementById("urlvup" + i).style.pointerEvents = "none";
                    document.getElementById("urlvdown" + i).style.pointerEvents = "none";
                }
            }
        } else {
            htmlString = "<BR>   No proposals yet <BR>";

            $("#proposal-table").append(htmlString);
        }
    }, 3);
}


function showTimeNotification(from, align, text) {

    var type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];

    var color = Math.floor((Math.random() * 6) + 1);

    $.notify({
        icon: "notifications",
        message: text

    }, {
            type: type[color],
            timer: 30000,
            z_index: 10031,
            placement: {
                from: from,
                align: align
            }
        });
}

function enableMenu() {

    if (currAccount != "") {

        $("#buy-tokens").show();

        $("#sign-out").show();

        if (getCookie("admin") == "1") {
            $("#menu-admin").show();

        }

        if (getCookie("delegated") == "1") {
            $("#cancel-delegation-menu").show();
            $("#delegate-votes-menu").hide();
        }
    }
    else { $("#sidebar-menu").hide(); }
}

function getParameterByName(name, url) {

    if (!url) { url = window.location.href; }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) { return null; }
    if (!results[2]) { return ''; }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function getCookie(cname) {

    var name = cname + "=", ca = document.cookie.split(';'), i, c;

    for (i = 0; i < ca.length; i += 1) {
        c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkBalance() {



    //   $.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD",
    //      function (data, status) {
    //        if (status == "success") {
    //  var myObj = JSON.parse(data);
    // var length = Object(myObj).length;

    //     exchangeFIAT = data.USD;

    exchangeFIAT = 9.88;

    if (currAccount != "") {
        accountBalance = web3.fromWei(web3.eth.getBalance(currAccount), "ether");
        tokenBalance = token.balanceOf(currAccount);
        votingPower = ldHandle.voteWeight(currAccount);
        totalTokens = ledgerHandle.tokensInCirculation();
        valueIinFIAT = exchangeFIAT * accountBalance;
        if (totalTokens == 0) ownedPercentage = 0
        else
            ownedPercentage = tokenBalance * 100 / totalTokens;

        $("#user-name").prepend(getCookie("firstName") + " " + getCookie("lastName"));


        if (accountBalance == 0) {
            $("#noticeModal").modal();
            $("#sidebar-menu").hide();
            $("#your-balance").hide();
        } else {
            $("#balance-ether").hide();
            //   $("#alert-success-span").html("You have " + formatNumber(accountBalance)+ "    Eth in your account.<BR>");
            $("#menu-balance-ether").append((accountBalance * 1).formatMoney(2, '.', ',') + " Eth/" + (valueIinFIAT * 1).formatMoney(2, '.', ',') + " USD");
            $("#menu-balance-ether").show();
            $("#your-balance").show();
        }

        if (tokenBalance == 0) {

            //  showTimeNotification('top','left', "You have 0 balance of tokens. You will be able only to view activity on this site but not participate. Please purchase some tokens <a id='buy-tokens-message'  href='#' >here.</a>")
            //  $("#alert-warning-span").append("You have 0 balance of tokens. You will be able only to view activity on this site but not participate. Please purchase some tokens <a id='buy-tokens-message'  href='#' >here.</a>");

            $("#noticeModal").modal();
            $("#alert-warning").show();
            $("#sidebar-menu").hide();
        } else {
            //  $("#alert-success-span").append("You have " + tokenBalance + " tokens in your account</span>");
            $("#menu-voting-power").append("<span title='Your voting power'>" + formatNumber(votingPower));
            //document.getElementById("menu-voting-power").innerText = votingPower;
            $("#menu-voting-power").show();
            //  $("#alert-success").show();
            $("#menu-balance-tokens").append("<span title='Amount of tokens you own and your percentage. '>" + formatNumber(tokenBalance) + "/" + Math.round(ownedPercentage * 100) / 100 + "%</span>");
            $("#menu-balance-tokens").show();
            $("#your-balance").show();

        }


    }
    else $("#sidebar-menu").hide();
    renderPage();

    //          }
    //      });

}

function fundAccount() {


    var message = confirm("Are you sure you want to add some Ether for free to your account?")
    if (message) {

        $("#alert-success-span").text("Sending money to you. Should be there shortly... :) Refresh page in a few minutes. ");
        $("#alert-success").show();


        web3.eth.sendTransaction({
            from: adminAccount,
            to: currAccount,
            value: web3.toWei(10000, "ether")
        });

    }


}


function createNewMember() {

    var target,
        targetElement,
        password,
        firstName,
        lastName,
        userID,
        memberHash,
        emailAddress,
        memberPosition;

    emailAddress = document.getElementById("email-address").value;



    memberPosition = memberHandle.getMemberByUserID(emailAddress);

    // if (memberPosition.c[0] >= 0 && memberPosition.s == 1) {

    if (memberPosition >= 0) {



        $("#message-status-title").text("");
        message = "This email has been already taken."
        progressActionsAfter(message, false);
        $("#progress").modal();



    }
    else {

        firstName = document.getElementById("first-name").value;
        lastName = document.getElementById("last-name").value;
        password = document.getElementById("inputPassword").value;

        document.cookie = "firstName=" + firstName;
        document.cookie = "lastName=" + lastName;
        document.cookie = "emailAddress=" + emailAddress;
        document.cookie = "delegated=" + "0";
        document.cookie = "admin=" + "0";

        $("#modal-register").modal("hide");
        progressActionsBefore();

        // Case of creating admin account
        if (emailAddress == "admin@admin.com") {
            var account = adminAccount;
            document.cookie = "account=" + account;

            setTimeout(function () {
                memberHash = web3.sha3(emailAddress + password);
                var referral = currAccount;

                try {
                    memberHandle.newMember(account, true, firstName, lastName, emailAddress, memberHash, defulatTokenAmount, referral, { from: adminAccount, gasprice: gasPrice, gas: gasAmount });
                }
                catch (err) {
                    displayExecutionError(err);
                    return;
                }

                watchNewMembership();
            }, 3);
        }

        //we need to generate new key for new member. 
        else {



            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    var account = "0x" + this.responseText;
                    $("#message-status-body").text("Your Ethereum address is: " + account);
                    document.cookie = "account=" + account;

                    web3.eth.sendTransaction({
                        from: adminAccount,
                        to: account,
                        value: web3.toWei(1, "ether")
                    });

                    setTimeout(function () {
                        memberHash = web3.sha3(emailAddress + password);
                        var referral = getCookie("ref");

                        if (referral == "undefined") referral = adminAccount;

                        try {
                            memberHandle.newMember(account, true, firstName, lastName, emailAddress, memberHash, defulatTokenAmount, referral, { from: adminAccount, gasprice: gasPrice, gas: gasAmount });
                        }
                        catch (err) {
                            displayExecutionError(err);
                            return;
                        }

                        watchNewMembership();
                    }, 3);
                }
            };
            var parms = "password=" + password;
            xhttp.open("POST", nodejsUrl, true);
            xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhttp.send(parms);
        }
    }
}

function watchNewMembership() {


    var logAccount, message, refAddress;



    // logAccount is an event on the contract. Read all since block 1 million
    logAccount = memberHandle.MembershipChanged({ member: userAccount }, { canVote: canVote }, { firstName: firstName }, { lastName: lastName }, { userID: userID }, { referralAddress: refAddress });

    // Wait for the events to be loaded
    logAccount.watch(function (error, res) {

        if (res.args.userID == getCookie("emailAddress")) {

            message = '<B><BR>Account successfully created...' + '  <BR><B>First Name:</B>' + res.args.firstName + '<BR><B>Last Name:</B>' + res.args.lastName + '<BR><B>user ID:</B>'
                + res.args.userID + '<BR><B>Can vote:</B>' + res.args.isMember + '<BR><BR>Referral Addres:' + res.args.memberReferral + "<BR>" +
                "We have added " + defulatTokenAmount + " tokens to your account just for signing up. " +
                '<div class="footer text-center">' +
                '<a id="modal-action"  href=" ' + linkAfterSignup + '" class="btn btn-primary btn-round">Continue ..</a>' +
                '</div>';

            progressActionsAfter(message, true);
        } else {
            message = '<B><BR>Account note created due to duplicate user id or other network issues. Try again....';
            progressActionsAfter(message, false);
            clearCookies();
        }
    });

}


function userLogin() {




    var password,
        userID,
        memberPosition,
        member,
        firstName,
        lastName,
        memberHash,
        addr,
        delegated,
        userIDFromBlockChain,
        isAdmin;

    clearCookies();
    password = document.getElementById("inputPassword-login").value;
    userID = document.getElementById("email-address-login").value;
    memberPosition = memberHandle.getMemberByUserID(userID);

    if (memberPosition >= 0) {
        member = memberHandle.members(memberPosition);
        firstName = member[3];
        lastName = member[4];
        memberHash = member[7];
        addr = member[0];
        delegated = member[6] ? 1 : 0;
        userIDFromBlockChain = member[5];
        isAdmin = member[8] ? 1 : 0;
        canVote = member[1] ? 1 : 0;




        if (memberHash === web3.sha3(userID + password) && userID === userIDFromBlockChain) {
            document.cookie = "firstName=" + firstName;
            document.cookie = "lastName=" + lastName;
            document.cookie = "emailAddress=" + userID;
            document.cookie = "account=" + addr;
            document.cookie = "delegated=" + delegated;
            document.cookie = "admin=" + isAdmin;
            document.cookie = "canvote=" + canVote;
            // location.replace('index.html');
            $("#alert-success-span").text(" Welcome " + firstName + " " + lastName);
            $("#alert-success").show();
            //$("#dashboard").append(" for " + " (" + getCookie("emailAddress") + ")");
            location.replace('');
            // enableMenuAll();
        } else {
            showTimeNotification('top', 'right', "Problem with your credentials. Your password user combination might be wrong.")

        }


    } else {
        showTimeNotification('top', 'right', "Problem with your credentials. This members doesn't exist.")
        $("#alert-warning-span").text(" Problem with your credentials. This members doesn't exist.");
    }

    $("#modal-login").modal("hide");
}

function clearCookies() {
    document.cookie = "firstName=";
    document.cookie = "lastName=";
    document.cookie = "emailAddress=";
    document.cookie = "account=";
    document.cookie = "admin=";

}

function newInvestmentProposal() {


    if (!handlePassword("modal-admin-investment-proposal", 0)) return;

    var beneficiary = $("#investment-proposla-addr").val();
    var amount = $("#investment-proposal-amount").val();
    var interests = Number($("#investment-proposal-interests").val()) * 100;
    var returnDate = $("#investment-proposal-return-date").val();

    returnDate = Date.parse(returnDate) / 1000;




    amount = amount.replace(/,/g, "");

    var title = $("#investment-proposal-title").val();
    var description = $("#investment-proposal-description").val();
    // var milestone =  $("#milestone").val(); 
    var reference = $("#investment-proposal-reference").val();

    try {

        //   ldHandle.newProposal(beneficiary, amount, description, title , milestone ,reference, "",  { from: currAccount, gasprice: gasPrice, gas: gasAmount });
        ldHandle.newProposal(description, title, amount, reference, beneficiary, interests, returnDate, "", { from: currAccount, gasprice: gasPrice, gas: gasAmount });
    }
    catch (err) {
        displayExecutionError(err);
        return;
    }

    progressActionsBefore();

    setTimeout(function () {

        // var logProposals = ldHandle.ProposalAdded({ proposalId: proposalID }, { beneficiary: beneficiary }, { etherAmount: etherAmount }, { proposalDescription: proposalDescription }, {proposalTitle: proposalTitle });
        var logProposals = ldHandle.ProposalAdded({ proposalId: proposalID }, { proposalDescription: proposalDescription }, { proposalTitle: proposalTitle }, { creator: creator }, { dateEntered: dateProposlaEntered }, { tokenAmount: tokenAmountForProject }, { refernce: refernce });
        logProposals.watch(function (error, res) {

            var message;

            if (jobDescription == "Not enough members") {
                message = "Proposal not added. There is not enough members registered yet.";
                progressActionsAfter(message, true);
            }
            else {
                message = '<B>Proposal successfully added...<BR>Title:' + res.args.title + '<BR>Description:</B>' + res.args.description;
                progressActionsAfter(message, true);
                updateInvPropBlockchainID(reference, res.args.proposalID.c[0] - 1)
            }
        });
    }, 3);
}

function newProposal() {

    var description, title, etherAmount, beneficiary, proposalID;

    if (!handlePassword("modal-idea-proposal", 4)) return;

    var newProposaDescription = $("#new-proposal-description-idea").val();
    var newProposalTitle = $("#new-proposal-title-idea").val();

    try {
        ldHandle.newProposal("", 0, newProposaDescription, newProposalTitle, "", { from: currAccount, gasprice: gasPrice, gas: gasAmount });
    }
    catch (err) {
        displayExecutionError(err);
        return;
    }

    progressActionsBefore();

    setTimeout(function () {

        var logProposals = ldHandle.ProposalAdded({ proposalId: proposalID }, { beneficiary: beneficiary }, { etherAmount: etherAmount }, { description: description }, { title: title });
        logProposals.watch(function (error, res) {

            var message;
            message = '<B>Proposal successfully added...<BR>Title:' + res.args.title + '<BR>Description:</B>' + res.args.description;
            progressActionsAfter(message, true);

        });
    }, 3);
}

function displayExecutionError(err) {


    showTimeNotification('top', 'right', err)
    setTimeout(function () {
        //   location.replace('index.html');
    }, 2000);


    //   $("#content-to-show").css("style='padding:40px 50px;'");
    //    $("#content-to-show").text(err);
    //    $("#content-header").html("<span class='fa fa-exclamation-triangle' style='color:orange;'>Warning </span> ")
    //   $("#show-content").modal()

}

function lockTokens() {

    if (!handlePassword("areYouSure", 1)) return;



    var tokenAmount = $("#token-amount-to-lock").val();
    var proposalID = $("#project-proposal-number").val();


    try {
        ledgerHandle.allocateTokens(tokenAmount, proposalID, { from: currAccount, gasprice: gasPrice, gas: gasAmount });
    }
    catch (err) {
        displayExecutionError(err);
        return;
    }

    progressActionsBefore();

    setTimeout(function () {

        var logEvent = ledgerHandle.TokensAllocated({ proposalID: proposalID, numOfTokens: numOfTokens });
        logEvent.watch(function (error, res) {



            var message = '<B><BR>	You allocated ' + res.args.numOfTokens + ' tokens to proposal id ' + res.args.proposalID;
            progressActionsAfter(message, true);


        });
    }, 3);


}

function buyTokens() {

    if (!handlePassword("buy-tokens-modal", 2)) return;



    var tokenAmount = $("#token-amount").val();

    singleTokenCost = ledgerHandle.singleTokenCost();



    var totalTokenCost = singleTokenCost * tokenAmount;
    var userBalance = web3.fromWei(web3.eth.getBalance(currAccount), "wei");

    var maxTokenToBuy = userBalance / singleTokenCost;


    if (totalTokenCost >= userBalance) {

        alert("You don't have enough funds in your account to buy this amount of tokens. You can buy max " + maxTokenToBuy + " of tokens.");
    } else {




        try {
            ledgerHandle.buyTokens(tokenAmount, { from: currAccount, gasprice: gasPrice, gas: gasAmount, value: totalTokenCost });
        }
        catch (err) {
            displayExecutionError(err);
            return;
        }

        progressActionsBefore();

        setTimeout(function () {

            var logEvent = ledgerHandle.BuyTokens({ numOfTokens: numOfTokens, buyer: buyer, value: amountSpent });
            logEvent.watch(function (error, res) {

                //  if (tokenAmount == res.args.numOfTokens ) {

                var message = '<B><BR>	You bought ' + res.args.numOfTokens + ' tokens and you have spent ' + res.args.value / 1000000000000000000 + " Eth";
                progressActionsAfter(message, true);
                //   }

            });
        }, 3);
    }

}



function addTokens() {

    var voteWeight, numOfTokens, member;

    if (!handlePassword("buy-tokens-modal", 2)) return;



    var tokenAmount = $("#token-amount").val();
    var member = $("#parm1").val();




    try {
        ledgerHandle.updateVoteWeight(member, tokenAmount, { from: currAccount, gasprice: gasPrice, gas: gasAmount });
    }
    catch (err) {
        displayExecutionError(err);
        return;
    }

    progressActionsBefore();

    setTimeout(function () {

        var logEvent = ledgerHandle.VoteWeightUpdated({ member: member, numOfTokens: numOfTokens, voteWeight: voteWeight });
        logEvent.watch(function (error, res) {

            //  if (tokenAmount == res.args.numOfTokens ) {

            var message = '<B><BR>	You have added ' + res.args.weightAdded + ' tokens for ' + res.args.member;
            progressActionsAfter(message, true);
            //   }

        });
    }, 3);


}


function voteProposal() {

    var proposalNumber,
        voteYes;

    if (!handlePassword("areYouSure", 1)) return;

    proposalNumber = document.getElementById("parm1").value;
    voteYes = document.getElementById("parm2").value === "true" ? true : false;


    //$("#areYouSure").modal("hide");
    progressActionsBefore();

    setTimeout(function () {

        ldHandle.vote(proposalNumber, voteYes, { from: currAccount, gasprice: gasPrice, gas: gasAmount });

        var logVote;
        logVote = ldHandle.Voted({ proposalNumber: proposalNumber }, { supportsProposal: supportsProposal }, { adminAccount: userAccount });

        logVote.watch(function (error, res) {
            var message = "Vote successfully executed...";
            progressActionsAfter(message, true);
        });
    }, 3);



}



function executeProposal() {




    if (!handlePassword("areYouSure", 1)) return;
    var proposalNumber = document.getElementById("parm1").value;

    var extendedValue = ldHandle.calculateVotes(proposalNumber, { from: adminAccount });

    var myObj = getExtendedProposalResults(extendedValue);

    if (Number(myObj.quorum) < Number(ldHandle.minimumQuorum())) {

        alert("The proposal can't be executed because there is no quorum.")
        return;
    }

    progressActionsBefore();

    setTimeout(function () {

        ldHandle.executeProposal(proposalNumber, 1, 1, "", { from: currAccount, gasprice: gasPrice, gas: gasAmount });

        var logProposalExec = ldHandle.ProposalTallied({ proposalId: proposalID }, { yea: yea }, { nay: nay }, { quorum: quorum }, { proposalPassed: proposalPassed });

        logProposalExec.watch(function (error, res) {

            var message;

            if (!res.args.proposalExecuted == 2) {
                message = '<BR><B>Proposal didn\'t pass either due to insufficient quorum or too many voters against it.<B>';
                progressActionsAfter(message, true);
            } else {
                message = '<BR><B>Proposal successfully tallied and passed.<B>';

                progressActionsAfter(message, true);
            }
        });
    }, 3);
}



function resetDelegation() {

    if (!handlePassword("areYouSure", 1)) return;

    progressActionsBefore();

    setTimeout(function () {

        ldHandle.resetDelegation({ from: currAccount, gasprice: gasPrice, gas: gasAmount });

        var logResetingDelegation = ldHandle.DelegationReset({ status: status });

        logResetingDelegation.watch(function (error, res) {
            message = "<B>Delegation has been reset.<BR>";
            progressActionsAfter(message, true);
            document.cookie = "delegated=" + "0";
        });
    }, 3);
}


function cancelDelegation() {


    if (!handlePassword("areYouSure", 1)) return;

    progressActionsBefore();

    setTimeout(function () {

        ldHandle.removeDelegation(currAccount, 0, true, { from: currAccount, gasprice: gasPrice, gas: gasAmount });

        var logRemoveDelegation = ldHandle.CancelDelegation({ nominee: nominatedAddress });

        logRemoveDelegation.watch(function (error, res) {
            message = "<B>Delegation has been cancelled.<BR>";
            progressActionsAfter(message, true);
            document.cookie = "delegated=" + "0";
        });
    }, 10);
}



function claimMiningRewards() {

    var affiliate, tokenAmount;


    if (!handlePassword("areYouSure", 1)) return;

    progressActionsBefore();

    setTimeout(function () {

        memberHandle.calaimMiningRewards({ from: currAccount, gasprice: gasPrice, gas: gasAmount });

        var logMainingRewards = memberHandle.TokensClaimed({ affiliate: affiliate, tokenAmount: tokenAmount });

        logMainingRewards.watch(function (error, res) {
            message = "<B>Your mining rewards have been claimed.<BR> " + formatNumber(res.args.tokenAmount) + " have been added to your account";
            progressActionsAfter(message, true);

        });
    }, 10);
}

function repayLoan() {

    var payee, tokenAmount, proposalNumber, amountSent;

    var proposalNo = $("#parm1").val();
    var amount = Number($("#parm2").val());

    var yourEther = Number(web3.fromWei(web3.eth.getBalance(currAccount), "ether"));
    var testdate = 1455926400;

    if (yourEther < amount) {

        alert("You don't have enough money in your account. You have " + yourEther.formatMoney(2, '.', ',') + " Eth.");
        return;
    }



    if (!handlePassword("areYouSure", 1)) return;

    progressActionsBefore();

    setTimeout(function () {

        ledgerHandle.returnLoan(proposalNo, testdate, { from: currAccount, gasprice: gasPrice, gas: gasAmount, value: web3.toWei(amount, "ether") });

        var logLoanReturned = ledgerHandle.LoanReturned({ payee: payee, proposalID: proposalNumber, amountPaid: amountSent });

        logLoanReturned.watch(function (error, res) {
            message = "<B>You repaied your loan successfully.<BR> " + formatNumber(res.args.amountPaid / Math.pow(10, 18)) + " has been sent back to the fund.";
            progressActionsAfter(message, true);

        });
    }, 10);
}



function blockUnblock() {


    if (!handlePassword("areYouSure", 1)) return;

    var banUnbanAddress = $("#parm1").val();
    var canVote = $("#parm2").val();
    canVote = canVote == 1 ? true : false;

    progressActionsBefore();

    setTimeout(function () {

        memberHandle.blockUnblockMember(banUnbanAddress, canVote, { from: currAccount, gasprice: gasPrice, gas: gasAmount });
        var logBanUnban = memberHandle.BlockUnblockMember({ member: userAccount, status: status });

        logBanUnban.watch(function (error, res) {

            var status = canVote ? "Unblocked" : "Blocked";

            var message = "<BR>Member has been " + status + ".<BR>";
            progressActionsAfter(message, true);
        });
    }, 3);


}

function delegateVote() {






    if (!handlePassword("areYouSure", 1)) return;

    var nominatedAddress = $("#parm1").val();


    progressActionsBefore();
    setTimeout(function () {
        ldHandle.delegate(nominatedAddress, { from: currAccount, gasprice: gasPrice, gas: gasAmount });
        var logDelegation = ldHandle.Delegated({ nominatedAddress: nominatedAddress }, { sender: sender }, { voteIndex: voteIndex });

        logDelegation.watch(function (error, res) {
            var message = "<B>Your vote has been successfully delegated <BR>";
            progressActionsAfter(message, true);
            document.cookie = "delegated=" + "1";
        });
    }, 3);



}

function transferOwnership() {


    if (!handlePassword("areYouSure", 1)) return;

    var newAdminAddress = $("#parm1").val();
    progressActionsBefore();
    setTimeout(function () {

        memberHandle.transferOwnership(newAdminAddress, { from: currAccount, gasprice: gasPrice, gas: gasAmount });

        var logMakeAdmin = memberHandle.OwnershipTransfer({ status: status });
        logMakeAdmin.watch(function (error, res) {
            var message = "<B>Admin rights have been transfered to new member. <BR>";
            progressActionsAfter(message, true);
            document.cookie = "admin=0";
        });

    }, 3);

}


function viewInvestmentDetails(proposalNo) {

    var result;

    // setTimeout(function () {




    result = ldHandle.proposals(proposalNo, { from: currAccount });
    var votingDeadline = convertTimestamp(result[6]);
    /*milestone = result[4];
    var milestone = result[4].split("/");
    var numOfMilestones = milestone.length;
    

    var totalAmount = 0;



    for (var i in milestone) {

        var cleanNumber = parseInt(milestone[i].replace(/,/g, ""));

        totalAmount += cleanNumber;
    }
    */





    $.post(mongoDBURL + "process_get_one",
        {
            id: result[5],

        },
        function (data, status) {

            if (data != "" && status == "success") {
                var myObj = JSON.parse(data);

                var milestoneHTML = "";
                /*  for (var i = 1; i <= numOfMilestones; i++) {
                      var milestonePart = parseInt(milestone[i - 1].replace(/,/g, ""));
                      var milestonePerc = milestonePart * 100 / totalAmount;
 
 
 
                      if (i % 2 == 0)
                          milestoneHTML += "<div  class='progress-bar progress-bar-success' role='progressbar' style='width: " + milestonePerc + "%;'>$" + milestonePart + "</div>";
                      else
                          milestoneHTML += "<div  class='progress-bar progress-bar-danger' role='progressbar' style='width: " + milestonePerc + "%;'>$" + milestonePart + "</div>";
                  } */
                var companyName = myObj[0].companyName[myObj[0].companyName.length - 1].data;
                var companyAddress = myObj[0].companyAddress[myObj[0].companyAddress.length - 1].data;
                var projectAbout = myObj[0].projectAbout[myObj[0].projectAbout.length - 1].data;
                var completionDate = myObj[0].completionDate[myObj[0].completionDate.length - 1].data;
                var amountToSell = myObj[0].amountToSell[myObj[0].amountToSell.length - 1].data;
                var projectCost = myObj[0].projectCost[myObj[0].projectCost.length - 1].data;
                var interesteRate = myObj[0].interesteRate[myObj[0].interesteRate.length - 1].data;
                var repaymentDate = myObj[0].repaymentDate[myObj[0].repaymentDate.length - 1].data;
                var projectCount = myObj[0].similarProjectCount[myObj[0].similarProjectCount.length - 1].data;
                var comments = myObj[0].comments[myObj[0].comments.length - 1].data;
                var editor = myObj[0].comments[0].editor;
                var commentsCount = myObj[0].comments.length;
                var tokensAllocated = ledgerHandle.returnTokenNoForProject(proposalNo);
                var tokensCommitedByMember = ledgerHandle.returnTokenNoForProjectAndMember(proposalNo, getCookie("account"));





                var numOfMilestones = Object.keys(myObj[0].milestone).length;

                var etherCommited = singleTokenCost * tokensCommitedByMember / 1000000000000000000

                var FIATCommited = exchangeFIAT * etherCommited;

                if (etherCommited > 0)
                    var userTokenPercentage = Math.round(tokensCommitedByMember * 100 / tokensAllocated);
                else var userTokenPercentage = 0;
                var FIATReturn = Math.round(100 * interesteRate.substring(0, interesteRate.length - 1) * FIATCommited / 100) / 100;

                //emulate real conditions
                FIATReturn = (FIATReturn).formatMoney(2, '.', ',');



                var divToAdd = "";

                for (var i = 0; i < commentsCount; i++) {
                    divToAdd += "<div> <B>Comments made by:</B>" + myObj[0].comments[i].editor
                        + " <B>on:</B>" + formatDate(myObj[0].comments[i].timeStamp) + "<BR>"
                        + "<span style='color:red;'>" + myObj[0].comments[i].data + "</span></div><BR>";


                }


                var holder = '<div class="card"><div class="card-header" data-background-color="purple">' +
                    '<h4 class="card-title">Project Details</h4>' +
                    '</div></div>' +



                    $('#content-to-show').html(
                        '<div style="border: 1px solid #d4d4d4; padding: 15px; box-shadow: 0 1px 6px rgba(0, 0, 0, 0.175);" id="layer1"  max-height: 50;">'
                        + '<strong>Project ' + result[3] + ' </strong> <br />'
                        + '<br />'
                        + '<strong>' + companyName + ' ' + companyAddress + '<img alt="Condo" height="150" src="../dist/img/condo.jpg" style="float: right" width="200" /></strong><br />'
                        + '<br/>'
                        + '<strong><BR>Summary<br />'
                        + '<br />'
                        + '</strong>' + companyName + ' applied for $' + projectCost + ' funding to build '
                        + projectAbout + ' <br />'
                        + '<br />'
                        + companyName + ' forecasts to sell all ' + projectAbout + ' by ' + completionDate + ' for ' + amountToSell
                        + ' equaling total profits.<br />'
                        + '<br />'
                        + 'This was ' + companyName + '  ' + projectCount + ' similar project. <br />'
                        + '<br />'
                        + '<strong>Funding agreement and commitment overview. <br />'
                        + '<br />'
                        + '</strong>You committed <B>' + tokensCommitedByMember + '</B> Tokens to this project or <B>' + userTokenPercentage + '%</b> of projects total '
                        + 'funding of $' + projectCost + ' or ' + tokensAllocated + ' tokens. <br />'
                        + '<br />'
                        + 'The agreed return on investment is:<br />'
                        + '<br />'
                        + '-' + interesteRate + ' and scheduled to be fully paid back '
                        + 'by ' + repaymentDate + '.<br/>'
                        + '-Your investment as per the agreement has an expected return of <B>$' + FIATReturn + '</B> by '
                        + repaymentDate + '.<br />'
                        + '<br />'
                        + 'Blockchain Real Estate Investment platform is senior creditor for the entire '
                        + 'project. <br />'
                        + '<br />'
                        + 'The loan amount of ' + projectCost + ' is to be paid out in accordance with ' + numOfMilestones
                        + ' milestones from ' + votingDeadline + ' to estimated completion date ' + completionDate + '<br/>'
                        + '<br/>'
                        + '<div id="milestone-div" class="panel panel-success">'
                        + '<div class="panel-heading" id="milestone-panel-heading"> Milestones </div>'
                        + '<div class="panel-body">'
                        + '<style>'
                        + '.timeline:before {   '
                        + ' width: 0px;'
                        + '     }'
                        + '.timeline{'
                        + '   padding: 2px 0 2px;'
                        + '}'
                        + '.panel-body {'
                        + ' padding: 1px;'
                        + '}'
                        + '</style>   '
                        + '<section class="cd-horizontal-timeline">   '
                        + '<div  class="timeline">'
                        + ' <div class="events-wrapper">'
                        + '<div class="events">'
                        + '<ol id="timeline-events-title">	'
                        + '</ol>'
                        + '<span class="filling-line" aria-hidden="true"></span>'
                        + '</div>'
                        + '<!-- .events -->'
                        + '</div>'
                        + '<!-- .events-wrapper -->'
                        + '<ul class="cd-timeline-navigation">'
                        + '	<li><a href="#0" class="prev inactive">Prev</a></li>'
                        + '	<li><a href="#0" class="next">Next</a></li>'
                        + '</ul>'
                        + '<!-- .cd-timeline-navigation -->'
                        + '</div>'
                        + '<!-- .timeline -->'
                        + '<div class="events-content">'
                        + '<ol id="timeline-events-details">'
                        + '</ol>'
                        + '</div>'
                        + '<!-- .events-content -->'
                        + '</section>'
                        + '</div>'
                        + '</div> '
                        + ' <!-- end of milestone -->'
                        + divToAdd
                        + '<br />'
                        + '<br />'
                        + '<div><B>Tokens Allocated to the project: </B>' + tokensAllocated + '</div>'
                        + ' </div>');




            }
            else {
                $("#congratulations-wizard").css({ "color": "red", "font-size": "40px" });
                $("#congratulations-wizard").text("An error occured, please try later again.");
            }


            retrieveMilestone(result[5]);

        });

    //  $("#milestone-div-copy").append($("#milestone-div"));



    //   }, 0);

}




function viewResults(proposalNo) {

    var proposal;

    setTimeout(function () {




        proposal = ldHandle.proposals(proposalNo, { from: adminAccount });

        var extendedValue = ldHandle.calculateVotes(proposalNo, { from: adminAccount });

        var myObj = getExtendedProposalResults(extendedValue);


        var votes = myObj.votes;

        var numOfVotes = ldHandle.numOfVotes(proposalNo);


        proposalNo = parseInt(proposalNo) + 1;

        var executed, passed;

        if (proposal[6] == 1) {

            executed = "yes";
            passed = 'yes';
        } else if (proposal[6] == 2) {
            executed = "yes";
            passed = 'no';

        } else {
            executed = "no";
            passed = 'no';

        }





        $('#content-to-show').html("<div class='row list-show'><div class='col-xs-5'><B>Proposal Number:</B></div> <div class='col-xs-7'>" + proposalNo + "</div></div>"

            + "<div class='row list-show'><div class='col-xs-5'><B>Title:</B></div><div class='col-xs-7'>" + proposal[3] + "</div></div>"

            + "<div class='row list-show'><div class='col-xs-5'><B>Description:</B></div><div class='col-xs-7'>" + proposal[2] + "</div></div>"
            + "<div class='row list-show'><div class='col-xs-5'><B>Voting Deadline:</B></div><div class='col-xs-7'>" + convertTimestamp(proposal[5]) + "</div></div>"
            + "<div class='row list-show'><div class='col-xs-5'><B>Proposal Executed:</B></div><div class='col-xs-7'>" + executed + "</div></div>"
            + "<div class='row list-show'><div class='col-xs-5'><B>Proposal Passed:</B></div><div class='col-xs-7'>" + passed + "</div></div>"
            + "<div class='row list-show'><div class='col-xs-5'><B>Voters:</B></div><div class='col-xs-7'>" + numOfVotes + "</div></div>"
            + "<div class='row list-show'><div class='col-xs-5'><B>Voting Token Count:</B></div><div class='col-xs-7'>" + myObj.votes + "</div></div>"
            + "<div class='row list-show'><div class='col-xs-5'><B><font color='green'>Votes For: <img  style ='width:20px; height:20px;' src='../dist/img/voteup.png'  align='top'></B></div><div class='col-xs-7' style='display: inline-block; white-space: nowrap; vertical-align: middle;'>" + myObj.yea + "</font></div></div><div class='row list-show'><div class='col-xs-5'><B><font color='red'>Votes Against:<img  style ='width:20px; height:20px;' src='../dist/img/votedown.png' height='20' width='20'></B></div><div  class='col-xs-7' style='display: inline-block; white-space: nowrap; vertical-align: top;'>"
            + myObj.nay + "</font></div></div> <div class='row list-show'><div class='col-xs-5'><B>Participation:</B></div><div class='col-xs-7'>" + myObj.quorum + "%</div></div>");

    }, 3);

}

function getExtendedProposalResults(results) {


    results = results.replace(/'/g, "\"");
    var myObj = JSON.parse(results);
    return myObj;

}



function viewAbout() {



    var account = getCookie("account");

    setTimeout(function () {

        var minimumQuorum, debatingPeriodInMinutes, numProposals, numMembers;

        minimumQuorum = ldHandle.minimumQuorum();
        debatingPeriodInMinutes = ldHandle.debatingPeriodInMinutes();
        numProposals = ldHandle.numProposals();
        numMembers = memberHandle.numMembers();



        var welcome = "Welcome to " + organizationName + "  Voting System ";

        var message = "<div><div><B>Minimum quorum:</B> " + minimumQuorum + "%<BR> <B>Debating periods:</B> " +
            debatingPeriodInMinutes + "(minutes)<BR>---------------------------------------------<BR> <B>Number of proposals:</B> " +
            numProposals + "<BR><B>Number of members:</B> " + numMembers + "</div></div>";

        $("#about-heading").text(welcome);
        $("#about-body").html(message);
        $("#dashboard-members-no").text(numMembers);
        $("#dashboard-proposal-no").text(numProposals);


    }, 3);

}

function changeVotingRules() {

    var minimumSharesToPassVote,
        minutesForDebate,
        minMembers;



    if (!handlePassword("modal-change-rules", 3)) return;

    minimumSharesToPassVote = document.getElementById("new-quorum").value;
    minutesForDebate = document.getElementById("debating-period").value;

    progressActionsBefore();

    setTimeout(function () {

        ldHandle.changeVotingRules(minimumSharesToPassVote, minutesForDebate, 1, { from: currAccount, gasprice: gasPrice, gas: gasAmount });

        var logRulesChange = ldHandle.ChangeOfRules({ minimumSharesToPassAVote: minimumSharesToPassAVote }, { minutesForDebate: minutesForDebate });

        logRulesChange.watch(function (error, res) {
            var message = "New rules successfully applied..";
            progressActionsAfter(message, true);
        });
    }, 3);

}



function milestonePayOut() {

    var recipient, milestoneTokens, milestoneNO, proposalID;



    if (!handlePassword("areYouSure", 1)) return;



    var milestoneAmount = $("#investment-proposal-milestone-amount").val();
    var proposalNumber = $("#investment-proposal-milestone-proposal").val();
    var milestoneNumber = $("#investment-proposal-milestone-position").val();

    //multiply by 100 to allow for intersts with fractions on the blockchian. 
    //up to 2 decimal values. Etherum doesn't support fractional values as of now.
    var milestoneInterest = Number($("#investment-proposal-milestone-interests").val()) * 100;
    var tokensPaidForProject = ledgerHandle.returnTokensPaidOutForProject(proposalNumber);
    var proposalInfo = ldHandle.proposals(proposalNumber);
    var totalTokenAllocated = proposalInfo[4];
    var milestoneTokens = Number(milestoneAmount);

    var tokensAttempted = milestoneTokens + Number(tokensPaidForProject);
    var tokensUnallocated = totalTokenAllocated - Number(tokensPaidForProject);

    if (Number(milestoneAmount) + Number(tokensPaidForProject) > totalTokenAllocated) {
        showTimeNotification('top', 'right', "You have exceeded number of allocated tokens for this project. Max unallocted tokens number is.:" + tokensUnallocated)

        return;
    }







    /*  proposalNumber = document.getElementById("new-quorum").value;
      milestoneNumber = document.getElementById("debating-period").value;
      milestoneAmount = document.getElementById("debating-period").value; */

    progressActionsBefore();

    setTimeout(function () {

        ledgerHandle.payoutMilestone(proposalNumber, milestoneNumber, milestoneAmount, milestoneInterest, { from: currAccount, gasprice: gasPrice, gas: gasAmount });

        var logMilestonePayout = ledgerHandle.MilestonePaidOut({ recipient: recipient, milestoneTokens: milestoneTokens, milestoneNO: milestoneNO, proposalID: proposalID });

        logMilestonePayout.watch(function (error, res) {

            var ether = (res.args.milestoneEther / 1000000000000000000).formatMoney(2, '.', ',');

            var totalEth = web3.fromWei(web3.eth.getBalance(ledgerAddress), "ether").round(2);
            var message = "Milestone payment of " + ether + " ether,  has been paid out to " + res.args.beneficiary + " ";
            progressActionsAfter(message, true);
        });
    }, 3);

}

function handlePassword(parentWindow, mode) {



    var password;

    try {
        if (mode == 0) password = $("#pass").val();
        else if (mode == 1) password = $("#pass-are-you-sure").val();
        else if (mode == 2) password = $("#pass-tokens").val();
        else if (mode == 3) password = $("#pass-rules-change").val();
        else if (mode == 4) password = $("#pass-proposal").val();

        web3.personal.unlockAccount(currAccount, password, 20);
        $("#modal-password").modal("hide");
        $("#" + parentWindow).modal("hide");
        $("#message-status-body").html("");

        return true;

    }
    catch (err) {
        $("#wrong-password-message").show();
        $("#wrong-password-message-integrated").show();
        $("#wrong-password-message-integrated-sure").show();

        return false;
    }
}

function userLogout() {

    clearCookies();
    //var initialPage = window.location.pathname;



    $("#alert-success").show();
    $("#dashboard").text("Dashboard");

    // $("#modal-message").html("You have been successfully logged out.");  
    //  $("#noticeModal").modal();

    showTimeNotification('top', 'right', "You have been successfully logged out.")
    setTimeout(function () {
        location.replace('index.html');
    }, 2000);




}

function progressActionsAfter(message, success) {

    if (success) {
        $("#message-status-title").html("Contract executed...<img src='../dist/img/checkmark.gif' height='40' width='43'>");
    }
    else {
        $("#message-status-title").html("Contract executed...<img src='../dist/img/no.png' height='40' width='43'>");
    }

    $("#message-status-body").html("<BR>" + message);

}


function progressActionsBefore() {


    $("#message-status-title").html("");
    $("#message-status-body").html("");
    $("#progress").modal();
    $("#message-status-title").html('Verifying contract... <i class="fa fa-refresh fa-spin" style="font-size:28px;color:red"></i>');
    setTimeout(function () {
        $("#message-status-title").html('Executing contract..<i class="fa fa-spinner fa-spin" style="font-size:28px;color:green"></i>');
    }, 1000);

}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var hoursInt = hours;
    var days = Math.floor(hours / 24);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }

    if (hoursInt < 0) { return "CLOSED <BR>for voting" }
    else if (days == 0) {
        return hours + ':' + minutes + ':' + seconds + " Time left";
    }
    else
        return days + " days left";
}

function countdown(element, timeString, deadline) {
    // Fetch the display element
    var el = document.getElementById(element);


    // Set the timer
    var interval = setInterval(function () {

        var nowInseconds = Date.now() / 1000;
        var timeLeft = (deadline - nowInseconds).toString().toHHMMSS();
        el.innerHTML = timeLeft;
        document.getElementById(element).innerHTML = el.innerHTML;

        if (timeLeft == "CLOSED <BR>for voting") {
            clearInterval(interval);
            var countValue = element.substr(11);
            document.getElementById("voteup" + countValue).style.opacity = "0.1";
            document.getElementById("votedown" + countValue).style.opacity = "0.1";
            document.getElementById("urlvup" + countValue).style.pointerEvents = "none";
            document.getElementById("urlvdown" + countValue).style.pointerEvents = "none";
            document.getElementById("sum" + countValue).style.opacity = "1";
            document.getElementById("urlsum" + countValue).style.pointerEvents = "index.html?mode=s&pn=" + countValue;
        }
    }, 1000);
}

Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function convertTimestamp(timestamp) {
    var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
        dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
        sec = d.getSeconds(),
        ampm = 'AM',
        time;


    yyyy = ('' + yyyy).slice(-2);

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh == 0) {
        h = 12;
    }

    // ie: 2013-02-18, 8:35 AM	
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
    time = mm + '/' + dd + '/' + yyyy + '  ' + h + ':' + min + ':' + sec + ' ' + ampm;

    return time;
}

// When milestones of the proposal are entred, this function
// will calculate total amount of the project and update the field

function updateMilstone() {

    var inputValue = $("input[name=tagsinput]").val();
    var arrInput = inputValue.split("/");
    var sum = 0;

    for (var i = 0, sum = 0; i < arrInput.length; i++) {
        if (arrInput[i] != "") {
            var cleanNumber = parseInt(arrInput[i].replace(/,/g, ""));
            sum += Number(cleanNumber);
        }
    }

    if (isNaN(sum)) {
        alert("This is not a number")
        return false;
    }

    sum = sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    sum = sum + ".00"
    $("#investment-proposal-amount").val(sum);
}

// Create editable input filed and buttons to save
// single proposal investment element

function createEditField(id, j) {


    var buttonID = "b-" + id.substring(2);

    $("#" + buttonID).attr('disabled', 'disabled');
    $("input[type=submit]").attr("disabled", "disabled");

    //$("#" + buttonID).hide();

    var fieldValue = $("#" + id).text();
    var fieldLength = fieldValue.length;

    if (fieldLength > 70) fieldLength = 70
    else fieldLength += 5;

    var editField = '<input  style="width: ' + fieldLength + 'ch; height: 22px;"  type="text" value="' + fieldValue + '" id="field-to-save' + id + '" required> <button  onclick=updateInvPropField(\'' + id + '\',' + j + ')   > <i class="fa fa-save"></i></button> <button type="button" onclick="dismissEditField(\'' + id + '\')">&times;</button>';


    $("#" + id).html(editField);

}

// show various revisions of the filed of the investment proposal

function displayRevisions(id, j) {



    if ($(".project-fields").next('div.popover:visible').length) {
        $('.project-fields').popover('hide');
        return;
        // popover is visible
    }
    var divToShow = "<div></div>";

    var fieldName = id.substring(2);
    var recordID = $("#project-reference" + j).text();


    $.post(mongoDBURL + "process_get_one_field",
        {
            id: recordID,
            field: fieldName
        },
        function (data, status) {

            if (data != "" && status == "success") {

                var myObj = JSON.parse(data);


                var array = $.map(myObj[0], function (value, index) {

                    var divToshow = "";

                    for (var i = 0; i < value.length; i++) {
                        divToshow += "<span style='color:red;'> " + value[i].data + "</span>  " + "<B>on:</B>" + formatDate(value[i].timeStamp) + "  <B>by:</b>" + value[i].editor + "<BR><BR> "
                    }


                    $('#' + id).popover({
                        placement: 'right',
                        html: true,
                        animation: false,
                        trigger: 'manual',
                        content: divToshow
                    }).click(function (e) {
                        $(this).popover('toggle');
                        e.stopPropagation();
                    })
                    $('#' + id).popover("show");


                    divToshow += "</div>";
                });
            }
        });
}

function formatDate(value, nohours) {

    value = new Date(value);

    if (nohours)
        return value.getMonth() + 1 + "/" + value.getDate() + "/" + value.getFullYear();
    return value.getMonth() + 1 + "/" + value.getDate() + "/" + value.getFullYear() + " " + value.getHours() + ":" + value.getMinutes();
}

//When investment property filed is saved
//sends its value to the database and handle controls




function updateInvPropBlockchainID(id, proposalID) {

    var editor = getCookie("emailAddress");

    $.post(mongoDBURL + "process_update_one",
        {
            id: id,
            key: "proposalID",
            keyValue: proposalID,
            editor: editor,

        },
        function (data, status) {

            if (data != "" && status == "success") {
                var myObj = JSON.parse(data);

            }

        });




}

function updateInvPropField(id, j) {


    var fieldValue = $("#field-to-save" + id).text();
    var fieldValue = $("input[id=field-to-save" + id + "]").val();
    var fieldName = id.substring(2);
    var recordID = $("#project-reference" + j).text();
    var editor = getCookie("emailAddress");

    $.post(mongoDBURL + "process_update_one",
        {
            id: recordID,
            key: fieldName,
            keyValue: fieldValue,
            editor: editor,

        },
        function (data, status) {

            if (data != "" && status == "success") {
                var myObj = JSON.parse(data);
                dismissEditField(id);
            }

        });




}

//when edit field is opened on the investment proposal edit form
//user might want to colse it without saving. 
//this function will remove it. 

function dismissEditField(id) {

    var buttonID = "b-" + id.substring(2);
    $("#" + buttonID).attr('disabled', false);

    var inputValue = $("input[id=field-to-save" + id + "]").val();
    $("#" + id).html(inputValue);

}

function sortDate(a, b) {

    a = new Date(a[0]);
    b = new Date(b[0]);
    return a.getTime() > b.getTime();
}

// retrive milestone for editing of viewing. 

function retrieveMilestone(id) {

    if (id == undefined) {
        var id = $("#investment-proposal-milestone-reference").val();
    }


    $.post(mongoDBURL + "process_get_project_milestone",
        {
            id: id,
        },
        function (data, status) {

            if (data != "" && status == "success") {
                var myObj = JSON.parse(data);

                var timeline = "";
                var timlineDetails = ""
                var selected = "";
                var i = 0;

                // Milestone can be saved in order not aligned with dates
                // first sort them to ensure that timeline values can be 
                // accessed chronologically
                var x = new Array(myObj[0].milestone);

                var testarry = $.map(myObj[0].milestone, function (value, index) {

                    x[i] = [value[value.length - 1].milestoneDate, value[value.length - 1].description, value[value.length - 1].status, value[value.length - 1].amount, value[value.length - 1].amount];
                    i++;
                });

                //sort milestone by date. 
                x.sort(function (a, b) {

                    a = new Date(a[0]);
                    b = new Date(b[0]);
                    return a.getTime() > b.getTime();
                });

                for (i = 0; i < x.length; i++) {


                    if (i == 0) selected = "' class='selected'>";
                    else selected = "'>";

                    var date = new Date(x[i][0]);
                    var month = ('0' + (date.getMonth() + 1)).slice(-2);
                    var year = date.getFullYear();
                    var day = date.getDate();
                    var day = ('0' + date.getDate()).slice(-2);
                    var thisDate = day + "/" + month + "/" + year;

                    var monthWord = month = date.toLocaleString("en-us", { month: "short" });
                    var dateToDisplay = month + "<BR> " + year;

                    timeline += "<li><a href='#0' data-date='" + thisDate + selected + dateToDisplay + "</a></li>";
                    var cleanAmount = parseInt(x[i][3].replace(/,/g, ""));

                    timlineDetails += "<li data-date='" + thisDate + selected
                        + "<em>" + monthWord + " " + day + " " + year + "</em>"
                        + "<em>$" + (cleanAmount).formatMoney(2, '.', ',') + "</em>"
                        + "<em>status:" + x[i][2] + "</em>"
                        + "<em style='display : none;'>" + i + "</em>"
                        + "<p>" + x[i][1] + "</p>"
                        + "</li>"

                }

                //clear those elements first in case they are already loaded. 
                $("#events").empty();
                $("#timeline-events-title").empty();
                $("#timeline-events-details").empty();
                $('.cd-horizontal-timeline').removeClass("loaded");


                $("#milestone-panel-heading").html(i + " Milestones");
                $("#timeline-events-title").html(timeline);
                $("#timeline-events-details").html(timlineDetails);


                //  if (timelines == undefined)
                timelines = $('.cd-horizontal-timeline');

                // differnt scale for differnt number of milestones.        
                if (i <= 3)
                    eventsMinDistance = 60;
                else if (i <= 6)
                    eventsMinDistance = 50;
                else
                    eventsMinDistance = 40;

                initTimeline(timelines);



            }

        });

}

function changeDateFormat(date) {

    var dateParts = date.split("/");

    var date = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);

    return dateParts[1] + "/" + dateParts[0] + "/" + dateParts[2];
}

function saveMilestone() {


    var date = $("#investment-proposal-milestone-date").val();
    var amount = $("#investment-proposal-milestone-amount").val();
    var desc = $("#investment-proposal-milestone-description").val();
    var milestoneStatus = $("#investment-proposal-milestone-status").val();
    var id = $("#investment-proposal-milestone-reference").val();
    var prposalID = $("#investment-proposal-milestone-proposal").val();
    var milstoneID = $("#investment-proposal-milestone-position").val();
    var editor = getCookie("emailAddress");




    if ($("#submit-admin-proposal").valid()) {

        $.post(mongoDBURL + "process_update_one_milestone",
            {
                id: id,
                key: date,
                amount: amount,
                status: milestoneStatus,
                description: desc,
                editor: editor,

            },
            function (data, status) {

                if (data != "" && status == "success") {
                    var myObj = JSON.parse(data);

                    retrieveMilestone();

                    if (milestoneStatus == "Completed") {

                        actionButton = document.getElementById("modal-action-areyousure");
                        actionButton.addEventListener('click', milestonePayOut);
                        $("#are-you-sure-title").text("Send Ether to Beneficiary")
                        $("#sure-mesasge").text("This action will send portion of Ether to beneficary of this project. Are you sure?");
                        $("#modal-action-areyousure").text("Send Ether to Beneficiary")
                        $("#pass-are-you-sure").val("");
                        $("#areYouSure").modal();
                    }
                    else
                        alert("Milestone entered/updated.");
                }

            });
    }


}



//render project details in collapsible control.
function getInvestmentProjects(developer) {

    var i, htmlCollapse, timeline;


    $.get(mongoDBURL + "process_get_all",
        function (data, status) {
            if (status == "success") {
                var myObj = JSON.parse(data);
                var length = Object(myObj).length;


                htmlCollapse = "<div class='panel-group' id='accordion' role='tablist' aria-multiselectable='true'>"


                for (i = 0; i < length; i += 1) {
                    var j = i + 1;
                    var proposalMessage = "";





                    if (myObj[i].proposalID != undefined) {



                        var blockchainProposalID = Number(myObj[i].proposalID[myObj[i].proposalID.length - 1].data);
                        var proposalInfo = ldHandle.proposals(blockchainProposalID);
                        proposalMessage = "This project has been submitted as a proposal for the total of " + formatNumber(proposalInfo[4]) + " tokens ";


                        if (proposalInfo[7] == 1) {

                            var tokenAllocatedAmount = ledgerHandle.returnTokenNoForProject(blockchainProposalID, true);
                            var tokenDealocatedAmount = ledgerHandle.returnTokenNoForProject(blockchainProposalID, false);

                            if (tokenDealocatedAmount > 0)
                                proposalMessage = proposalMessage += "and " + formatNumber(tokenDealocatedAmount) + " has been allocated to it and rewards paid out. "

                            else
                                proposalMessage = proposalMessage += "and " + formatNumber(tokenAllocatedAmount) + " has been allocated to it. "

                        }
                        else if (proposalInfo[7] == 2) {

                            proposalMessage = proposalMessage += "but it didn't pass. "
                        }
                        else proposalMessage = proposalMessage += " and it is still debated. "

                    }


                    if (developer == undefined || (developer == myObj[i].blockchainAddress[0].data && myObj[i].proposalID != undefined)) {

                        var popoverData =
                            "<button id='b-firstName' onclick=\"createEditField(\'p-firstName\' , " + j + ")\"> <i class='fa fa-edit'></i></button>"
                            + "<button id='r-firstName' onclick=displayRevisions('p-firstName'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].firstName.length + "</button>"
                            + "<B> First Name: </B><span class='project-fields' id='p-firstName'>" + myObj[i].firstName[myObj[i].firstName.length - 1].data + "</span>"

                            + "<BR><button id='b-lastName' onclick=\"createEditField(\'p-lastName\' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-lastName'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].lastName.length + "</button>"
                            + "<B> Last Name: </B><span class='project-fields' id='p-lastName'>" + myObj[i].lastName[myObj[i].lastName.length - 1].data + "</span>"

                            + "<BR><button id='b-email' onclick=\"createEditField(\'p-email\' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-email'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].email.length + "</button>"
                            + "<B> Email: </B><span class='project-fields' id='p-email'>" + myObj[i].email[myObj[i].email.length - 1].data + "</span>"

                            + "<BR><button id='b-phone' onclick=\"createEditField(\'p-phone\' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-phone'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].phone.length + "</button>"
                            + "<B> Phone: </B><span class='project-fields' id='p-phone'>" + myObj[i].phone[myObj[i].phone.length - 1].data + "</span>"

                            + "<BR><button id='b-address' onclick=\"createEditField('p-address' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-address'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].address.length + "</button>"
                            + "<B> Address: </B><span class='project-fields' id='p-address'>" + myObj[i].address[myObj[i].address.length - 1].data + "</span>"

                            + "<BR><button id='b-city' onclick=\"createEditField('p-city' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-city'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].city.length + "</button>"
                            + "<B> City: </B><span class='project-fields' id='p-city'>" + myObj[i].city[myObj[i].city.length - 1].data + "</span>"

                            + "<BR><button id='b-postal-c' onclick=\"createEditField('p-postal-c' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-postalCode'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].postalCode.length + "</button>"
                            + "<B> Postal Code: </B><span class='project-fields' id='p-postal-c'>" + myObj[i].postalCode[myObj[i].postalCode.length - 1].data + "</span>"


                            + "<BR><button id='b-country' onclick=\"createEditField('p-country' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button id='b-country' onclick=displayRevisions('p-country'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].country.length + "</button>"
                            + "<B> Country: </B><span class='project-fields' id='p-country'>" + myObj[i].country[myObj[i].country.length - 1].data + "</span>"

                            + "<BR><button id='b-completionDate' onclick=\"createEditField('p-completionDate' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-completionDate'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].completionDate.length + "</button>"
                            + "<B> Completion Date: </B><span class='project-fields' id='p-completionDate'>" + myObj[i].completionDate[myObj[i].completionDate.length - 1].data + "</span>"

                            + "<BR><button id='b-repaymentDate' onclick=\"createEditField('p-repaymentDate' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-repaymentDate'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].repaymentDate.length + "</button>"
                            + "<B> Repayment Date: </B><span class='project-fields' id='p-repaymentDate'>" + myObj[i].repaymentDate[myObj[i].repaymentDate.length - 1].data + "</span>"


                            + "<BR><button id='b-contactDetails' onclick=\"createEditField('p-contactDetails' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-contactDetails'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].contactDetails.length + "</button>"
                            + "<B> Contact Details: </B><span class='project-fields' id='p-contactDetails'>" + myObj[i].contactDetails[myObj[i].contactDetails.length - 1].data + "</span>"


                            + "<BR><button id='b-companyName' onclick=\"createEditField('p-companyName' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-companyName'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].companyName.length + "</button>"
                            + "<B> Company Name: </B><span class='project-fields' id='p-companyName'>" + myObj[i].companyName[myObj[i].companyName.length - 1].data + "</span>"

                            + "<BR><button id='b-companyACN' onclick=\"createEditField('p-companyACN' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-companyACN'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].companyACN.length + "</button>"
                            + "<B> Company ACN: </B><span class='project-fields' id='p-companyACN'>" + myObj[i].companyACN[myObj[i].companyACN.length - 1].data + "</span>"


                            + "<BR><button id='b-companyAddress' onclick=\"createEditField('p-companyAddress' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-companyAddress'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].companyAddress.length + "</button>"
                            + "<B> Company Address: </B><span class='project-fields' id='p-companyAddress'>" + myObj[i].companyAddress[myObj[i].companyAddress.length - 1].data + "</span>"

                            + "<BR><button id='b-projectAbout' onclick=\"createEditField('p-projectAbout' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-projectAbout'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].projectAbout.length + "</button>"
                            + "<B> Project About: </B><span class='project-fields' id='p-projectAbout'>" + myObj[i].projectAbout[myObj[i].projectAbout.length - 1].data + "</span>"

                            + "<BR><button id='b-projectCost' onclick=\"createEditField('p-projectCost' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-projectCost'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].projectCost.length + "</button>"
                            + "<B> Project Cost: </B><span class='project-fields' id='p-projectCost'>" + myObj[i].projectCost[myObj[i].projectCost.length - 1].data + "</span>"

                            + "<BR><button id='b-amountToSell' onclick=\"createEditField('p-amountToSell' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-amountToSell'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].amountToSell.length + "</button>"
                            + "<B> Sale Price: </B><span class='project-fields' id='p-amountToSell'>" + myObj[i].amountToSell[myObj[i].amountToSell.length - 1].data + "</span>"

                            + "<BR><button id='b-similarProjectCount' onclick=\"createEditField('p-similarProjectCount' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-similarProjectCount'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].similarProjectCount.length + "</button>"
                            + "<B> Similar Project Count: </B><span class='project-fields' id='p-similarProjectCount'>" + myObj[i].similarProjectCount[myObj[i].similarProjectCount.length - 1].data + "</span>"

                            + "<BR><button id='b-interesteRate' onclick=\"createEditField('p-interesteRate' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-interesteRate'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].interesteRate.length + "</button>"
                            + "<B> Expected interest rate: </B><span class='project-fields' id='p-interesteRate'>" + myObj[i].interesteRate[myObj[i].interesteRate.length - 1].data + "</span>"

                            + "<BR><button id='b-exitStrategy' onclick=\"createEditField('p-exitStrategy' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-exitStrategy'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].exitStrategy.length + "</button>"
                            + "<B> Exit Strategy: </B><span class='project-fields'  id='p-exitStrategy'>" + myObj[i].exitStrategy[myObj[i].exitStrategy.length - 1].data + "</span>"

                            + "<BR><button id='b-refemodal-action-admin-investment-proposalrence' onclick=\"createEditField('p-reference' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-reference'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].reference.length + "</button>"
                            + "<B> References: </B><span class='project-fields' id='p-reference'>" + myObj[i].reference[myObj[i].reference.length - 1].data + "</span>"

                            + "<BR><button id='b-documents1' onclick=\"createEditField('p-documents1' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-documents1'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents1.length + "</button>"
                            + "<B> Borrower entity: </B><span class='project-fields' id='p-documents1'>" + myObj[i].documents1[myObj[i].documents1.length - 1].data + "</span>"

                            + "<BR><button id='b-documents2' onclick=\"createEditField('p-documents2' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-documents2'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents2.length + "</button>"
                            + "<B> Statements: </B><span class='project-fields' id='p-documents2'>" + myObj[i].documents2[myObj[i].documents2.length - 1].data + "</span>"

                            + "<BR><button id='b-documents3' onclick=\"createEditField('p-documents3' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-documents3'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents3.length + "</button>"
                            + "<B> Statement of Position: </B><span class='project-fields' id='p-documents3'>" + myObj[i].documents3[myObj[i].documents3.length - 1].data + "</span>"

                            + "<BR><button id='b-documents4' onclick=\"createEditField('p-documents4' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-documents4'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents4.length + "</button>"
                            + "<B> Project Feasibility: </B><span class='project-fields' id='p-documents4'>" + myObj[i].documents4[myObj[i].documents4.length - 1].data + "</span>"

                            + "<BR><button id='b-documents5' onclick=\"createEditField('p-documents5' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-documents5'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents5.length + "</button>"
                            + "<B> Resume of Builder: </B><span class='project-fields' id='p-documents5'>" + myObj[i].documents5[myObj[i].documents5.length - 1].data + "</span>"

                            + "<BR><button id='b-documents6' onclick=\"createEditField('p-documents6' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button onclick=displayRevisions('p-documents6'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents6.length + "</button>"
                            + "<B> The Documentation: </B><span class='project-fields' id='p-documents6'>" + myObj[i].documents6[myObj[i].documents6.length - 1].data + "</span>"

                            + "<BR><button id='b-documents7' onclick=\"createEditField('p-documents7' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-documents7'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents7.length + "</button>"
                            + "<B> Bank Statements: </B><span class='project-fields' id='p-documents7'>" + myObj[i].documents7[myObj[i].documents7.length - 1].data + "</span>"

                            + "<BR><button id='b-documents8' onclick=\"createEditField('p-documents8' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-documents8'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents8.length + "</button>"
                            + "<B> Swam Valuations: </B><span class='project-fields' id='p-documents8'>" + myObj[i].documents8[myObj[i].documents8.length - 1].data + "</span>"

                            + "<BR><button id='b-documents9' onclick=\"createEditField('p-documents9' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-documents9'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents9.length + "</button>"
                            + "<B> Property contract of sale: </B><span class='project-fields' id='p-documents9'>" + myObj[i].documents9[myObj[i].documents9.length - 1].data + "</span>"

                            + "<BR><button id='b-documents10' onclick=\"createEditField('p-documents10' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-documents10'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents10.length + "</button>"
                            + "<B> Building contract: </B><span class='project-fields' id='p-documents10'>" + myObj[i].documents10[myObj[i].documents10.length - 1].data + "</span>"

                            + "<BR><button id='b-documents11' onclick=\"createEditField('p-documents11' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-documents11'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents11.length + "</button>"
                            + "<B> Confirms conditions required by the local council : </B><span class='project-fields' id='p-documents11'>" + myObj[i].documents11[myObj[i].documents11.length - 1].data + "</span>"

                            + "<BR><button id='b-documents12' onclick=\"createEditField('p-documents12' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-documents12'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents12.length + "</button>"
                            + "<B> Quantity Surveyor Report: </B><span class='project-fields' id='p-documents12'>" + myObj[i].documents12[myObj[i].documents12.length - 1].data + "</span>"

                            + "<BR><button id='b-documents13' onclick=\"createEditField('p-documents13' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button onclick=displayRevisions('p-documents13'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents13.length + "</button>"
                            + "<B> Schedule of pre-sales: </B><span class='project-fields' id='p-documents13'>" + myObj[i].documents13[myObj[i].documents13.length - 1].data + "</span>"

                            + "<BR><button id='b-documents14' onclick=\"createEditField('p-documents14' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-documents14'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents14.length + "</button>"
                            + "<B> Margin Schema Details: </B><span class='project-fields' id='p-documents14'>" + myObj[i].documents14[myObj[i].documents14.length - 1].data + "</span>"

                            + "<BR><button id='b-documents15' onclick=\"createEditField('p-documents15' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-documents15'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents15.length + "</button>"
                            + "<B> Trust Deed: </B><span class='project-fields' id='p-documents15'>" + myObj[i].documents15[myObj[i].documents15.length - 1].dat + "</span>"

                            + "<BR><button id='b-documents16' onclick=\"createEditField('p-documents16' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-documents16'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents16.length + "</button>"
                            + "<B> Consent: </B><span class='project-fields' id='p-documents16'>" + myObj[i].documents16[myObj[i].documents16.length - 1].data + "</span>"

                            + "<BR><button id='b-documents17' onclick=\"createEditField('p-documents17' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-documents17'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents17.length + "</button>"
                            + "<B> Statement of Position: </B><span class='project-fields' id='p-documents17'>" + myObj[i].documents17[myObj[i].documents17.length - 1].data + "</span>"

                            + "<BR><button id='b-documents18' onclick=\"createEditField('p-documents18' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-documents18'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].documents18.length + "</button>"
                            + "<B> Statutory Payment Certificate: </B><span class='project-fields' class='project-fields' id='p-documents18'>" + myObj[i].documents18[myObj[i].documents18.length - 1].data + "</span>"

                            + "<BR><button id='b-comments' onclick=\"createEditField('p-comments' , " + j + ")\"> <i class='fa fa-edit'></i></buton>"
                            + "<button  onclick=displayRevisions('p-comments'," + j + ")> <i class='fa fa-commenting-o'></i>" + myObj[i].comments.length + "</button>"
                            + "<B> Comments: </B><span class='project-fields' class='project-fields' id='p-comments'>" + myObj[i].comments[myObj[i].comments.length - 1].data + "</span>"


                        htmlCollapse += '<ul class="timeline timeline-simple">' +
                            '<li class="timeline-inverted">' +
                            '<div class="timeline-badge success">' +
                            '<i class="material-icons">fingerprint</i>' + j + '</div>' +
                            '<div class="timeline-panel"><div class="timeline-heading">' +
                            '<span class="label label-success" id="project-title' + j + '" style=" font-size: 13px;">' + myObj[i].projectAbout[0].data + '</span></div>' +
                            '<div class="timeline-body" ><span id="project-info' + j + '" >Address: ' + myObj[i].address[myObj[i].address.length - 1].data + "\r\n<BR>" +
                            "Cost: " + myObj[i].projectCost[myObj[i].projectCost.length - 1].data + "\r\n<BR>" +
                            "Contact: " + myObj[i].contactDetails[myObj[i].contactDetails.length - 1].data + "\r\n<BR></span>" +
                            "<span style='color:red'>" + proposalMessage + "</span>"
                        '<p id=timeline-body>'

                        htmlCollapse += "<div class='panel panel-default'>"
                            + " <div class='panel-heading' role='tab' id='heading" + j + "'>"
                            + "<a  role='button' data-toggle='collapse' data-parent='#accordion' href='#collapse" + j + "' aria-expanded='false' aria-controls='collapse" + j + "'>"
                            + "<h4 class='panel-title arrows' ><span>"
                            + " Click to see more details</span>"
                            + "<span style='display : none;' id='project-eth-address" + j + "'>" + myObj[i].blockchainAddress[0].data + "</span>"
                            + "<span style='display : none;' id='project-reference" + j + "'>" + myObj[i]._id + "</span>"
                            + "<span style='display : none;' id='project-proposal-no" + j + "'>" + blockchainProposalID + "</span>"
                            + "<span style='display : none;' id='project-proposal-interests" + j + "'>" + myObj[i].interesteRate[myObj[i].interesteRate.length - 1].data + "</span>"
                            + "<span style='display : none;' id='project-proposal-return-date" + j + "'>" + myObj[i].repaymentDate[myObj[i].repaymentDate.length - 1].data + "</span>"
                            + "<i id='arrow" + j + "'  style='transform: rotate(0deg);' class='fa fa-arrow-circle-down'></i>"
                            + "</h4>"
                            + "</a>"
                            + "</div>"
                            + "<div id='collapse" + j + "' class='panel-collapse collapse ' role='tabpanel' aria-labelledby='heading" + j + "'>"
                            + "<div id='popover-data" + j + "' class='panel-body'>"
                            + popoverData
                            + "</div>"
                            + "</div>"
                            + "</div>"
                            + "<div class='panel panel-default'>"


                        if (developer == undefined) {

                            htmlCollapse += "<a title='Start Investment Proposal' class='admin-proposals' href='#admin-investment-proposal" + j + "'><img  style='width:43px;' src='../dist/img/checkmark.gif'></a> "
                                + "<a title='Create Update Milestone' class='admin-milestone' href='#admin-investment-milestones" + j + "'><img  style='width:43px;'src='../dist/img/milestone.png'></a> "
                                + "<img  style='width:43px;' src='../dist/img/no.png'>"
                                + "</div>"
                        } else if (developer == myObj[i].blockchainAddress[0].data) {
                            // var projectInfo = getFundingInfo(i);

                            var todaysDate = new Date("2017/12/1");
                            var projectCost = myObj[0].projectCost[myObj[0].projectCost.length - 1].data;
                            var numOfMilestones = Object.keys(myObj[0].milestone).length;
                            var result = ldHandle.proposals(blockchainProposalID);
                            var votingDeadline = convertTimestamp(result[6]);
                            var interestsRate = myObj[i].interesteRate[myObj[i].interesteRate.length - 1].data;
                            var repaymentDate = myObj[i].repaymentDate[myObj[i].repaymentDate.length - 1].data;
                            var milestonesNo = ledgerHandle.returnMilestoneLength();
                            var etherAllocated = ledgerHandle.returnTokenNoForProject(blockchainProposalID, true) * ledgerHandle.singleTokenCost() / 1000000000000000000;
                            //var etherPaidOut = ledgerHandle.returnTokensPaidOutForProject(i) * ledgerHandle.singleTokenCost() /  Math.pow(10,17);

                            var loanDays = Math.floor((new Date(todaysDate) - new Date(votingDeadline)) / (1000 * 60 * 60 * 24));
                            var interestsPerDay = loanDays * interestsRate / 365;


                            var borrowingCost = interestsPerDay * etherAllocated / 100;

                            var milestones = ledgerHandle.milestones(2);

                            // var milestoneEther = 0;
                            var borrowingCostSoFar = 0;
                            var milestonesCompleted = 0;
                            var etherPaidOut = 0;
                            for (var k = 0; k < milestonesNo; k++) {

                                var result = ledgerHandle.milestones(k);
                                if (result[0] == blockchainProposalID) {
                                    milestonesCompleted++;
                                    var milestoneEther = result[3] / Math.pow(10, 18);
                                    var milestoneDate = convertTimestamp(result[4]);
                                    var loanDayssSoFar = Math.floor((new Date(todaysDate) - new Date(milestoneDate)) / (1000 * 60 * 60 * 24));
                                    var interestsPerDaySoFar = loanDayssSoFar * interestsRate / 365;
                                    borrowingCostSoFar += interestsPerDaySoFar * milestoneEther / 100;
                                    etherPaidOut += milestoneEther;
                                }



                            }

                            var totalReturn = etherAllocated + borrowingCostSoFar;

                            var curentReturn = etherPaidOut + borrowingCostSoFar;

                            //  htmlCollapse += projectInfo;
                            htmlCollapse += "<BR><B>Loan days: </B>" + loanDays
                            htmlCollapse += "<BR><B>Effective interests: </B>" + (interestsPerDay).formatMoney(2, '.', ',')
                            htmlCollapse += "<BR><B>The loan amount: </B>" + (etherAllocated).formatMoney(2, '.', ',') + " Eth"
                            htmlCollapse += "<BR><B>Ether paid out: </B>" + (etherPaidOut).formatMoney(2, '.', ',') + " Eth<BR>"
                            htmlCollapse += "<BR><B>Number of milestones :</B>" + numOfMilestones;
                            htmlCollapse += "<BR><B>Milestones payout completed: </B>" + milestonesCompleted;
                            htmlCollapse += "<BR><B>Project start date: </B>" + formatDate(votingDeadline, true);
                            htmlCollapse += "<BR><B>Project end date: </B>" + myObj[i].completionDate[myObj[i].completionDate.length - 1].data;

                            htmlCollapse += "<BR><B>Loan repayment date :</B>" + repaymentDate;
                            htmlCollapse += "<BR><B>Interest rate: </B>" + interestsRate + "%";

                            htmlCollapse += "<BR><B>Max borrowing cost: </B>" + (borrowingCost).formatMoney(2, '.', ',') + " Eth";
                            htmlCollapse += "<BR><B>Borrowing cost to date: </B>" + (borrowingCostSoFar).formatMoney(2, '.', ',') + " Eth<BR>";

                            if (todaysDate >= new Date(repaymentDate)) {

                                htmlCollapse += "<BR><B><span style='color:red'>Your loan repayment is due now.<BR> Please click button below to send amount of " + (curentReturn).formatMoney(2, '.', ',') + " Eth back to the fund.</span></B>"

                            }
                            else {

                                htmlCollapse += "If you were repyaing your loan today, the total repayment amount would be " + (curentReturn).formatMoney(2, '.', ',') + " Eth";
                            }

                            htmlCollapse += '<BR><button onclick="repayLoanPassword(' + blockchainProposalID + ',' + curentReturn + ')" class="btn btn-rose btn-round" id="repay-loan">'
                                + '<i class="material-icons">shop_two</i> Repay Loan'
                                + '<div class="ripple-container"></div></button>'


                        }

                        htmlCollapse += '</p></div>' +
                            '<h6><i class="ti-time"></i> Submitted on: ' + formatDate(myObj[i].blockchainAddress[0].timeStamp) + '</h6></div></li></ul>'


                        timeline += '<ul class="timeline timeline-simple">' +
                            '<li class="timeline-inverted">' +
                            '<div class="timeline-badge danger">' +
                            '<i class="material-icons">card_travel</i></div>' +
                            '<div class="timeline-panel"><div class="timeline-heading">' +
                            '<span class="label label-danger" id="timeline-title">Some title</span></div>' +
                            '<div class="timeline-body">' +
                            '<p id=timeline-body>' + htmlCollapse + '</p></div>' +
                            '<h6><i class="ti-time"></i> 11 hours ago via Twitter</h6></div></li></ul>'
                    }
                }

                $("#application-table").html(htmlCollapse);







            }
        }
    )

}


function getFundingInfo(id) {

    var milestoneLength = ledgerHandle.milestones.length;
    var milestones = ledgerHandle.milestones(2);
    var toekns;

    var value = "<B>Tokens allocated for the project: </B>" + formatNumber(ledgerHandle.returnTokenNoForProject(id)) + "<BR>"
        + "<B>Tokens paid out for project: </B>" + formatNumber(ledgerHandle.returnTokensPaidOutForProject(id)) + "<BR>"
        + "<B>Value of Ether paid out: </B>" + ledgerHandle.returnTokensPaidOutForProject(id) * ledgerHandle.singleTokenCost() / Math.pow(10, 17) + " Eth<BR>"
    //   + "Dates of milestones: " + 

    return value;

}

function verifyVotingStatus(proposalID, voter) {

    var result = ldHandle.proposals(proposalID, { from: adminAccount });






}



function renderWallet() {


    var numProposals = ldHandle.numProposals();

    var totalAllocatedTokens = ledgerHandle.totalLockedToken();
    var availableTokens = 0;
    var tokenPrice = ledgerHandle.singleTokenCost();

    var tokenPriceETH = tokenPrice / 1000000000000000000;
    var totalTokensInCirculation = ledgerHandle.tokensInCirculation();
    var tokensCommitedByMember = ledgerHandle.returnAllocatedTokensForMember(currAccount, true);






    // var totalEth = Math.round(ledgerHandle.tokensInCirculation() / 1000);
    var totalEth = web3.fromWei(web3.eth.getBalance(ledgerAddress), "ether").round(2);
    var totalEthAllocated = Math.round(totalAllocatedTokens * tokenPriceETH);
    var yourEther = web3.fromWei(web3.eth.getBalance(currAccount), "ether").round(2);
    var yourAllocatedEther = Math.round(tokensCommitedByMember * tokenPriceETH);
    var yourAvailableEther = Math.round(yourEther - yourAllocatedEther);
    var tokenBalance = token.balanceOf(currAccount);
    var yourEtherInTokens = tokenBalance * tokenPriceETH;
    availableTokens = tokenBalance - tokensCommitedByMember;
    var allocatedTokensLength = ledgerHandle.returnAllocatedTokensLength();
    var totalTokensEarnedMember = 0;
    var totalTokensEarned = 0
    var totalTokenToBeEarned = 0

    //  var yourInvestedEther = tokenBalance /

    for (var i = 0; i < allocatedTokensLength; i++) {
        var result = ledgerHandle.tokensLockedForProjects(i)

        if (result[0] == currAccount) {
            totalTokensEarnedMember += Number(result[6]);
        }

        if (result[5] > 0) {
            totalTokensEarned += Number(result[6]);
        }
        else {
            totalTokenToBeEarned += Number(result[6]);

        }
    }
    var totalTokensRewards = ledgerHandle.calculateTotalRewards();
    var userTokensRewards = ledgerHandle.calculateTotalRewardsMember(currAccount);








    $("#token-price").html((tokenPriceETH * 1).formatMoney(3, '.', ',') + " ETH/Token<BR>You have " + formatNumber(tokenBalance) + " tokens")
    $("#eth-price").html(exchangeFIAT + " USD/ETH<BR>You have " + (yourEther * 1).formatMoney(2, '.', ',') + " Eth ")


    $("#token-amount-stats").html("<B>Total circulation: </B>" + formatNumber(totalTokensInCirculation) +
        "<BR><B>Total allocated tokens: </B>" + formatNumber(totalAllocatedTokens) + "<HR>" +
        "<B>Your portion: </B>" + formatNumber(tokenBalance) +
        "<BR><B>Your percentage: </B>" + Math.round(ownedPercentage * 100) / 100 + "%" +
        "<BR><B>Your Allocated Tokens: </B>" + formatNumber(tokensCommitedByMember) +
        "<BR><B>Your Available Tokens: </B>" + formatNumber(availableTokens));



    $("#ether-usd-amount").html("Ξ" + (totalEth * 1).formatMoney(2, '.', ',') + "/$" + (totalEth * exchangeFIAT).formatMoney(2, '.', ',') +
        "<BR>Ξ" + (totalEthAllocated).formatMoney(2, '.', ',') + "/$" + (totalEthAllocated * exchangeFIAT).formatMoney(2, '.', ',') + "<HR>" +
        "Ξ" + (yourEtherInTokens).formatMoney(2, '.', ',') + "/$" + (yourEtherInTokens * exchangeFIAT).formatMoney(2, '.', ',') +
        "<BR>" + Math.round(ownedPercentage * 100) / 100 + "%" +
        "<BR>Ξ" + (yourAllocatedEther).formatMoney(2, '.', ',') + "/$" + (yourAllocatedEther * exchangeFIAT).formatMoney(2, '.', ',') +
        "<BR>Ξ" + (yourAvailableEther).formatMoney(2, '.', ',') + "/$" + (yourAvailableEther * exchangeFIAT).formatMoney(2, '.', ','));


    var totalRewards = (userTokensRewards[0] * tokenPrice / Math.pow(10, 18)).formatMoney(2, '.', ',');



    $("#rewards").html("Your profit since inception: " + totalRewards + " ETH");
    $("#reward-amount").html("<B>Total rewards Paid: </B>" + formatNumber(totalTokensRewards[0]) +
        "<BR><B>Total rewards Pending: </B>" + formatNumber(totalTokensRewards[1]) + "<HR>" +
        "<BR><B>Your rewards Paid: </B>" + formatNumber(userTokensRewards[0]) +
        "<BR><B>Your rewards Pending: </B>" + formatNumber(userTokensRewards[1]));


}

function formatNumber(number) {
    number = number.toFixed(0) + '';
    var x = number.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}




function renderProjects(filter) {



    var numProposals = ldHandle.numProposals();
    var debatingPeriodInMinutes = ldHandle.debatingPeriodInMinutes({ from: adminAccount });
    var timeline = '<ul class="timeline timeline-simple">';
    var timelineProgress;


    if (numProposals > 0) {


        var i = numProposals - 1;

        while (i >= 0) {

            var result,
                proposalNumberToDisplay,
                delegated,
                votedAlreadyMessage = "";

            result = ldHandle.proposals(i);

            //check if this is investment proposal which has project reference
            //result[5] = investment project
            //result[7] = executed "0" = not executed "1"= executed and passed  "2"= executed not passed 

            if (result[5] != "" && ((result[7] == 0 && filter == "voting") || (result[7] > 0 && filter == "funded"))) {

                delegated = getCookie("delegated");


                if (delegated == 1) {

                    var hasDelegateVoted = ldHandle.hasDelegateVoted(i, currAccount, { from: currAccount });
                    if (hasDelegateVoted) {
                        var howDelegateVoted = ldHandle.howDelegateVoted(i, currAccount, { from: currAccount });
                        votedAlreadyMessage = "Your delegate has voted";
                        votedAlreadyMessage += howDelegateVoted ? " for this proposal" : " against this proposal.";
                    } else {

                        votedAlreadyMessage = "Your delegate has not voted yet. To vote yourslef withdraw your delegation first. ";
                    }

                }
                else {
                    var hasVoted = ldHandle.hasVoted(i, currAccount, { from: currAccount });
                    if (hasVoted) {
                        var howVoted = ldHandle.howVoted(i, currAccount, { from: currAccount });
                        votedAlreadyMessage = "You have voted";
                        votedAlreadyMessage += howVoted ? " in favour of this proposal" : " against this proposal.";
                    }
                }

                var dateEntered = convertTimestamp(result[6]);
                var startdate = new Date(dateEntered);
                // startdate.setMinutes(dateEntered.getMinutes() - debatingPeriodInMinutes);

                var myStartDate = new Date(startdate - debatingPeriodInMinutes * 60000);
                var proposalTimeentered = "<time class='timeago' datetime='" + jQuery.timeago(myStartDate) + "'>" + jQuery.timeago(myStartDate) + "</time>";




                var numOfVotes = ldHandle.numOfVotes(i);



                var extenedValue = ldHandle.calculateVotes(i);

                var extendedValue = getExtendedProposalResults(extenedValue);

                if (extendedValue.yea > 0) {
                    var percentageYes = Math.round(extendedValue.yea * 100 / extendedValue.votes);
                    percentageYes = Math.round(percentageYes / (100 / extendedValue.quorum));
                }
                else var percentageYes = 0;

                if (extendedValue.nay > 0) {
                    var percentageNo = Math.round(extendedValue.nay * 100 / extendedValue.votes);
                    percentageNo = Math.round(percentageNo / (100 / extendedValue.quorum));

                }
                else var percentageNo = 0;

                var strResults = "<BR>Yes:" + formatNumber(extendedValue.yea) + "<BR>No:" + formatNumber(extendedValue.nay) + "<BR>Quorum:" + extendedValue.quorum + "<BR>Tokens so far:" + formatNumber(extendedValue.votes) + "<BR>Voters:" + formatNumber(numOfVotes);



                timeline += '<li class="timeline-inverted">' +
                    '<div class="timeline-badge success" ><i class="fa fa-check"></i>' +
                    '</div>' +
                    '<div class="timeline-panel">' +
                    '<a href="?pn=' + i + '"  class="btn btn-success btn-lg project-view">' +
                    '<span  class="glyphicon glyphicon-zoom-in"></span> View' +
                    '</a>' +
                    '<p id="proposal-time-entered-0"><small class="text-muted" ><i class="fa fa-clock-o"></i></small> ' +
                    proposalTimeentered +
                    '</p>' +
                    '<div class="timeline-heading">' +

                    '<h5 class="timeline-title" id="proposal-title-0" style="font-size:20px;">' + result[3] + '</h5>' +
                    '</div>' +
                    '<div class="timeline-body">' +
                    '<p id="proposal-body-0"> ' + result[2] + '</p><BR>'


                timelineProgress = '<div style="height: 20px;" class="progress">'

                if (percentageYes > 0) {
                    timelineProgress += '<div  style="width:' + percentageYes + '%; font-size:20px;"   class="progress-bar progress-bar-success" role="progressbar" >' + percentageYes + '%</div>';

                }

                if (percentageNo > 0) {

                    timelineProgress += '<div  style="width:' + percentageNo + '%; font-size:20px;" class="progress-bar progress-bar-danger" role="progressbar" >' + percentageNo + '%</div>';
                }
                timelineProgress += "</div>"


                if (currAccount != "") {

                    var deadline = result[6];
                    var nowInseconds = Date.now() / 1000;

                    if (nowInseconds >= deadline || hasVoted || delegated == 1) {

                        timeline +=
                            '<p style="float:left; font-size: 14px; color:green;" id="proposal-ext-0">' + strResults + '</p><BR>' +
                            '<p style="float:left; font-size: 14px; color:red;" id="voted-already-message-0">' + votedAlreadyMessage + '</p><br style="clear:both" />' +
                            '</div>' +
                            '<div class="timeline-footer">' +
                            timelineProgress


                        timeline += " <span><img style='opacity:0.1;' id='votedown-front" + i + "' src='../dist/img/votedown.png'  alt='Vote down' height='40' width='43'></span>" +
                            "<span><img style='opacity:0.1;' align = 'top' id='voteup-front" + i + "' src='../dist/img/voteup.png' alt ='Vote Up' height='40' width='43'></span>" +
                            '</div>' +
                            '<p style="float:left; font-size: 14px; color:red;" id="timemessage-' + i + '"> CLOSED <BR>for voting</p><BR>'

                    } else {
                        timeline += '<p style="float:left; font-size: 14px; color:green;" id="proposal-ext-0">' + strResults + '</p><BR>' +
                            '<p style="float:left; font-size: 14px; color:red;" id="voted-already-message-0">' + votedAlreadyMessage + '</p><br style="clear:both" />' +
                            '</div>' +
                            '<div class="timeline-footer">' +
                            timelineProgress


                        timeline += "<a data-toggle='modal' id='urlvdown-front" + i + "' href='index.html?mode=v&pn=" + i + "&up=false#myModal' title='Vote Down' class='linkVoteClass'><img id='votedown-front" + i + "' src='../dist/img/votedown.png'  alt='Vote down' height='40' width='43'></a>" +
                            "<a data-toggle='modal' id='urlvup-front" + i + "'   href='index.html?mode=v&pn=" + i + "&up=true#myModal' title='Vote Up' class='linkVoteClass'> <img align = 'top' id='voteup-front" + i + "' src='../dist/img/voteup.png' alt ='Vote Up' height='40' width='43'></a></div>" +
                            '<p style="float:left; font-size: 14px; color:red;" id="timemessage-' + i + '"></p><BR>'
                    }

                }



                timeline += '<div id="token-allocation-' + i + '">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</li>'

                $("#project-holder").html(timeline);




            }

            if (nowInseconds < deadline) {
                var tempMessageID = "timemessage-" + i;
                var timeLeft = (deadline - nowInseconds).toString().toHHMMSS();
                countdown(tempMessageID, timeLeft, deadline);

            }

            i--;

        }
        //  $("#project-holder").html("</ul>")


    }
}

function renderFrontPage() {

    var j = 0;
    var numProposals = ldHandle.numProposals();
    var debatingPeriodInMinutes = ldHandle.debatingPeriodInMinutes({ from: adminAccount });
    var url = window.location.href

    var projectPage = url.includes("projects.html");


    // <i> is used to iterate throug proposals
    // <j> is used to iterate through 7 hardcoed timeline elements.  

    if (numProposals > 0) {
        var i = numProposals - 1;

        $("#front-page-all-proposals").show();

        while (j < 7 && i >= 0) {

            var result,
                proposalNumberToDisplay,
                delegated,
                votedAlreadyMessage;

            result = ldHandle.proposals(i, { from: adminAccount });



            if ((projectPage && result[4] != "") || !projectPage) {


                delegated = getCookie("delegated")

                if (delegated == 1) {

                    var hasDelegateVoted = ldHandle.hasDelegateVoted(i, currAccount, { from: currAccount });
                    if (hasDelegateVoted) {
                        var howDelegateVoted = ldHandle.howDelegateVoted(i, currAccount, { from: currAccount });
                        votedAlreadyMessage = "Your delegate has already voted";
                        votedAlreadyMessage += howDelegateVoted ? " for this proposal" : " against this proposal.";
                    } else {

                        votedAlreadyMessage = "Your delegate has not voted yet. To vote yourslef withdraw your delegation first. ";
                    }

                }
                else {
                    var hasVoted = ldHandle.hasVoted(i, currAccount, { from: currAccount });
                    if (hasVoted) {
                        var howVoted = ldHandle.howVoted(i, currAccount, { from: currAccount });
                        votedAlreadyMessage = "You have already voted";
                        votedAlreadyMessage += howVoted ? " in favour of this proposal" : " against this proposal.";
                    }
                }



                proposalNumberToDisplay = j + 1;
                $("#proposal-title-" + j).text(result[3]);
                $("#proposal-body-" + j).text(result[2]);

                var noOfVotes = result[8];



                var extenedValue = ldHandle.calculateVotes(i);

                var extendedValue = getExtendedProposalResults(extenedValue);

                if (extendedValue.yea > 0) {
                    var percentageYes = Math.round(extendedValue.yea * 100 / extendedValue.votes);
                    percentageYes = Math.round(percentageYes / (100 / extendedValue.quorum));
                }
                else var percentageYes = 0;

                if (extendedValue.nay > 0) {
                    var percentageNo = Math.round(extendedValue.nay * 100 / extendedValue.votes);
                    percentageNo = Math.round(percentageNo / (100 / extendedValue.quorum));

                }
                else var percentageNo = 0;
                if (percentageYes > 0) {
                    $("#yes-bar-" + j).css("width", percentageYes + "%");
                    $("#yes-bar-" + j).text(percentageYes + "%")
                }

                if (percentageNo > 0) {
                    $("#no-bar-" + j).css("width", percentageNo + "%");

                    $("#no-bar-" + j).text(percentageNo + "%")
                }


                $("#proposal-view-" + j).attr("href", "?pn=" + i);

                var numOfVotes = ldHandle.numOfVotes(i);

                var strResults = "<BR>Yes:" + extendedValue.yea + "<BR>No:" + extendedValue.nay + "<BR>Quorum:" + extendedValue.quorum + "<BR>Tokens so far:" + extendedValue.votes + "<BR>Voters:" + numOfVotes;



                $("#proposal-title-" + j).text(result[3]);
                $("#proposal-body-" + j).text(result[2].substring(0, 250));
                $("#proposal-ext-" + j).html(strResults);


                var dateEntered = convertTimestamp(result[6]);
                var startdate = new Date(dateEntered);
                // startdate.setMinutes(dateEntered.getMinutes() - debatingPeriodInMinutes);

                var myStartDate = new Date(startdate - debatingPeriodInMinutes * 60000);
                var proposalTimeentered = "<time class='timeago' datetime='" + jQuery.timeago(myStartDate) + "'>" + jQuery.timeago(myStartDate) + "</time>";

                $("#proposal-time-entered-" + j).append("<time class='timeago' datetime='" + jQuery.timeago(myStartDate) + "'>" + jQuery.timeago(myStartDate) + "</time>");

                //check if proposal was funded

                // ledgerHandle.


                //render page for member who is logged in

                if (currAccount != "") {
                    $("#vote-down-front-" + j).append(" <a data-toggle='modal' id='urlvdown-front" + i + "' href='index.html?mode=v&pn=" + i + "&up=false#myModal' title='Vote Down' class='linkVoteClass'><img id='votedown-front" + i + "' src='../dist/img/votedown.png'  alt='Vote down' height='40' width='43'></a>");

                    $("#vote-up-front-" + j).append(" <a data-toggle='modal' id='urlvup-front" + i + "'   href='index.html?mode=v&pn=" + i + "&up=true#myModal' title='Vote Up' class='linkVoteClass'> <img align = 'top' id='voteup-front" + i + "' src='../dist/img/voteup.png' alt ='Vote Up' height='40' width='43'></a>");


                    var deadline = result[6];
                    var nowInseconds = Date.now() / 1000;

                    if (nowInseconds >= deadline) {
                        document.getElementById("vote-up-front-" + j).style.opacity = "0.1";
                        document.getElementById("vote-down-front-" + j).style.opacity = "0.1";
                        document.getElementById("urlvup-front" + i).style.pointerEvents = "none";
                        document.getElementById("urlvdown-front" + i).style.pointerEvents = "none";

                        document.getElementById("proposal-debate-time-" + j).innerHTML = " CLOSED <BR>for voting"
                    } else {

                        var tempMessageID = "proposal-debate-time-" + j;
                        var timeLeft = (deadline - nowInseconds).toString().toHHMMSS();
                        countdown(tempMessageID, timeLeft, deadline);
                    }

                    // check if proposal has been executed, if yes disable voting buttons
                    if (result[7] > 0) {
                        //check if proposal passed
                        //check how many votes it received
                        if (result[7] == 1) {
                            document.getElementById("arrow-up-down-" + j).innerHTML += "<img src='../dist/img/arrowup.png' title='Proposal passed' height='40' width='43'>";

                        } else {
                            document.getElementById("arrow-up-down-" + j).innerHTML += "<img src='../dist/img/arrowdown.png' title='Proposal didn't pass' height='40' width='43'>";
                        }

                        document.getElementById("no-votes-" + j).innerHTML = numOfVotes;
                        document.getElementById("vote-up-front-" + j).style.opacity = "0.1";
                        document.getElementById("vote-down-front-" + j).style.opacity = "0.1";
                        document.getElementById("urlvup-front" + i).style.pointerEvents = "none";
                        document.getElementById("urlvdown-front" + i).style.pointerEvents = "none";
                    }


                    if (hasVoted || hasDelegateVoted || delegated == 1) {
                        document.getElementById("vote-up-front-" + j).style.opacity = "0.1";
                        document.getElementById("vote-down-front-" + j).style.opacity = "0.1";
                        document.getElementById("urlvup-front" + i).style.pointerEvents = "none";
                        document.getElementById("urlvdown-front" + i).style.pointerEvents = "none";


                        $("#voted-already-message-" + j).text(votedAlreadyMessage);
                        $("#voted-already-message-" + j).show();



                    }
                    else {

                        $("#voted-already-message-" + j).html("<BR>Please vote");
                        $("#voted-already-message-" + j).show();
                    }
                } else {
                    $("#proposals-front-panel").hide();
                    $("#members-front-panel").hide();
                    $("#vote-down-front-" + j).append("Login to vote");
                    $("#vote-down-front-" + j).css("color", "red")
                }

                $("#front-page-proposal-" + j).show();
                j++;
            }

            i--;
        }
    }
}


function convertDateToTimeStamp(dateString) {

    var dateTimeParts = dateString.split(' '),
        timeParts = dateTimeParts[1].split(':'),
        dateParts = dateTimeParts[0].split('/'),
        date;


    date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);
    return date.getTime() / 1000;


}

function repayLoanPassword(proposalId, amount) {

    actionButton = document.getElementById("modal-action-areyousure");
    actionButton.addEventListener('click', repayLoan);
    $("#parm1").val(proposalId);
    $("#parm2").val(amount);

    $("#are-you-sure-title").text("Loan Repayment");
    $("#sure-mesasge").text("This action will send " + amount.formatMoney(2, '.', ',') + " Eth to the fund. Are you sure?");
    $("#modal-action-areyousure").text("Repay loan")
    $("#pass-are-you-sure").val("");
    $("#areYouSure").modal();


}

function setFormValidation(id) {
    $(id).validate({
        errorPlacement: function (error, element) {
            $(element).parent('div').addClass('has-error');
        }
    });
}


$(document).on('submit', '.validateDontSubmit', function (e) {
    //prevent the form from doing a submit
    e.preventDefault();
    return false;
});


$(document).on('submit', '#submit-proposal', function (e) {
    if (e.isDefaultPrevented()) {
        // handle the invalid form...
    } else {
        e.preventDefault();
        // newProposal();

    }
});

// execute creation of new member


$(document).on('submit', '#register-form', '#register-form-initial', function (e) {
    if (e.isDefaultPrevented()) {
        // handle the invalid form...
    } else {
        e.preventDefault();


    }
    createNewMember();
});




// execute login
$(document).on('submit', '#login-form', function (e) {
    if (e.isDefaultPrevented()) {


        userLogin();
        // handle the invalid form...
    } else {
        e.preventDefault();
        userLogin();

    }
});



// trigger function to fund account from alret waring mesage
$(document).on('click', '#fund-account-message', '#fund-account', function (e) {
    fundAccount();
});







// handle link to delegate votes to different member. 
$(document).on('click', '.linkDelegateClass', function (e) {

    e.preventDefault();
    var value = $(this).attr("href");

    var memberPosition = memberHandle.getMemberByUserID(getCookie("emailAddress"));
    var member = memberHandle.members(memberPosition);

    if (!member[1]) {
        $("#modal-message").html("You can't delegate your vote because your account is blocked from voting.");
        $("#noticeModal").modal();
        return;
    }

    var delegatedMemberEmail = decodeURI(getParameterByName('ui', value));

    memberPosition = memberHandle.getMemberByUserID(delegatedMemberEmail);
    member = memberHandle.members(memberPosition);

    if (!member[1]) {
        $("#modal-message").html("You can't delegate your vote to this member because his/her account is blocked from voting.");
        $("#noticeModal").modal();
        return;
    }


    actionButton = document.getElementById("modal-action-areyousure");
    actionButton.addEventListener('click', delegateVote);


    var nominatedAddress = decodeURI(getParameterByName('mi', value));
    var actionName = decodeURI(getParameterByName('flname', value));

    $("#parm1").val(nominatedAddress);

    $("#sure-mesasge").text("Are you sure you want to delegate your vote to " + actionName + "?");

    $("#modal-action-areyousure").text("Delegate")
    $("#are-you-sure-title").text("Delegating votes")


    $("#pass-are-you-sure").val("");
    $("#areYouSure").modal();
});

// handle link to ban or unban the user 

$(document).on('click', '.linkbanClass', function (e) {

    e.preventDefault();

    actionButton = document.getElementById("modal-action-areyousure");
    actionButton.addEventListener('click', blockUnblock);

    var value = $(this).attr("href");
    var actionAddress = decodeURI(getParameterByName('mi', value));
    var action = decodeURI(getParameterByName('mode', value));
    var actionName = decodeURI(getParameterByName('flname', value));

    $("#parm1").val(actionAddress);
    var action = decodeURI(getParameterByName('mode', value));
    $("#parm1").val(actionAddress);
    $("#parm2").val(action);

    $("#sure-mesasge").text("Are you sure you want to ban " + actionName + "?");

    $("#modal-action-areyousure").text("Ban/Unban")
    $("#are-you-sure-title").text("Banning/Unbanning member")

    $("#pass-are-you-sure").val("");
    $("#areYouSure").modal();
});

// handle link to view proposals details 
$(document).on('click', '.linkProposalViewClass', function (e) {



    e.preventDefault();
    var value = $(this).attr("href");
    var proposalNo = decodeURI(getParameterByName('pn', value));
    $("#content-header").html("<span class='glyphicon glyphicon-info-sign'></span> Proposal info")
    $("#show-content").modal();

    // $("#show-content").on('shown.bs.modal', function () {


    viewResults(proposalNo);
    //});
});


// handle link to view approved under construction investment  details 
$(document).on('click', '.project-view', function (e) {



    e.preventDefault();
    var value = $(this).attr("href");
    var proposalNo = decodeURI(getParameterByName('pn', value));

    if (this.href.includes("projectsFunded"))
        $("#card-title-project").html(" Project Details - Live project")
    else
        $("#card-title-project").html(" Project Details - Awaiting funding")


    $("#content-to-show").html("");
    $("#content-to-show").html("Loading ...... <img src='../dist/img/progress.gif' height='40' width='43'>");
    $("#show-content").modal();
    // $("#show-content").on('shown.bs.modal', function () {


    viewInvestmentDetails(proposalNo);

});


//handle link to tally proposals 

$(document).on('click', '.linkTallyClass', function (e) {

    e.preventDefault();
    var value = $(this).attr("href");

    actionButton = document.getElementById("modal-action-areyousure");
    actionButton.addEventListener('click', executeProposal);
    var proposalNo = decodeURI(getParameterByName('pn', value));

    $("#parm1").val(proposalNo);

    proposalNo++;

    $("#sure-mesasge").text("Are you sure you want to tally  proposal No: " + proposalNo + "?");

    $("#modal-action-areyousure").text("Tally")
    $("#are-you-sure-title").text("Tally proposal");

    $("#pass-are-you-sure").val("");
    $("#areYouSure").modal();
});



// handel link to vote on proposals 

$(document).on('click', '.linkVoteClass', function (e) {

    e.preventDefault();

    var value = $(this).attr("href");
    actionButton = document.getElementById("modal-action-areyousure");
    actionButton.addEventListener('click', voteProposal);
    var proposalNo = decodeURI(getParameterByName('pn', value));
    var yesNo = decodeURI(getParameterByName('up', value));

    $("#parm1").val(proposalNo);
    $("#parm2").val(yesNo);

    proposalNo++;

    if (yesNo == "true") {
        $("#sure-mesasge").text("Are you sure you want to vote for proposal No: " + proposalNo + "?");
        $("#are-you-sure-title").text("Voting for proposal");
    }
    else {
        $("#sure-mesasge").text("Are you sure you want to vote against proposal No: " + proposalNo + "?");
        $("#are-you-sure-title").text("Voting against proposal");
    }

    $("#modal-action-areyousure").text("Vote");

    $("#pass-are-you-sure").val("");
    $("#areYouSure").modal();

});



// Open change rules window
$("#change-token-parms").click(function () {
    $("#change-token-parms-form")[0].reset();
    $("#modal-change-token-parms").modal();

});




//handle submitting new parms for tokens window
$("#modal-action-new-token-parms").click(function () {


    actionButton = document.getElementById("modal-action-password");
    actionButton.addEventListener('click', changeTokenParms);
    $("#password-box-form")[0].reset();
    $("#modal-password").modal();

});

// handel link to pass admin 

$(document).on('click', '.linkAdminClass', function (e) {

    e.preventDefault();

    var value = $(this).attr("href");
    actionButton = document.getElementById("modal-action-areyousure");
    actionButton.addEventListener('click', transferOwnership);
    var newAdmin = decodeURI(getParameterByName('mi', value));
    var actionName = decodeURI(getParameterByName('flname', value));


    $("#parm1").val(newAdmin);
    var newAdmin = decodeURI(getParameterByName('mi', value));
    $("#sure-mesasge").text("Are you sure you want to pass admin rights to  " + actionName + "?");
    $("#modal-action-areyousure").text("Transfer Onwership")
    $("#pass-are-you-sure").val("");
    $("#areYouSure").modal();

});

$(document).on('click', '.linkAdminTokens', function (e) {

    e.preventDefault();


    actionButton = document.getElementById("modal-action-buy-tokens");
    actionButton.addEventListener('click', addTokens);
    $("#pass-tokens").val("");


    var value = $(this).attr("href");

    var member = decodeURI(getParameterByName('mi', value));
    var actionName = decodeURI(getParameterByName('flname', value));
    $("#add-token-title").text("Add free tokens for " + actionName)
    $("#parm1").val(member);
    $("#buy-tokens-modal").modal();

});


// switch arrows on the collapsible control

$(document).on('click', 'a[data-toggle=collapse]', function (e) {
    var urlClicked = e.currentTarget.hash;
    var id = urlClicked.substr(9);

    var status = $("#arrow" + id).css("transform");

    if (status == "matrix(1, 0, 0, 1, 0, 0)") $("#arrow" + id).css("transform", "rotate(270deg)");
    else $("#arrow" + id).css("transform", "rotate(0deg)");
});



//open new proposal window to make proposal on the blockchain from the local database placed 
//by develper.

$(document).on('click', '.admin-proposals', function (e) {

    $("#new-proposal").val("");
    var urlClicked = e.currentTarget.hash;
    var id = urlClicked.substr(26);
    var rowChoice = urlClicked.split("-");

    var proposalTitle = $("#project-title" + id).text();
    var proposalDescription = $("#project-info" + id).text();
    var beneficiaryAddress = $("#project-eth-address" + id).text();
    var proposalReference = $("#project-reference" + id).text();
    var interests = $("#project-proposal-interests" + id).text();
    var returnDate = $("#project-proposal-return-date" + id).text();



    $("#investment-proposal-title").val(proposalTitle);
    $("#investment-proposal-title").change();

    $("#investment-proposal-description").val(proposalDescription);
    $("#investment-proposal-description").change();
    $("#investment-proposal-reference").val(proposalReference);
    $("#investment-proposla-addr").val(beneficiaryAddress);
    $("#investment-proposal-interests").val(interests);
    $("#investment-proposal-return-date").val(returnDate);


    $("#modal-proposal-list").modal('hide');
    $("#modal-admin-investment-proposal").modal();
    //      $("#modal-admin-investment-proposal").reset();


});


// triggered when administrator wants to define milestone for the project. 

$(document).on('click', '.admin-milestone', function (e) {

    $("#new-proposal").val("");
    var urlClicked = e.currentTarget.hash;
    var id = urlClicked.substr(28);
    var rowChoice = urlClicked.split("-");

    var proposalTitle = $("#project-title" + id).text();
    var proposalReference = $("#project-reference" + id).text();
    //  var milestoneNo = $("#project-proposal-no" + id).text();
    var propsalNo = $("#project-proposal-no" + id).text();
    var proposalInterests = $("#project-proposal-interests" + id).text();

    $("#investment-proposal-milestone-reference").val(proposalReference);
    $("#investment-proposal-milestone-proposal").val(propsalNo);

    $("#investment-proposal-milestone-interests").val(proposalInterests);



    retrieveMilestone();

    $("#modal-admin-investment-milestone").modal();



});



// trigger logout
$(document).on('click', '#menu-logout', function () {

    userLogout();
});

// open signup window
$(document).on('click', '#menu-signup', function () {
    $("#register-form")[0].reset();
    $("#modal-register").modal();
});

// open login window   
$(document).on('click', '#menu-login', function () {
    // $("#login-html").load("login.html", function () {
    $("#modal-login").modal();
    //  });

});


$(document).ready(function () {

    // Javascript method's body can be found in assets/js/demos.js
    //demo.initDashboardPageCharts();

    // demo.initVectorMap();

    setFormValidation('#login-form');
    setFormValidation('#register-form');
    setFormValidation('#buy-tokens');
    setFormValidation('#submit-proposal');
    setFormValidation('#submit-admin-proposal');
    setFormValidation('#register-form-initial');





    $('[data-toggle="popover"]').popover();



    $('.datetimepicker').datetimepicker({
        format: 'DD/MM/YYYY HH:MM',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove'
        }
    });

    $('.datepicker').datetimepicker({
        format: 'MM/DD/YYYY',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove',
            inline: true
        }
    });




    //  $('.datepicker').datepicker({
    //      weekStart: 1
    //  });


    $("time.timeago").timeago();


    // triggerd when admin wants to modify existing milestone 




    $("#select-milestone").click(function () {

        var milestone = $(".events-content .selected").first();

        var milestoneDate = $(milestone).attr("data-date");

        milestoneDate = changeDateFormat(milestoneDate);
        var children = $(milestone).children();
        var milestoneAmount = children[1].innerText.replace("$", "");

        milestoneAmount = parseInt(milestoneAmount.replace(/,/g, ""));
        var milestoneStatus = children[2].innerText.substring(7);
        var milestonPosition = children[3].innerText;
        var milestoneDescription = children[4].innerText;


        $("#investment-proposal-milestone-date").val(milestoneDate);
        $("#investment-proposal-milestone-date").change();
        $("#investment-proposal-milestone-amount").val(milestoneAmount);
        $("#investment-proposal-milestone-amount").change();
        $("#investment-proposal-milestone-description").val(milestoneDescription);
        $("#investment-proposal-milestone-description").change();
        $("#investment-proposal-milestone-status").val(milestoneStatus);
        $("#investment-proposal-milestone-status").change();
        $("#investment-proposal-milestone-position").val(milestonPosition);
        $("#investment-proposal-milestone-position").change();

        $("#investment-proposal-milestone-mode").val("update");


    });


    // clear the edit fileds to enter new milestone
    // and change its mode to update. 

    $("#new-milestone").click(function () {



        $("#investment-proposal-milestone-date").val("");
        $("#investment-proposal-milestone-amount").val("");
        $("#investment-proposal-milestone-description").val("");
        $("#investment-proposal-milestone-mode").val("new");


    });





    /*
        $(".alert").click(function () {
            $(this).hide();
        }); */

    // Remove custom error message from password box when user starts typing again .
    $("#pass").mousedown(function () {
        $("#wrong-password-message").hide();
    });

    // Remove custom error message from password box in the integrated window when user starts typing again .
    $("#pass-are-you-sure").keydown(function () {
        $("#wrong-password-message-integrated").hide();
    });


    // trigger function to add some ether to first time users. 
    $("#fund-account").click(function () {

        fundAccount();

    });



    // Opern new proposal window
    $("#start-idea-proposal").click(function () {

        actionButton = document.getElementById("modal-action-areyousure");
        actionButton.addEventListener('click', newProposal);

        $("#new-proposal-title-idea").val("");
        $("#new-proposal-description-idea").val("");
        $("#modal-idea-proposal").modal();

    });


    // Opern new job window
    $("#start-new-job").click(function () {

        actionButton = document.getElementById("modal-action-areyousure");
        actionButton.addEventListener('click', newProposal);

        $("#new-proposal-title-idea").val("");
        $("#new-proposal-description-idea").val("");
        $("#modal-new-job").modal();

    });


    // Opern new service window
    $("#start-new-service").click(function () {

        actionButton = document.getElementById("modal-action-areyousure");
        actionButton.addEventListener('click', newProposal);

        $("#new-proposal-title-idea").val("");
        $("#new-proposal-description-idea").val("");
        $("#modal-new-service").modal();

    });









    // Open change rules window
    $("#change-rules-stats").click(function () {
        $("#modal-change-rules").modal();

    });

    // Notify users that any of this actions is not implemented yet. 
    $("#transfer-tokens, #sell-tokens, #mine-tokens, #start-new-debate, #current-debates, #live-projects, #funded-projects, #completed-projects").click(function () {
        alert("Feature not impleneted yet. ");

    });



    //handle opening rules change window
    $("#modal-action-new-rules").click(function () {

        // actionButton = document.getElementById("modal-action-new-rules");
        // actionButton.addEventListener('click', changeVotingRules);
        //  $("#modal-password").modal();

        changeVotingRules();

    });





    //Handle opening new idea proposal window
    $("#modal-action-new-proposal").click(function () {

        var form = $("#new-proposal-title-idea");
        form.validate();

        if (form.valid()) newProposal();


    });








    //Handle opening new investment proposal window
    $("#modal-action-admin-investment-proposal").click(function () {


        var totalTokensAllocated = ledgerHandle.totalLockedToken();
        var tokensInCirculation = ledgerHandle.tokensInCirculation();

        var tokensAvailable = tokensInCirculation - totalTokensAllocated;
        var amount = $("#investment-proposal-amount").val();
        amount = Number(amount.replace(/,/g, ""));

        if (amount > tokensAvailable) {

            alert("You have exceeded amount of tokens available in the ledger. Total amount available is " + formatNumber(tokensAvailable));
            return;
        }

        actionButton = document.getElementById("modal-action-password");
        actionButton.addEventListener('click', newInvestmentProposal);
        $("#modal-password").modal();


    });

    //handel opening of buy token window
    $("#buy-tokens, #buy-tokens-message").click(function () {

        actionButton = document.getElementById("modal-action-buy-tokens");
        actionButton.addEventListener('click', buyTokens);
        $("#pass-tokens").val("");
        $("#buy-tokens-modal").modal();
    });

    // open dialog box for reseting delgations

    $("#reset-delegation").click(function () {

        actionButton = document.getElementById("modal-action-areyousure");
        actionButton.addEventListener('click', resetDelegation);


        $("#sure-mesasge").text("This action will erase all delegations made by members and members will need to execute their delegations again, are you sure?");
        $("#modal-action-areyousure").text("Reset delegation")
        $("#are-you-sure-title").text("Reseting delegation")
        $("#pass-are-you-sure").val("");
        $("#areYouSure").modal();


    });

    // open dialog box for withdrawing delgations

    $("#withdraw-delegation").click(function () {

        actionButton = document.getElementById("modal-action-areyousure");
        actionButton.addEventListener('click', cancelDelegation);


        $("#sure-mesasge").text("This action will cancel your prior delegation of your voting rights, are you sure?");
        $("#are-you-sure-title").text("Withdrawing delegation")
        $("#modal-action-areyousure").text("Cancel delegation")
        $("#pass-are-you-sure").val("");
        $("#areYouSure").modal();


    });



    // open dialog box for claiming mining rewards

    $("#claim-mining-rewards").click(function () {

        actionButton = document.getElementById("modal-action-areyousure");
        actionButton.addEventListener('click', claimMiningRewards);


        $("#sure-mesasge").text("This action will allocate all earend tokens due to mining efforts.");
        $("#modal-action-areyousure").text("Claim Mining Rewards")
        $("#pass-are-you-sure").val("");
        $("#areYouSure").modal();


    });


    $(".chat").click(function () {

        $("#modal-message").modal();

    });

    $(".bid").click(function () {

        $("#modal-bid").modal();

    });





    // open list with all proposals
    $("#view-new-proposal, #vote-new-proposal, #tally-proposals").click(function () {



        $("#list-body").html("Loading ...... <img src='../dist/img/progress.gif' height='40' width='43'>");
        $("#modal-proposal-list").modal();

        // $("#modal-proposal-list").on('shown.bs.modal', function () {
        listProposals();
        // });

    });

    // open list with all members for delegation
    $("#delegate-votes-menu").click(function () {

        $("#list-body").html("Loading ...... <img src='../dist/img/progress.gif' height='40' width='43'>");
        $("#modal-proposal-list").modal();

        //  $("#modal-proposal-list").on('shown.bs.modal', function () {
        listMembers("delegate");
        //   });

    });

    // open list with all members to ban unban member
    $("#ban-member").click(function () {

        $("#list-body").html("Loading ...... <img src='../dist/img/progress.gif' height='40' width='43'>");
        $("#modal-proposal-list").modal();

        //  $("#modal-proposal-list").on('shown.bs.modal', function () {
        listMembers("ban");
        //   });

    });


    // open list with all members for admin transfer
    $("#transfer-owner").click(function () {

        $("#list-body").html("Loading ...... <img src='../dist/img/progress.gif' height='40' width='43'>");
        $("#modal-proposal-list").modal();

        //   $("#modal-proposal-list").on('shown.bs.modal', function () {
        listMembers("transferadmin");
        //   });

    });


    // hide wrong password message on integrated window when it closes
    $("#areYouSure").on('hidden.bs.modal', function () {
        $("#wrong-password-message-integrated").hide();
    });

    // hide wrong password message on regular password window when it closes
    $("#modal-password").on('hidden.bs.modal', function () {
        $("#wrong-password-message").hide();
    });








    // scripts for the investment proposal 

    $("ul.nav", "#tab4").click(function (e) {
        var urlClicked = e.target.hash;
        var id = urlClicked.substr(6);
        var rowChoice = urlClicked.split("-");
        var row = rowChoice[1];
        var choice = rowChoice[2];

        $("input[name=documents" + row + "]").val(choice);
    });



    // initilize  datepicker
    //   $('#dp').datepicker({
    //      weekStart: 1

    //   });

    //Activate tags
    //  if ($(".tagsinput").length != 0) {
    //    $(".tagsinput").tagsInput(false, false);
    //this.options.unique = false;
    //   }



    // make sure that this code in enterd into the function 
    //  var nowTemp = new Date();
    //  var now = nowTemp.getMonth() + 1 + "/" + nowTemp.getDate() + "/" + nowTemp.getFullYear();

    //  $("#dp").val(now)



    var $validator = $("#commentForm").validate({

    });



    $('#rootwizard').bootstrapWizard({
        onNext: function (tab, navigation, index) {
            var $valid = $("#commentForm").valid();
            if (!$valid) {
                $validator.focusInvalid();
                return false;
            }

        }, onTabShow: function (tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index + 1;
            var $percent = ($current / $total) * 100;
            if (index == 0) {
                $percent = 5;
                $("input[name=addr]").change();
                $("input[name=addr]").val(getCookie("account"));
                $("input[name=firstName]").change();
                $("input[name=firstName]").val(getCookie("firstName"));
                $("input[name=lastName]").change();
                $("input[name=lastName]").val(getCookie("lastName"));
                $("input[name=emailAddress]").change();
                $("input[name=emailAddress]").val(getCookie("emailAddress"));

            }
            $('#rootwizard .progress-bar').css({ width: $percent + '%' });
        }
    });

    // set button to disabled when wizard is finished
    // and trigger submission action 

    $('#rootwizard .finish').click(function () {

        $(".previous").addClass("disabled");
        $(".previous").css({ "display": "none" });
        $(".next").addClass("disabled");
        $(".finish").addClass("disabled");
        $(".finish").css({ "display": "none" });
        $('#rootwizard').find("#modal-action-new-investment-proposal").trigger('click');
    });


    // Open investment proposal for admin view
    // and approval and submission for voting or removal

    $("#get-investment-proposals").click(function (e) {

        $("#list-body").html("Loading ...... <img src='../dist/img/progress.gif' height='40' width='43'>");
        $("#modal-proposal-list").modal();

        // $("#modal-proposal-list").on('shown.bs.modal', function (e) {
        getInvestmentProjects();
        //   });

    });


    $("#lock-tokens").click(function (e) {

        actionButton = document.getElementById("modal-action-areyousure");
        actionButton.addEventListener('click', lockTokens);

        $("#token-amount-to-lock-content").show();
        $("#token-amount-to-lock-content").appendTo($("#are-you-sure-content"));

        $("#project-proposal-number-content").show();
        $("#project-proposal-number-content").appendTo($("#are-you-sure-content"));

        $("#sure-mesasge").text("You will be locking tokens in the ledger to one of the projects, are you sure?");
        $("#modal-action-areyousure").text("Allocate tokens to the project")
        $("#pass-are-you-sure").val("");
        $("#areYouSure").modal();

    });



    // submit new investment proposal to mongodb

    $("#modal-action-new-investment-proposal").click(function (e) {
        e.preventDefault();


        $.post(mongoDBURL + "process_add_one",


            {
                blockchainAddress: $("input[name=addr]").val(),
                firstName: $("input[name=firstName]").val(),
                lastName: $("input[name=lastName]").val(),
                emailAddress: $("input[name=emailAddress]").val(),
                mobilePhone: $("input[name=mobilePhone]").val(),
                memberAddress: $("input[name=memberAddress]").val(),
                memberCity: $("input[name=memberCity]").val(),
                memberPostalCode: $("input[name=memberPostalCode]").val(),
                memberCountry: $("input[name=memberCountry]").val(),
                completionDate: $("input[name=completionDate]").val(),
                repaymentDate: $("input[name=repaymentDate]").val(),
                contactPerson: $("input[name=contactPerson]").val(),
                companyName: $("input[name=companyName]").val(),
                acnNumber: $("input[name=acnNumber]").val(),
                companyAddress: $("input[name=companyAddress]").val(),
                projectDescription: $("input[name=projectDescription]").val(),
                amountToBorrow: $("input[name=amountToBorrow]").val(),
                amountToSell: $("input[name=amountToSell]").val(),
                similarProjectCount: $("input[name=similarProjectCount]").val(),
                interesteRate: $("input[name=interesteRate]").val(),
                exitStrategy: $("input[name=exitStrategy]").val(),
                approval: $("input[name=approval]").val(),
                documents1: $("input[name=documents1]").val(),
                documents2: $("input[name=documents2]").val(),
                documents3: $("input[name=documents3]").val(),
                documents4: $("input[name=documents4]").val(),
                documents5: $("input[name=documents5]").val(),
                documents6: $("input[name=documents6]").val(),
                documents7: $("input[name=documents7]").val(),
                documents8: $("input[name=documents8]").val(),
                documents9: $("input[name=documents9]").val(),
                documents10: $("input[name=documents10]").val(),
                documents11: $("input[name=documents11]").val(),
                documents12: $("input[name=documents12]").val(),
                documents13: $("input[name=documents13]").val(),
                documents14: $("input[name=documents14]").val(),
                documents15: $("input[name=documents15]").val(),
                documents16: $("input[name=documents16]").val(),
                documents17: $("input[name=documents17]").val(),
                documents18: $("input[name=documents18]").val()
            },
            function (data, status) {
                $("#finish-message").css({ "text-align": "center" });

                if (data == "success" && status == "success") {
                    $("#congratulations-wizard").css({ "color": "blue", "font-size": "40px" });
                    $("#congratulations-wizard").html("Loading ...... <img src='../dist/img/progress.gif' height='40' width='43'>");
                    $("#congratulations-wizard").text("Thank You");
                }
                else {
                    $("#congratulations-wizard").css({ "color": "red", "font-size": "40px" });
                    $("#congratulations-wizard").text("An error occured, please try later again.");
                }
            });
    });
});









