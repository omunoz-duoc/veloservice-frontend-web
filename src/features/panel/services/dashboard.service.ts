import { httpClient } from "@/lib/api/http-client";

interface ActiveOTKpi {
    count: number;
}

interface DoneOTKpi {
    count: number;
}

interface DailyFinancialKpi {
    revenue: number;
    expenses: number;
    profit: number;
}

interface LowStockKpi {
    items: { name: string; stock: number }[];
}

interface PipelineColumn {
    name: string;
    otCount: number;
}

interface OrdenUrgente {
    id: string;
    cliente: string;
    fechaEntrega: string;
}

interface MecanicoActivo {
    id: string;
    nombre: string;
    otAsignadas: number;
}

interface ActividadItem {
    id: string;
    descripcion: string;
    fecha: string;
}

interface RentabRow {
    mes: string;
    rentabilidad: number;
}

export const authService: IDashboardService = {
    async getActiveOTsKpi() {
        return httpClient.get<ActiveOTKpi>("dashboard/kpis/active-ots");
    },

    async getDoneOTsKpi() {
        return httpClient.get<DoneOTKpi>("dashboard/kpis/done-ots");
    },

    async getDailyFinancialKpi() {
        return httpClient.get<DailyFinancialKpi>("dashboard/kpis/daily-financial");
    },

    async getLowStockKpi() {
        return httpClient.get<LowStockKpi>("dashboard/kpis/low-stock");
    },

    async getPipelineColumns() {
        return httpClient.get<PipelineColumn[]>("dashboard/pipeline-columns");
    },
    async getOrdenesUrgentes() {
        return httpClient.get<OrdenUrgente[]>("dashboard/ordenes-urgentes");
    },
    async getMecanicosActivos() {
        return httpClient.get<MecanicoActivo[]>("dashboard/mecanicos-activos");
    },
    async getActividadesRecientes() {
        return httpClient.get<ActividadItem[]>("dashboard/actividades-recientes");
    },
    async getRentabilidadMensual() {
        return httpClient.get<RentabRow[]>("dashboard/rentabilidad-mensual");
    }
};

export interface IDashboardService {
    getActiveOTsKpi(): Promise<ActiveOTKpi>;
    getDoneOTsKpi(): Promise<DoneOTKpi>;
    getDailyFinancialKpi(): Promise<DailyFinancialKpi>;
    getLowStockKpi(): Promise<LowStockKpi>;
    getPipelineColumns(): Promise<PipelineColumn[]>;
    getOrdenesUrgentes(): Promise<OrdenUrgente[]>;
    getMecanicosActivos(): Promise<MecanicoActivo[]>;
    getActividadesRecientes(): Promise<ActividadItem[]>;
    getRentabilidadMensual(): Promise<RentabRow[]>;
}
