import { useMockServices } from "@/lib/api/service-mode"
import { finanzasMock } from "./finanzas.mock"
import { finanzasService as realFinanzasService } from "./finanzas.service"

export const finanzasService = useMockServices ? finanzasMock : realFinanzasService
