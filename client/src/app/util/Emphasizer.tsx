const Emphasizer = (letter : string) => {
    const sentence =  letter.charAt(0).toUpperCase() + letter.slice(1);
    return sentence;
}

export default Emphasizer;