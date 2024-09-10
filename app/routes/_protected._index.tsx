import { useCustomFetcher } from "~/hooks";
import { Button } from "~/components/ui/button";

export default function Index() {
  const { submit: handleUserLogout } = useCustomFetcher();

  const handleLogout = () => {
    handleUserLogout(
      {},
      {
        action: "/logout",
        method: "post",
      },
    );
  };

  return (
    <div className="font-sans p-4">
      <Button onClick={handleLogout}>LOG OUT</Button>
    </div>
  );
}
