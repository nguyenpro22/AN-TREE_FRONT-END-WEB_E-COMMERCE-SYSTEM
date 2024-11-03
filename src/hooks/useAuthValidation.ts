import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAccessToken,
  GetDataByToken,
  getRefreshToken,
  setAccessToken,
} from "@/utils";
import { ROLE } from "@/constants/role.constant";
import { adminRoutes, sellerRoutes } from "@/constants/route.constant";
import { useValidateTokenMutation } from "@/services/apis";

interface ValidationBody {
  accessToken: string;
  refreshToken: string;
}

export const useAuthValidation = () => {
  const [isValidating, setIsValidating] = useState(true);
  const router = useRouter();
  const [validateToken] = useValidateTokenMutation();

  useEffect(() => {
    const validateAuth = async () => {
      const accessToken = getAccessToken();

      if (!accessToken) {
        setIsValidating(false);
        return;
      }

      const validationBody: ValidationBody = {
        accessToken,
        refreshToken: getRefreshToken() || "",
      };

      try {
        const result = await validateToken(validationBody).unwrap();

        if (!result?.isSuccess) {
          setIsValidating(false);
          return;
        }

        setAccessToken(result.value.accessToken);
        const { role } = GetDataByToken(accessToken) as { role: string };
        const targetRoute =
          role === ROLE.ADMIN.toString()
            ? adminRoutes.DASHBOARD
            : sellerRoutes.DASHBOARD;

        router.push(targetRoute);
      } catch {
        setIsValidating(false);
      }
    };

    validateAuth();
  }, [router, validateToken]);

  return { isValidating };
};
