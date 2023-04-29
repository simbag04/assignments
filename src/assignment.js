const assign = (() => {
    // all fields
    let costs = [];

    let numZerosPerCol = [];
    let numZerosPerRow = [];

    let zerosInfo = [];

    let rowsMarked = [];
    let colsMarked = [];

    let rowsAssigned = [];

    const getAssignments = () => {
        return rowsAssigned;
    }

    // initialize all fields to default values
    const initialize = (newCosts) => {
        let length = newCosts.length;

        costs = newCosts;

        numZerosPerCol = Array(length).fill(0);
        numZerosPerRow = Array(length).fill(0);
    
        zerosInfo = Array(length).fill().map(() => Array(length).fill(0));
    
        rowsMarked = Array(length).fill(false);
        colsMarked = Array(length).fill(false);
    
        rowsAssigned = Array(length).fill(-1);
    }

    const makeAssignments = () => {
        minimize();
        countZeros();
        while (sum(numZerosPerRow) != 0)
        {
            assign();
        }

        while (assignments() != costs.length)
        {
            markRows();
            let change = true;
            while (change)
            {
                change = mark();
            }
            switchRowMarkings();
            addZeros();
            reset();
            countZeros();
            while (sum(numZerosPerRow) != 0)
            {
                assign();
            }

        }
    }

    // Step 1: find lowest element in row/col and subtract it from other elements
    const minimize = () => {

        // rows
        for (let i = 0; i < costs.length; i++)
        {
            let min = findMin(i, true);
            for (let j = 0; j < costs.length; j++)
            {
                costs[i][j] -= min;
            }
        }

        // cols
        for (let i = 0; i < costs.length; i++)
        {
            let min = findMin(i, false);
            for (let j = 0; j < costs.length; j++)
            {
                costs[j][i] -= min;
            }
        }
    }

    const assign = () => {
        let min = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < costs.length; i++) {
          if (numZerosPerRow[i] != 0)
            min = Math.min(min, numZerosPerRow[i]);
          if (numZerosPerCol[i] != 0)
            min = Math.min(min, numZerosPerCol[i]);
        }
    
        for (let i = 0; i < costs.length; i++) {
          for (let j = 0; j < costs.length; j++) {
            if (costs[i][j] == 0 && zerosInfo[i][j] == 0
                && (numZerosPerRow[i] == min || numZerosPerCol[j] == min)) {
              zerosInfo[i][j] |= 1;
              numZerosPerRow[i] = 0;
              numZerosPerCol[j] = 0;
              rowsAssigned[i] = j;
    
              // update row and column numbers
              for (let k = 0; k < costs.length; k++) {
                if (costs[k][j] == 0 && zerosInfo[k][j] == 0) {
                  zerosInfo[k][j] |= 2;
                  numZerosPerRow[k]--;
                }
    
                if (costs[i][k] == 0 && zerosInfo[i][k] == 0) {
                  zerosInfo[i][k] |= 2;
                  numZerosPerCol[k]--;
                }
              }
    
              return;
    
            }
          }
        }
    
    }

    const markRows = () => {
        for (let i = 0; i < costs.length; i++) {
          if (rowsAssigned[i] === -1) {
            rowsMarked[i] = true;
          }
        }
    }

    const mark = () => {
        let change = false;
    
        // mark all cols with 0s in the marked rows
        for (let i = 0; i < costs.length; i++) {
          if (colsMarked[i])
            continue;
          for (let j = 0; j < costs.length; j++) {
            if (costs[j][i] === 0 && rowsMarked[j]) {
              colsMarked[i] = true;
              change = true;
              break;
            }
          }
        }
    
        // mark all rows with assignments in marked columns
        for (let i = 0; i < costs.length; i++) {
          if (rowsMarked[i])
            continue;
          if (colsMarked[rowsAssigned[i]]) {
            rowsMarked[i] = true;
            change = true;
          }
        }
        return change;
      }


    const addZeros = () => {
        let min = Number.MAX_SAFE_INTEGER;
    
        // find min
        for (let i = 0; i < costs.length; i++) {
          for (let j = 0; j < costs.length; j++) {
            if (!rowsMarked[i] && !colsMarked[j])
              min = Math.min(min, costs[i][j]);
          }
        }
    
        // subtract min from uncovered elements and add to double covered elements
        for (let i = 0; i < costs.length; i++) {
          for (let j = 0; j < costs.length; j++) {
            if (!rowsMarked[i] && !colsMarked[j]) {
              costs[i][j] -= min;
            } else if (rowsMarked[i] && colsMarked[j]) {
              costs[i][j] += min;
            }
          }
        }
    
      }

    // helper method to find min in each row/col
    // accepts integer parameter row
    const findMin = (index, row) => {
        let min = row ? costs[index][0] : costs[0][index];
        for (let i = 0; i < costs.length; i++)
        {
            min = Math.min(row ? costs[index][i] : costs[i][index], min);
        }
        return min;
    }

    // helper method to count the number of zeros in each row/col
    const countZeros = () => {
        for (let i = 0; i < costs.length; i++)
        {
            for (let j = 0; j < costs.length; j++)
            {
                if (costs[i][j] == 0)
                {
                    numZerosPerRow[i]++;
                    numZerosPerCol[j]++;
                }
            }
        }
    }

    const sum = (array) => {
        let s = 0;
        for (let i = 0; i < array.length; i++)
        {
            s += array[i];
        }
        return s;
    }

    const assignments = () => {
        let count = 0;
        for (let i = 0; i < costs.length; i++) {
          if (rowsAssigned[i] != -1) {
            count++;
          }
        }
        return count;
      }
    
      const switchRowMarkings = () => {
        for (let i = 0; i < costs.length; i++) {
          rowsMarked[i] = !rowsMarked[i];
        }
      }
    
      const reset = () => {
        let length = costs.length;
        numZerosPerCol = Array(length).fill(0);
        numZerosPerRow = Array(length).fill(0);
    
        zerosInfo = Array(length).fill().map(() => Array(length).fill(0));
    
        rowsMarked = Array(length).fill(false);
        colsMarked = Array(length).fill(false);
    
        rowsAssigned = Array(length).fill(-1);
      }


      return {
        initialize, makeAssignments, getAssignments
      }

})();

export {assign};