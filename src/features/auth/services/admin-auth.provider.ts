import { useMockServices } from "@/lib/api/service-mode"
import { adminAuthMock } from "./admin-auth.mock"
import { adminAuthService as realAdminAuthService } from "./admin-auth.service"

export const adminAuthService = useMockServices ? adminAuthMock : realAdminAuthService
