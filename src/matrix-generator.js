import { lineup } from "./lineup";
import { Member } from "./member";

const matrixGenerator = (() => {

    let matrix = null;
    let origMatrix = null;
    let members = lineup.getLineup();
    let assignedRows = [];
    let assignedCols = [];

    const generate = () => {

        members = lineup.getLineup();
        let length = members.length;

        matrix = Array(length).fill().map(() => Array(length).fill(0));
        origMatrix = Array(length).fill().map(() => Array(length).fill(0));
        assignedRows = Array(length).fill(false);
        assignedCols = Array(length).fill(false);

        for (let i = 0; i < length; i++)
        {
            for (let j = 0; j < length; j++)
            {
                let index = getArrayIndex(members[j].opponentTH);
                matrix[i][j] = members[i].capabilities[index];
                origMatrix[i][j] = members[i].capabilities[index];
            }
        }

        // second pass to make target columns -1
        for (let i = 0; i < length; i++) {
            let target = members[i].target;
            if (target != null) {
                assignBase(i, target, members[i].stars);
            }
        }
        return matrix
    }

    const regenerateForMember = (i) => {

        members = lineup.getLineup();
        let length = members.length;
        
        for (let j = 0; j < length; j++)
        {
            let index = getArrayIndex(members[j].opponentTH);
            matrix[i][j] = matrix[i][j] != -1 ? members[i].capabilities[index] : -1;
            origMatrix[i][j] = members[i].capabilities[index];
        }
    }

    const assignBase = (i, target) => {
        let stars = origMatrix[i][target];
        let members = lineup.getLineup();
        if (assignedCols[target]) {
            // find which member was assigned target
            for (let j = 0; j < assignedRows.length; j++) {
                if (assignedRows[j]) {
                    if (members[j].target == target) {
                        console.log(members[j].name)
                        unassignBase(j);
                        break;
                    }
                }
            }
        }
        let member = members[i];
        member.assign(target, stars);
        assignedRows[i] = true;
        assignedCols[target] = true;

        for (let j = 0; j < matrix.length; j++) {
            matrix[j][target] = -1;
            matrix[i][j] = -1;
        }
        matrix[i][target] = stars;
        origMatrix[i][target] = stars;
    }

    const unassignBase = (i) => {
        let member = lineup.getLineup()[i];
        let target = member.target;
        assignedRows[i] = false;
        assignedCols[target] = false;

        for (let j = 0; j < matrix.length; j++) {
            if (!assignedRows[j]) {
                matrix[j][target] = origMatrix[j][target];
                console.log(matrix[j][target]);
            }
            
            if (!assignedCols[j]) {
                matrix[i][j] = origMatrix[i][j];
            }

        }

        member.unassign();
        console.log(matrix);


    }

    const getMatrix = () => {
        return matrix;
    }

    const setMatrix = (i, j, value) => {
        matrix[i][j] = value;
        if (value != -1) origMatrix[i][j] = value;
        return matrix;
    }

    const getMatrixToMaximize = () => {

        let length = members.length;
        let newMatrix = Array(length).fill().map(() => Array(length).fill(0));
        for (let i = 0; i < length; i++)
        {
            for (let j = 0; j < length; j++)
            {
                newMatrix[i][j] = ((matrix[i][j]) * -1) + 3;
            }
        }
        return newMatrix;
    }

    const getArrayIndex = (th) => {
        return 15 - th;
    }

    return {
        generate,
        getMatrix,
        setMatrix,
        getMatrixToMaximize,
        regenerateForMember,
        assignBase, 
        unassignBase
    };

})();

export {matrixGenerator};