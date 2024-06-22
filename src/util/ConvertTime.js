const convertTimestamp = (timestamp) => {
    let date = timestamp.toDate();
    let mm = date.getMonth()+1;
    let dd = date.getDate();
    let yyyy = date.getFullYear();
    date = dd + '/' + mm + '/' + yyyy;
    return date;
}


export { convertTimestamp };