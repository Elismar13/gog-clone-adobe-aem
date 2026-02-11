const calculateDiscount = (price: number, discountValue: number) => {
  if (price) {
    const oldPrice = price;
    const discountPercentage = discountValue / 100;
    const currentPrice = oldPrice * (1 - discountPercentage);
    const difference = oldPrice - currentPrice;

    const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    return {
      old: formatter.format(oldPrice),
      current: formatter.format(currentPrice),
      percentage: `-${discountValue}%`,
      difference: formatter.format(difference),
      oldNoFormatted: oldPrice,
      currentNoFormmated: currentPrice,
      differenceNoFormatted: difference,
    };
  }
  return { old: '', current: 'Preço Indefinido', percentage: '', difference: '', oldNoFormatted: 0, currentNoFormmated: 0, differenceNoFormatted: 0 };
};

export default calculateDiscount;