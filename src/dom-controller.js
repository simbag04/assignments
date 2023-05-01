import { assign } from "./assignment";
import {lineup } from "./lineup";
import { matrixGenerator } from "./matrix-generator";
import { Member } from "./member";
import { storage } from "./storage";
const domController = (() => {
    const body = document.querySelector('body');

    /* 
    PLAN:
    -- Add editing th capabilities
    -- Add confidence level
    -- Add functionality to "assign" a base to members
    -- Add drag/drop functionality in members section
    -- Add member list and checkboxes to select lineup
    */

    const buildLayout = () => {
        storage.getStorage();
        let header = createDiv('header', body);
        header.textContent = "CWL Assignments";
        let main = createDiv('main', body)
        createDiv('member-input-div', main);
        createElement('div', "", "", main, 'assignments', 'popup');
        createElement('div', "", "", main, 'member-capability-popup', 'popup');
        renderMemberInput();
    }

    // Member Input Form Methods
    const renderMemberInput = () => {
        let memberInputDiv = document.querySelector('.member-input-div');
        let subDiv = createDiv('sub-member-input-div', memberInputDiv);

        // create form for input
        createElement('form', "", "", subDiv, 'member-input');                

        // create form
        createMemberInputForm();
    }

    const createMemberInputForm = () => {
        let form = document.querySelector('.member-input');
        createDiv('member-info-input', form);
        let buttons = createDiv('member-input-buttons', form);
        createDiv('war-size-input', buttons);
        createWarSizeInputSection();

        // create submitButton
        let submitButton = createElement('button', "", "Assign", buttons, 'big-button', 'member-input-submit');
        submitButton.setAttribute('type', 'submit');
        
        // create button to view matrix
        let button = createElement('button', "view-matrix-button", "View Matrix", buttons, 'big-button');
        button.setAttribute('type', 'button');
        button.style.display = 'none';
        button.addEventListener('click', () => {
            displayMatrix();
        })
    
        // create copy button
        let copyButton = createElement('button', "copy-button", "Copy", buttons, 'big-button');
        copyButton.setAttribute('type', 'button');
        copyButton.style.display = 'none';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(getTextAssignments());
            copyButton.textContent = "Copied!";
        })

        let resetButton = createElement('button', "reset-button", "Reset", buttons, 'big-button');
        resetButton.setAttribute('type', 'button');
        resetButton.addEventListener('click', () => {
            let members = lineup.getLineup();
            for (let i = 0; i < members.length; i++) {
                matrixGenerator.unassignBase(i);
                matrixGenerator.generate();
            }
            if (basesAssigned()) {
                assignBases();
            }
        })

        createElement('div', "total-stars", "", buttons, 'title');

        createMembersSection();
        form.addEventListener('submit', (e) => {

            e.preventDefault();

            // get value for how many members there are
            let numMembersInput = document.querySelector('#war-size-dropdown');
            let numMembers = numMembersInput.options[numMembersInput.selectedIndex].value;

            // get lineup
            let members = lineup.getLineup();

            while (numMembers < members.length) {
                lineup.removeMember(numMembers);
            }

            matrixGenerator.generate();
            renderText();
            renderMatrix();
        })

    }

    const createWarSizeInputSection = () => {

        // create dropdown for number of members
        let warSizeInput = document.querySelector('.war-size-input');
        warSizeInput.innerHTML = "";

        // title
        let title = createDiv('title', warSizeInput);
        title.textContent = "War Size";

        // dropdown
        let dropdown = createElement('select', 'war-size-dropdown', "", warSizeInput);
        
        // create options
        let option1 = createElement('option', "", 30, dropdown);
        option1.setAttribute('value', 30);

        let option2 = createElement('option', "", 15, dropdown);
        option2.setAttribute('value', 15);

        // add event listener
        dropdown.addEventListener('change', () => {
            createMembersSection();
        })
    }

    const createMembersSection = () => {

        // clean up div
        let membersInput = document.querySelector('.member-info-input');
        membersInput.innerHTML = "";

        // create title
        let title = createDiv('title', membersInput);
        title.textContent = "Members"; 

        // create table for all inputs
        let table = createElement('table', "", "", membersInput, 'standard-table');

        // create header row element
        let headerRow = createElement('tr', "", "", table, 'odd-row', 'header-row');

        // create all headers for table
        createElement('th', "", "Pos", headerRow);
        createElement('th', "", "Name", headerRow);
        createElement('th', "target-header", "", headerRow, "assignment-header", 'hidden-td');
        createElement('th', "stars-header", "", headerRow, "assignment-header", 'hidden-td');
        createElement('th', "", "TH", headerRow);
        createElement('th', "", "Opp", headerRow);
        createElement('th', "", "", headerRow, 'hidden-td');
        headerRow.appendChild(document.createElement('th'));
        headerRow.appendChild(document.createElement('th'));

        // get value for how many members there are
        let numMembersInput = document.querySelector('#war-size-dropdown');
        let numMembers = numMembersInput.options[numMembersInput.selectedIndex].value;
        
        // create numMembers input sections
        for (let i = 0; i < numMembers; i++)
        {
            let row  = createElement('tr', "row-" + i, "", table);
            if (i % 2 == 0) row.classList.add('even-row');
            else row.classList.add('odd-row');

            let numTD = createElement('td', "", "", row);
            let num = createElement('input', "num-" + i, "", numTD, 'pos', 'first-td');
            num.setAttribute('type', 'number');
            num.setAttribute('required', true);
            num.setAttribute('min', 1);
            num.setAttribute('max', numMembers);
            num.value = (i + 1);
            num.addEventListener('change', () => {
                if (num.value == "") {
                    num.value = (i + 1);
                }
                else {
                    let member = lineup.getLineup()[i];
                    lineup.removeMember(i);
                    lineup.addMember(member, Number(num.value));
                    num.value = (i + 1);
                }
                createMembersSection();

            })

            // name input
            let nameTD = createElement('td', "", "", row);
            let nameInput = createElement('input', "name-" + i, "", nameTD, "name-input");
            nameInput.setAttribute('type', 'text');
            nameInput.setAttribute('required', true);
            nameInput.addEventListener('change', () => {
                let currMember = lineup.getLineup()[i];
                if (currMember != null) {
                    let member = currMember;
                    member.name = nameInput.value;
                    lineup.replaceMember(member, i);
                    storage.setStorage();
                }
            })

            // target/stars/checkbox td
            createElement('td', "target-" + i, "", row, "assignment-td", 'hidden-td');
            createElement('td', "stars-" + i, "", row, "assignment-td", 'hidden-td');

            // th input
            let thTD = createElement('td', "", "", row);
            let thInput = createElement('input', "th-" + i, "", thTD, 'th');
            thInput.setAttribute('type', 'text');
            thInput.setAttribute('required', true);
            thInput.setAttribute('pattern', "1([1-5])([+]|-)");
            thInput.addEventListener('change', () => {
                let currMember = lineup.getLineup()[i];
                if (currMember == null) {
                    let member = new Member(nameInput.value, thInput.value, oppThInput.value);
                    lineup.replaceMember(member, i);
                }
                else 
                {
                    currMember.memberTH = thInput.value;
                    currMember.resetCapability();
                    lineup.replaceMember(currMember, i);
                }
                if (basesAssigned()) {
                    matrixGenerator.regenerateForMember(i);
                    assignBases();

                }
                storage.setStorage();
            })
            
            // opp th input
            let oppThTD = createElement('td', "", "", row);
            let oppThInput = createElement('input', "oppTh-" + i, "", oppThTD);
            oppThInput.setAttribute('type', 'number');
            oppThInput.setAttribute('required', true);
            oppThInput.setAttribute('min', 8);
            oppThInput.setAttribute('max', 15);
            oppThInput.addEventListener('change', () => {
                let currMember = lineup.getLineup()[i]; 
                if (currMember != null) {  
                    let member = currMember;
                    member.opponentTH = oppThInput.value;
                    lineup.replaceMember(member, i);
                    storage.setStorage();
                }
                if (basesAssigned()) {    
                    matrixGenerator.generate();
                    assignBases();
                }
                
            })

            createElement('td', "check-td-" + i, "", row, 'hidden-td');

            // edit capabilities button
            let editCapabilityTD = createElement('td', "", "", row);
            let editButton = createElement('button', "", "Edit", editCapabilityTD, 'small-button');
            editButton.setAttribute('type', 'button');
            editButton.addEventListener('click', () => {
                if (lineup.getLineup()[i] != null) {
                    renderMemberCapabilityPopup(i);
                    displayIndivCapPopup();
                }

            })

            // delete button
            let deleteTD = createElement('td', "", "", row);
            let button = createElement('div', "", "", deleteTD, 'svg', 'delete', 'last-td');
            button.innerHTML = 
            "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><title>trash-can-outline</title><path d=\"M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z\" /></svg>"

            // delete button event listener
            button.addEventListener('click', () => {
                lineup.removeMember(i);
                lineup.addMember(null, numMembers);
                storage.setStorage();
                createMembersSection();
            })

            // form validation for th
            thInput.addEventListener("input", () => {
                checkMemberInputFields(thInput.id, "Please enter a TH level followed by +/- (ex. 15+)")
            });
            thInput.addEventListener("change", () => {
                checkMemberInputFields(thInput.id, "Please enter a TH level followed by +/- (ex. 15+)")
            });

            // hide buttons
            displayPreAssignment();
            
        }

        // populate members
        populateMemberSection();

    }

    const checkMemberInputFields = (id, message) => {

        let element = document.getElementById(id);
        if (element.validity.patternMismatch)
        {
            element.setCustomValidity(message);
        }
        else
        {
            element.setCustomValidity("");
        }
    }

    const populateMemberSection = () => {
        let members = lineup.getLineup();

        // get value for how many members there are
        let numMembersInput = document.querySelector('#war-size-dropdown');
        let numMembers = numMembersInput.options[numMembersInput.selectedIndex].value;

        // populate input values for each member in lineup
        for (let i = 0; i < Math.min(members.length, numMembers); i++)
        {
            let member = members[i];
            
            let nameInput = document.getElementById("name-" + i);
            nameInput.value = member == null ? "" : member.name;

            let thInput = document.getElementById("th-" + i);
            thInput.value = member == null ? "" : member.memberTH;

            let oppThInput = document.getElementById("oppTh-" + i);
            oppThInput.value = member == null ? "" : member.opponentTH;


        }
    }

    // Matrix rendering methods
    const renderMatrix = () => {

        // reset assignmentsDiv
        const assignmentsDiv = document.querySelector('.assignments');
        assignmentsDiv.innerHTML = "";

        // create assignments
        assign.initialize(matrixGenerator.getMatrixToMaximize());
        assign.makeAssignments();
        const assignments = assign.getAssignments();
        const matrix = matrixGenerator.getMatrix();

        let length = matrix.length;

        // arrays to keep track of headers for event listeners
        let numHeadersOne = [];
        let numHeadersTwo = [];
        let nameHeadersOne = [];
        let nameHeadersTwo = [];

        // create title
        createElement('div', '', "Assignments", assignmentsDiv, 'popup-title', 'title');

        // create matrix div
        let matrixDiv = createElement('table', "", "", assignmentsDiv, 'matrix-table');

        // create headers
        let headerRow = createElement('tr', "", "", matrixDiv);
        createElement('th', "", "", headerRow);

        // create headers
        for (let i = 0; i < length; i++)
        {
            numHeadersOne[i] = createElement('th', "matrix-opp-" + i, i + 1, headerRow);
        }

        createElement('th', "", "", headerRow);

        for (let i = 0; i < length; i++)
        {
            let row = createElement('tr', "", "", matrixDiv);

            // create row 
            nameHeadersOne[i] = createElement('th', "", lineup.getLineup()[i].name, row);

            let assignment = assignments[i];
            for (let j = 0; j < length; j++)
            {
                let td = createElement('td', "", "", row);
                let tdDiv = createDiv('td-div', td);

                // create each element as an input field so they can be modified
                let element = createElement('input', 'matrix-' + i + '-' + j, "", tdDiv);
                element.setAttribute('type', 'number');
                element.value = matrix[i][j];

                if (assignment === j)
                {
                    element.classList.add('green');
                }

                if ((i + j) % 2 == 0)
                {
                    element.classList.add('light');
                }
                else element.classList.add('dark');

                if (element.value == -1) {
                    element.value = "0";
                    element.disabled = true;
                    // element.style.opacity = "0%";
                }

                tdDiv.addEventListener('mouseover', () => {
                    nameHeadersOne[i].style.opacity = "0.7";
                    numHeadersOne[j].style.opacity = "0.7";
                    nameHeadersTwo[i].style.opacity = "0.7";
                    numHeadersTwo[j].style.opacity = "0.7";
                })

                tdDiv.addEventListener('mouseout', () => {
                    nameHeadersOne[i].style.opacity = "1";
                    numHeadersOne[j].style.opacity = "1";
                    nameHeadersTwo[i].style.opacity = "1";
                    numHeadersTwo[j].style.opacity = "1";
                })

                element.addEventListener('change', () => {
                    matrixGenerator.setMatrix(i, j, element.value);
                    renderMatrix();
                    renderText();
                })
            }

            nameHeadersTwo[i] = createElement('th', "", lineup.getLineup()[i].name, row);
        }

        // create headers
        let secondHeaderRow = createElement('tr', "", "", matrixDiv);
        createElement('th', "", "", secondHeaderRow);

        // create headers
        for (let i = 0; i < length; i++)
        {
            numHeadersTwo[i] = createElement('th', "matrix-opp-2-" + i, i + 1, secondHeaderRow);
        }

        createElement('th', "", "", secondHeaderRow);

        let buttons = createDiv('buttons', assignmentsDiv);
        createPopupCloseButton(buttons, "Close");

        storage.setStorage();
        
    }

    // Text assignments rendering
    const renderText = () => {

        // create assignments
        assign.initialize(matrixGenerator.getMatrixToMaximize());
        assign.makeAssignments();
        const assignments = assign.getAssignments();
        const matrix = matrixGenerator.getMatrix();

        // get lineup
        let members = lineup.getLineup();

        // opponent header
        let oppHeader = document.querySelector('#target-header');
        oppHeader.textContent = "Target";
        oppHeader.classList.remove('hidden-td');

        // stars header
        let starsHeader = document.querySelector('#stars-header');
        starsHeader.textContent = "Stars";
        starsHeader.classList.remove('hidden-td');

        // tital stars counter
        let stars = 0;

        // render text for each member
        for (let i = 0; i < assignments.length; i++)
        {
            let j = assignments[i];

            // create tds
            let opponentTD = document.querySelector('#target-' + i);
            opponentTD.innerHTML = "";
            let opponentInput = createElement('input', "target-input-" + i, "", opponentTD);
            opponentInput.setAttribute('type', 'number');
            opponentInput.setAttribute('min', 1);
            opponentInput.setAttribute('max', 30);
            opponentInput.value = Number(j + 1);
            opponentTD.classList.remove('hidden-td');

            let starsTD = document.querySelector('#stars-' + i);
            starsTD.innerHTML = "";
            let starsInput = createElement('input', 'stars-input-' + i, "", starsTD);
            starsInput.setAttribute('type', 'number');
            starsInput.setAttribute('min', 1);
            starsInput.setAttribute('max', 3);
            starsInput.value = Number(matrix[i][j]);
            starsTD.classList.remove('hidden-td');

            opponentInput.addEventListener('change', () => {
                matrixGenerator.unassignBase(i);
                let matrix = matrixGenerator.getMatrix();
                let opp = opponentInput.value - 1;
                matrixGenerator.assignBase(i, opp);
                assignBases();
            })

            starsInput.addEventListener('change', () => {
                // let opponent = opponentInput.value - 1;
                matrixGenerator.setMatrix(i, j, starsInput.value);
                assignBases();
            })

            let assignedTD = document.querySelector("#check-td-" + i);
            assignedTD.innerHTML = "";
            let checkbox = createElement('input', "assigned-" + i, "", assignedTD);
            checkbox.setAttribute('type', 'checkbox');
            checkbox.checked = members[i].target == null ? false : true;

            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    matrixGenerator.assignBase(i, Number(opponentInput.value) - 1);
                    assignBases();
                } else {
                    matrixGenerator.unassignBase(i);
                    assignBases();
                }
            })
            assignedTD.classList.remove('hidden-td');
            

            stars += Number(matrix[i][j]);
        }

        storage.setStorage();
        displayPostAssignment(stars);

    }

    const getTextAssignments = () => {
        let members = lineup.getLineup();
        let text = "";

        // create assignments
        assign.initialize(matrixGenerator.getMatrixToMaximize());
        assign.makeAssignments();
        const assignments = assign.getAssignments();
        const matrix = matrixGenerator.getMatrix();

        let totalStars = 0;

        for (let i = 0; i < members.length; i++) 
        {
            let name = members[i].name;
            let j = assignments[i];
            let stars = matrix[i][j];
            text += name + ": " + (j + 1) + " (" + stars + " stars)\n";
            totalStars += Number(stars);
        }

        text += "Total stars: " + totalStars;
        return text;
    }

    // Editing Member capability methods
    const renderMemberCapabilityPopup = (memberIndex) => {
        // reset div
        let memberCapabilityPopup = document.querySelector('.member-capability-popup');
        memberCapabilityPopup.innerHTML = "";

        let member = lineup.getLineup()[memberIndex];

        // create title and table
        let title = createElement('div', '', member.name, memberCapabilityPopup, 'popup-title', 'title');
        let table = createElement('table', "", "", memberCapabilityPopup, 'standard-table');

        // create headers
        let headerRow = createElement('tr', "", "", table, 'odd-row');
        createElement('th', "", "TH", headerRow, 'cap-assignment-header');
        createElement('th', "", "Stars", headerRow, 'last-th', 'cap-assignment-header');

        // populate table
        for (let i = 15; i >= 8; i--) {

            // create row
            let row = createElement('tr', "", "", table);
            if (i % 2 == 1) row.classList.add('even-row');
            else row.classList.add('odd-row');

            // th td
            createElement('td', "", i, row, 'first-td');

            // input for stars
            let inputTD = createElement('td', "", "", row, 'last-td');
            let starsInput = createElement('input', "", "", inputTD);
            starsInput.setAttribute('type', 'number');
            starsInput.setAttribute('min', 0);
            starsInput.setAttribute('max', 3);
            starsInput.value = member.capabilities[15 - i]; 

            // event listener
            starsInput.addEventListener('change', () => {
                member.editCapability(i, starsInput.value);

                // regenerate assignments if they have already been generated
                if (basesAssigned()) {    
                    matrixGenerator.regenerateForMember(memberIndex);
                    assignBases();
                    displayIndivCapPopup();
                }
            })
        }

        let buttons = createElement('div', "", "", memberCapabilityPopup, 'buttons');
        createPopupCloseButton(buttons, "Close");
        let resetButton = createElement('button', "", "Reset", buttons, 'big-button', 'popup-button');
        resetButton.addEventListener('click', () => {
            member.resetCapability();
            renderMemberCapabilityPopup(memberIndex);
            // regenerate assignments if they have already been generated
            if (basesAssigned()) {    
                matrixGenerator.regenerateForMember(memberIndex);
                assignBases();
                displayIndivCapPopup();
            }
        })



    }

    // Helpers for creating dom elements
    const createDiv = (name, parentDiv) => {
        let div = document.createElement('div');
        div.classList.add(name);
        parentDiv.appendChild(div);
        return div;
    }

    const createElement = (element, id, text, parent, ...classes) => {
        let el = document.createElement(element);
        el.id = id;
        el.textContent = text;
        parent.appendChild(el);
        for (let i = 0; i < classes.length; i++) {
            el.classList.add(classes[i]);
        }
        return el;
    }

    const createPopupCloseButton = (popup, text) => {
        // create close button to exit
        let closeButton = createElement('button', "", text, popup, 'big-button', 'popup-button');
        closeButton.addEventListener('click', () => {
            displayMemberInput();
        })
    }

    // Helpers for displaying elements
    const displayMatrix = () => {
        // renderMatrix();
        document.querySelector('.assignments').style.display = "flex";
        document.querySelector('.member-input-div').style.display = "none";
        document.querySelector('.member-capability-popup').style.display = 'none';
        displayPreAssignment();
    }

    const displayIndivCapPopup = () => {
        document.querySelector('.assignments').style.display = "none";
        document.querySelector('.member-input-div').style.display = "none";
        document.querySelector('.member-capability-popup').style.display = 'flex';
        displayPreAssignment();
        
    }
    
    const displayMemberInput = () => {
        document.querySelector('.assignments').style.display = "none";
        document.querySelector('.member-input-div').style.display = "block";
        document.querySelector('.member-capability-popup').style.display = 'none';
        if (basesAssigned()) {   
            // get stars
            let text = document.querySelector("#total-stars").textContent;

            displayPostAssignment(text.substring(13));
        }
        else 
        {
            displayPreAssignment();
        }
    }

    const displayPostAssignment = (stars) => {
        document.querySelector('#view-matrix-button').style.display = 'inline-block';
        let copy = document.querySelector('#copy-button')
        copy.style.display = 'inline-block';
        copy.textContent = "Copy"; 

        document.querySelector("#total-stars").textContent = "Total Stars: " + stars;
        document.querySelector("#total-stars").style.display = "block";
    }

    const displayPreAssignment = () => {
        document.querySelector('#view-matrix-button').style.display = 'none';
        document.querySelector('#copy-button').style.display = 'none';
        document.querySelector("#total-stars").style.display = "none";
    }

    const assignBases = () => {
        renderText();
        renderMatrix();
    }

    const basesAssigned = () => {
        return !document.querySelector("#target-1").classList.contains('hidden-td');
    }

    return {
        buildLayout
    }
})();

export {domController};