import { Member } from "./member";
const lineup = (() => {
    let members = [];

    const addMember = (member, pos) => {
        if (pos > members.length)
        {
            members.push(member);
        }
        else
        {
            insertAtIndex(pos - 1, member);
        }

    }

    const getLineup = () => {
        return members;
    }
    
    const reset = () => {
        members = [];
    }

    const removeMember = (index) => {
        members.splice(index, 1);
    }

    const replaceMember = (newMember, index) => {
        members[index] = newMember;
    }

    const insertAtIndex = (index, member) => {
        members.splice(index, 0, member);
    }

    return {
        addMember,
        getLineup,
        reset,
        removeMember,
        replaceMember,
        insertAtIndex
    }
})();

export {lineup};