import api from './api';

export interface IvaRate {
    id_iva: number;
    porcentaje: number;
    descripcion: string | null;
}

export const ivaService = {
    // Obtener todas las tasas de IVA
    async getAllIvaRates(): Promise<IvaRate[]> {
        try {
            const response = await api.get('/iva/');
            return response.data;
        } catch (error) {
            console.error('Error fetching IVA rates:', error);
            throw error;
        }
    },

    // Obtener una tasa de IVA específica por ID
    async getIvaRateById(id_iva: number): Promise<IvaRate> {
        try {
            const response = await api.get(`/iva/${id_iva}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching IVA rate:', error);
            throw error;
        }
    },

    // Calcular IVA para un producto
    calculateIva(price: number, quantity: number, ivaRate: IvaRate): {
        subtotal: number;
        iva: number;
        total: number;
    } {
        const subtotal = price * quantity;
        const iva = subtotal * (ivaRate.porcentaje / 100);
        const total = subtotal + iva;

        return {
            subtotal: Math.round(subtotal),
            iva: Math.round(iva),
            total: Math.round(total)
        };
    }
};
