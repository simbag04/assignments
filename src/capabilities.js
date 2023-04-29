const capabilities = (() => {
    let fifteenPlus = [3, 3, 3, 3, 3, 3, 3, 3];
    let fifteenMinus = [2, 3, 3, 3, 3, 3, 3, 3];
    let fourteenPlus = [2, 3, 3, 3, 3, 3, 3, 3];
    let fourteenMinus = [2, 2, 3, 3, 3, 3, 3, 3];
    let thirteenPlus = [2, 2, 3, 3, 3, 3, 3, 3];
    let thirteenMinus = [1, 2, 2, 3, 3, 3, 3, 3];
    let twelvePlus = [1, 2, 2, 3, 3, 3, 3, 3];
    let twelveMinus = [1, 1, 2, 2, 3, 3, 3, 3];
    let elevenPlus = [1, 1, 2, 2, 3, 3, 3, 3];
    let elevenMinus = [0, 1, 1, 2, 2, 3, 3, 3];

    const getArray = (th) => {
        switch (th)
        {
            case '15+':
                return copyArray(fifteenPlus);
            case '15-':
                return copyArray(fifteenMinus);
            case '14+':
                return copyArray(fourteenPlus);
            case '14-':
                return copyArray(fourteenMinus);
            case '13+':
                return copyArray(thirteenPlus);
            case '13-':
                return copyArray(thirteenMinus);
            case '12+':
                return copyArray(twelvePlus);
            case '12-':
                return copyArray(twelveMinus);
            case '11+':
                return copyArray(elevenPlus);
            case '11-':
                return copyArray(elevenMinus);
            default:
                return [0, 0, 0, 0, 0, 0, 0, 0];
        }
    }

    const copyArray = (array) => {
        let newArray = array.map((x) => x);
        return newArray;
    }

    const changeArray = (th, index, value) => {
        getArray(th)[index] = value;
    }

    return {
        getArray, changeArray
    }

})();

export {capabilities};