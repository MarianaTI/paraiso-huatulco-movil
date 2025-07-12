export default function useRatesPrice(data, adultos, menores) {
    // console.log('🔁 Hook ejecutado con:', { adultos, menores, data });
    if (!data) return null;

    const precios = data.ratePrices || [];
    const xUnidad = data.x_unidad === "1";

    const precioAdulto = precios.find((p) => p.type === "1");
    const precioMenor = precios.find((p) => p.type === "2");

    let total = 0;
    let detalle = {};

    if (xUnidad && precioAdulto) {
        total = parseFloat(precioAdulto.price_day);
        detalle = {
            tipo: 'Por unidad',
            total: total
        };
    } else {
        const totalAdultos = precioAdulto ? parseFloat(precioAdulto.price_day) * adultos : 0;
        const totalMenores = precioMenor ? parseFloat(precioMenor.price_day) * menores : 0;
        total = totalAdultos + totalMenores;
        detalle = {
          tipo: 'Por pasajero',
          adultos: totalAdultos,
          menores: totalMenores,
        }; 
    }

    return {
        rate_title: data.rate_title,
        total,
        detalle,
        rate_code: data.rate_code,
    };
}