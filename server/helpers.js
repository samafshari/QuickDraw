exports.contains = function(arr, key) {
    for (i = 0; i < arr.length; i++)
        if (arr[i] == key) return true;
    return false;
}