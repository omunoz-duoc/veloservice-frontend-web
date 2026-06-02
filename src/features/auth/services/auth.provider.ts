import { useMockServices } from "@/lib/api/service-mode"
import { authMock } from "./auth.mock"
import { authService as realAuthService } from "./auth.service"

export const authService = useMockServices ? authMock : realAuthService
