import { useCustomFetcher } from '~/hooks';

export default function Index() {
  const { submit: handleUserLogout } = useCustomFetcher();

  const handleLogout = () => {
    handleUserLogout(
      {},
      {
        action: '/logout',
        method: 'post',
      }
    );
  };

  return (
    <div className="font-sans p-4">
      <button onClick={handleLogout}>LOG OUT</button>
    </div>
  );
}
