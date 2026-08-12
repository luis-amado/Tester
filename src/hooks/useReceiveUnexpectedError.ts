import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function useReceiveUnexpectedError(callback: () => void) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("err") === "unexpected") {
      callback();
    }
  }, [searchParams, callback]);
}
