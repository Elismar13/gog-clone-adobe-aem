const calculateDiscount = (price: number, discountValue: number) => {
  if (price && discountValue) {
    const oldPrice = price;
    const discountPercentage = discountValue / 100;
    const currentPrice = oldPrice * (1 - discountPercentage);

    const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

    return {
      old: formatter.format(oldPrice),
      current: formatter.format(currentPrice),
      percentage: `-${discountValue}%`,
    };
  }
  return { old: '', current: 'Preço Indefinido', percentage: '' };
};

export default calculateDiscount;