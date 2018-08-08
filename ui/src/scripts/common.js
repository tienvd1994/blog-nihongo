/**
 * move index in array.
 * @param {Array} arr 
 * @param {Number} old_index 
 * @param {Number} new_index 
 */
function array_move(arr, old_index, new_index) {
    if (arr.length === 0) {
        return arr;
    }
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        var k = new_index - arr.length;
        while ((k--) + 1) {
            arr.push(undefined);
        }
    }

    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}