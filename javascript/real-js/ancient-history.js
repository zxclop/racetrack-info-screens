function classifyDate(date) {
    const now = new Date();

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);
    
    if(date > oneYearFromNow) {
        return "distent future";
    }
    
    if(date < now) {
        return "future";
    }

    if(date < oneYearAgo) {
        return "ancient";
    }

    return "past";
}
