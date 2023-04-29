import { lineup } from "./lineup";
import { Member } from "./member";

const matrixGenerator = (() => {

    let matrix = null;
    let members = lineup.getLineup();

    const generate = () => {

        members = lineup.getLineup();
        let length = members.length;

        matrix = Array(length).fill().map(() => Array(length).fill(0));

        for (let i = 0; i < length; i++)
        {
            for (let j = 0; j < length; j++)
            {
               
                let index = getArrayIndex(members[j].opponentTH);
                matrix[i][j] = members[i].capabilities[index];
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
            matrix[i][j] = members[i].capabilities[index];
        }
    }

    const getMatrix = () => {
        return matrix;
    }

    const setMatrix = (i, j, value) => {
        matrix[i][j] = value;
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
        regenerateForMember
    };

})();

export {matrixGenerator};