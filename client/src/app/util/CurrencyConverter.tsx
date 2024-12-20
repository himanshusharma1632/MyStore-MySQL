const CurrencyConvert = (currency : number) => {
return `$ ${(currency/100).toFixed(2)}`;
}
export default CurrencyConvert;